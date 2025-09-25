<?php
  use \Kirby\Image\Focus;
  if (!($image ?? null)) return;

  $lazyload ??= true;
  $caption ??= $image->caption()->kirbytext();
  $alt ??= Escape::html($alt ?? ($site->title() . '_' . $image->parent()->title()) . '_' . $image->filename());
  $attributes ??= [];

  $sizes ??= option('thumbs.sizes.default');
  $focus = Focus::parse($image->focus());
?>

<figure
  <?= attr($attributes) ?>
  class='image <?= $attributes['class'] ?? '' ?>'
>
  <picture>
    <source
      srcset='<?= $image->srcset('avif') ?>'
      sizes='<?= $sizes ?>'
      type='image/avif'
    >

    <source
      srcset='<?= $image->srcset('webp') ?>'
      sizes='<?= $sizes ?>'
      type='image/webp'
    >

    <img <?= attr([
      'loading' => $lazyload ? 'lazy' : false,
      'alt' => $alt,
      'src' => $image->resize(300)->url(),
      'srcset' => $image->srcset(),
      'sizes' => $sizes,
      'width' => $image->resize(1920)->width(),
      'height' => $image->resize(1920)->height(),
      'style' => [
        "--focus-x: %;" . ($focus[0] ?? 0.5) * 100 . '%;',
        '--focus-y: ' . ($focus[1] ?? 0.5) * 100 . '%;'
      ]
    ])?>>
  </picture>

  <figcaption><?= $caption ?></figcaption>
</figure>
