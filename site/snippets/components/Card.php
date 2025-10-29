<?php
  $page ??= null;
  if (!$page) return;

  $filter ??= implode('|', [
    $page->title(),
    ...array_merge(...$page->year()->toEntries()->toArray()),
    ...$page->tags()->toTaxonomies()
  ]);

  $attributes ??= [];
?>

<a <?= attr([
  ...$attributes,
  'href' => $page->url(),
  'class' => 'card ' . ($attributes['class'] ?? ''),
  'aria-label' => $page->title(),
  'data-filter' => $filter,
  'style' => '--card-seed: '. rand() .';'
]) ?>>
  <?php snippet('components/Tooltip', ['content' => $page->title()]) ?>
  <?php snippet('html/image', [
    'image' => $page->thumbnail()->toFile(),
    'sizes' => option('thumbs.sizes.card')
  ]) ?>
</a>
