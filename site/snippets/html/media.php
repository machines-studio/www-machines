<?php
  $media ??= null;
  if (!$media) return;

  $lazyload ??= null;
  $autoplay ??= null;
  $preset ??= null;
  $muted ??= null;

  switch ($media->type()) {
    case 'image':
    snippet('html/image', [
      'image' => $media,
      'preset' => $preset,
      'lazyload' => $lazyload
    ]);
    break;

    case 'video':
    snippet('html/video', [
      'video' => $media,
      'muted' => $muted,
      'autoplay' => $autoplay,
      'lazyload' => $lazyload
    ]);
    break;
  }
?>
