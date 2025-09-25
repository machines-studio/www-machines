<?php
  $medias = $block->medias()->toFiles();
  $count = $medias->count()
?>

<section
  class='gallery'
  data-count='<?= $count ?>'
  style='--gallery-columns-count: <?= $medias->count() ?>'
>
  <ul>
    <?php foreach ($medias as $media) : ?>
      <li <?= attr(['data-crop' => $media->croppable()->isTrue()]) ?>>
        <?php snippet('html/media', [
          'media' => $media,
          'lazyload' => true,
          'autoplay' => true,
          'sizes' => $count >= 2
            ? option('thumbs.sizes.half')
            : option('thumbs.sizes.default')
        ]) ?>
      </li>
    <?php endforeach ?>
  </ul>
</section>
