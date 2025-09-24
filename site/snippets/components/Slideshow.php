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
        'data-crop' => $media->croppable()->or('true')->isTrue(),
        'style' => '--figure-color-background: ' . $media->color()
      ]) ?>>
        <?php snippet('html/media', [
          'media' => $media,
          'autoplay' => $medias->indexOf($media) === 0,
          'muted' => true
        ]) ?>
      </li>
    <?php endforeach ?>
  </ul>
</section>
