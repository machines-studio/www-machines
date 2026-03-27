<?php
  $title ??= $slots->title() ?? null;
  $header ??= $slots->header() ?? null;
  $content ??= $slots->content() ?? null;

  if (!trim(($title ?? '') . ($header ?? '') . ($content ?? ''))) return;

  $attributes ??= [];
  $attributes['class'] = 'article ' . ($attributes['class'] ?? '');
?>

<article <?= attr($attributes) ?>>
  <?php if ($title) : ?>
    <h2><?= $title ?></h2>
  <?php endif ?>

  <?php if ($header) : ?>
    <header class='prose'>
      <?= $header ?>
    </header>
  <?php endif ?>

  <?= $content ?>
</article>
