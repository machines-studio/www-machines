<?php $medias = $block->medias()->toFiles() ?>

<section
  class='gallery'
  data-count='<?= $medias->count() ?>'
  style='--gallery-columns-count: <?= $medias->count() ?>'
>
  <ul>
    <?php foreach ($medias as $media) : ?>
      <li <?= attr(['data-crop' => $media->croppable()->isTrue()]) ?>>
        <?php snippet('html/media', [
          'media' => $media,
          'lazyload' => true,
          'autoplay' => true
          // 'preset' => // TODO
        ]) ?>
      </li>
    <?php endforeach ?>
  </ul>
</section>
