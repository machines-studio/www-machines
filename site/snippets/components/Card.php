<?php
  $page ??= null;
  if (!$page) return;

  $chrome ??= $page->hasChrome()->bool();
  $chromeTitle ??= $page->chromeTitle()->or($page->title());

  $filter ??= implode('|', [
    Str::unhtml($page->title()),
    ...array_map(
      fn ($year) => Str::unhtml($year->kirbytextinline()),
      $page->year()->toEntries()->values()
    ),
    ...array_map(
      fn ($tag) => implode('|', array_map(fn ($value) => Str::slug($value), $tag->value)),
      $page->tags()->toTaxonomies()
    )
  ]);

  $attributes ??= [];
?>

<a <?= attr([
  ...$attributes,
  'href' => $page->url(),
  'class' => 'card ' . ($attributes['class'] ?? ''),
  'aria-label' => Str::unhtml($page->title()),
  'data-filter' => $filter,
  'data-chrome' => $chrome ? $chromeTitle : null,
  'style' => '--card-seed: '. rand() .';'
]) ?>>
  <?php snippet('components/Tooltip', ['content' => $page->title()]) ?>
  <?php snippet('html/image', [
    'image' => $page->thumbnail()->toFile(),
    'sizes' => option('thumbs.sizes.card')
  ]) ?>
</a>
