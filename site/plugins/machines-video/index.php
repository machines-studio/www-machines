<?php

namespace Machines;

use Kirby;
use Kirby\Cms\File;
use Kirby\Toolkit\F;
use Kirby\Toolkit\Str;
use Kirby\Toolkit\Html;
use Kirby\Http\Response;
use FFMpeg\FFMpeg;
use FFMpeg\Coordinate\TimeCode;
use FFMpeg\Format\Video\X264;
use FFMpeg\Format\Video\WebM;

Kirby::plugin('machines/video', [
  'options' => [
    'file.suffix' => '.optm',
    'poster.suffix' => '.poster',
    'poster.timecode' => 1, // seconds

    // SEE https://github.com/PHP-FFMpeg/PHP-FFMpeg?tab=readme-ov-file#ffmpeg
    'ffmpeg.binaries' => null,
    'ffprobe.binaries' => null,
    'timeout' => 3600, // The timeout for the underlying process
    'ffmpeg.threads' => 12, // The number of threads that FFMpeg should use
  ],

  'routes' => [
    [
      'pattern' => '(:all)/optimize-videos',
      'language' => '*',
      'action' => function ($language, $slug) {
        $kirby = kirby();
        if (!$kirby->user()?->isAdmin()) return new Response('Forbidden', '403');

        $page = page($slug);
        if (!$page) return $this->next();

        // Find all raw videos
        $videos = $page->videos()->filter(fn ($video) => !$video->isFromOptimized());
        if (!$videos->count()) return 'No video to optimize.';

        set_time_limit(0);
        foreach ($videos as $video) {
          kirby()->trigger('file.create:after', ['file' => $video]);
        }

        return '🚀 Done.';
      }
    ]
  ],

  'fileMethods' => [
    'poster' => function () : ?File {
      $filename = $this->name();
      return $this->page()->file($filename . option('machines.video.poster.suffix') . '.jpg');
    },

    'optimizedSources' => function () : array {
      $filename = $this->name();
      $root = dirname($this->realpath());
      $page = $this->page();

      $sources = [];
      foreach ([
        ['ext' => 'webm', 'type' => 'video/webm'],
        ['ext' => 'mp4', 'type' => 'video/mp4']
      ] as $source) {
        $file = $page->file($filename . option('machines.video.file.suffix') . ".{$source['ext']}");
        if (!$file?->exists()) continue;

        $sources[] = [
          'src' => $file->url(),
          'type' => $source['type']
        ];
      }

      // Fallback to non-optimized source
      if (empty($sources)) $sources = [['src' => $this->url(), 'type' => $this->mime()]];

      return array_map(fn ($source) => Html::tag('source', '', $source), $sources);
    },

    'isFromOptimized' => function () : bool {
      return Str::endsWith($this->name(), option('machines.video.file.suffix'));
    }
  ],

  'hooks' => [
    // Optimize video at creation (mp4, webm, poster)
    'file.create:after' => function (File $file) {
      if ($file->type() != 'video') return;

      if ($file->isFromOptimized()) return;

      set_time_limit(0);
      $ffmpeg = FFMpeg::create([
        'ffmpeg.binaries' => option('machines.video.ffmpeg.binaries'),
        'ffprobe.binaries' => option('machines.video.ffprobe.binaries'),
        'timeout' => option('machines.video.timeout'),
        'ffmpeg.threads' => option('machines.video.ffmpeg.threads')
      ]);

      $path = $file->realpath();
      $video = $ffmpeg->open($path);

      // Resize to max 1920w or 1080p, width and height are divisible by 2
      $video
        ->filters()
        ->custom('scale=trunc(min(1920\,iw)/2)*2:trunc(min(1080\,ih)/2)*2:force_original_aspect_ratio=decrease');

      // Extract poster
      $poster = $video->frame(TimeCode::fromSeconds(option('machines.video.poster.timecode')));

      // Prepare mp4
      $mp4 = new X264('aac', 'libx264');
      $mp4->setKiloBitrate(0); // allow CRF mode
      $mp4->setAdditionalParameters([
          '-preset', 'slow',
          '-crf', '20',
          '-pix_fmt', 'yuv420p',
          '-movflags', '+faststart'
      ]);

      // Prepare ebm
      $webm = new WebM();
      $webm->setVideoCodec('libvpx-vp9');
      $webm->setKiloBitrate(0);
      $webm->setAdditionalParameters([
        '-crf', '30',
        '-preset', '4'
      ]);

      // Write files
      $root = dirname($path);
      $filename = $file->name();
      $video->save($mp4, $root . "/$filename" . option('machines.video.file.suffix') . '.mp4');
      $video->save($webm, $root . "/$filename" . option('machines.video.file.suffix') . '.webm');
      $poster->save($root . "/$filename" . option('machines.video.poster.suffix') . '.jpg');
    }
  ]
]);
