<?php
  $text = $block->text()->kirbytext();
  $cta = $block->cta()->isNotEmpty()
    ? $block->cta()->toObject()
    : null;

  if (!(trim($text) || $cta)) return;
?>

<header class='prose'>
  <?= $text ?>

  <?php if ($cta) : ?>
    <a class='cta' href='<?= $cta->link()->toUrl() ?>'>
      <?= $cta->text()->html() ?>
    </a>
  <?php endif ?>
</header>


