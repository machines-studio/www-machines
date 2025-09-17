<?php
  $attributes ??= [];
  $attributes['class'] = 'article ' . ($attributes['class'] ?? '');

  $title ??= $slots->title() ?? null;
  $header ??= $slots->header() ?? null;
  $content ??= $slots->content() ?? null;
?>

<article <?= attr($attributes) ?>>
  <?php if ($header) : ?>
    <header class='prose'><?= $header ?></header>
  <?php else : ?>
    <h2><?= $title ?></h2>
  <?php endif ?>

  <?= $content ?>
</article>
