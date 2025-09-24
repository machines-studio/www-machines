<?php
  $media ??= null;
  if (!$media) return;

  $lazyload ??= null;
  $autoplay ??= null;
  $muted ??= null;
  $sizes ??= null;

  switch ($media->type()) {
    case 'image':
    snippet('html/image', [
      'image' => $media,
      'lazyload' => $lazyload,
      'sizes' => $sizes
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
