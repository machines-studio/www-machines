<?php
  $medias = $block->medias()->toFiles();
  $count = $medias->count();
  $caption = $block->caption()->kirbytextinline();
?>

<section
  class='gallery'
  data-count='<?= $count ?>'
  style='--gallery-columns-count: <?= $medias->count() ?>'
>
  <ul>
    <?php foreach ($medias as $media) : ?>
      <li>
        <?php snippet('html/media', [
          'media' => $media,
          'lazyload' => true,
          'autoplay' => true,
          'controls' => true,
          'sizes' => $count >= 2
            ? option('thumbs.sizes.half')
            : option('thumbs.sizes.default')
        ]) ?>
      </li>
    <?php endforeach ?>
  </ul>

  <?php if (trim($caption ?? '')) : ?>
    <figcaption><p><?= $caption ?></p></figcaption>
  <?php endif ?>
</section>
