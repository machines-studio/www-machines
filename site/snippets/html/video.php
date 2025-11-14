<?php
  if (!($video ?? null)) return;

  $attributes ??= [];
  $lazyload ??= true;
  $autoplay ??= true;
  $controls ??= false;
  $loop ??= true;
  $muted ??= $autoplay;

  $caption ??= $video->caption()->kirbytext();

  $alt = isset($alt)
    ? Escape::html($alt)
    : Str::slug($site->title() . '_' . $video->parent()->title()) . '_' . $video->filename();

  $width = $video->width();
  $height = $video->height();
?>

<figure
  <?= attr($attributes) ?>
  class='video <?= $attributes['class'] ?? '' ?>'
>
  <video
    <?= attr([
      'playsinline' => true,
      'autoplay' => $autoplay,
      'controls' => $controls,
      'loop' => $loop,
      'muted' => $muted,
      'preload' => $lazyload ? 'none' : 'auto',
      'onmouseenter' => $lazyload ? 'event.target.setAttribute("preload", "metadata")' : null,
      'alt' => $alt,
      'width' => $width,
      'height' => $height,
      'draggable' => 'false'
    ]) ?>
  >
    <source src='<?= $video->url() ?>' type='<?= $video->mime() ?>' />
  </video>
  <figcaption>
    <?= $caption ?>
  </figcaption>
</figure>
