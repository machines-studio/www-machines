<?php
  $media ??= null;
  if (!$media) return;

  $sizes ??= null;
  $lazyload ??= null;

  $autoplay ??= null;
  $muted ??= null;
  $controls ??= null;

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
      'lazyload' => $lazyload,
      'controls' => $controls
    ]);
    break;
  }
?>
