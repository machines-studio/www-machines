<?php
  $medias ??= [];
  if (!count($medias)) return;

  $delay ??= 4000; // ms

  $medias = new Collection($medias);
?>

<section class='slideshow' data-delay='<?= $delay ?>'>
  <?php if (count($medias) > 1) : ?>
    <div class='slideshow__dots'>
      <?php foreach ($medias as $media) : ?>
        <div class='slideshow__dot'></div>
      <?php endforeach ?>
    </div>
  <?php endif ?>

  <ul class='slideshow__container'>
    <?php foreach ($medias as $media) : ?>
      <li class='slideshow__slide'>
        <?php // TODO handle video media ?>
        <?php snippet('html/image', [
          'image' => $media,
          'lazyload' => $medias->indexOf($media) !== 0
        ]) ?>
      </li>
    <?php endforeach ?>
  </ul>
</section>
