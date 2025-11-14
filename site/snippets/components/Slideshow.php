<?php
  $medias ??= [];
  if (!count($medias)) return;
  $medias = new Collection($medias);

  $delay ??= 4000; // ms
?>

<section class='slideshow' data-delay='<?= $delay ?>'>
  <?php if (count($medias) > 1) : ?>
    <ul class='slideshow__dots'>
      <?php foreach ($medias as $media) {
        snippet('components/HueShifter', [
          'tag' => 'li',
          'attributes' => [
            'class' => 'slideshow__dot',
            'data-type' => $media->type()
          ]
        ]);
      } ?>
    </ul>
  <?php endif ?>

  <ul class='slideshow__container'>
    <?php foreach ($medias as $media) : ?>
      <li <?= attr([
        'class' => 'slideshow__slide',
        'data-crop' => $media->croppable()->isTrue(),
        'data-rounded' => $media->rounded()->isTrue(),
        'style' => $media->color()->isNotEmpty()
          ? '--slideshow-slide-background: ' . $media->color()
          : null
      ]) ?>>
        <?php snippet('html/media', [
          'media' => $media,
          'lazyload' => $medias->indexOf($media) > 0,
          'autoplay' => $medias->indexOf($media) === 0,
          'muted' => true
        ]) ?>
      </li>
    <?php endforeach ?>
  </ul>
</section>
