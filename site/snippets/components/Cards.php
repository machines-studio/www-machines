<?php
  $pages ??= new Collection();
  $layout ??= 'grid'; // grid|stack|fan
  $attributes ??= [];

  if ($pages->isEmpty()) return;
?>

<ul <?= attr([
  ...$attributes,
  'class' => 'cards ' . ($attributes['class'] ?? ''),
  'data-layout' => $layout,
]) ?>>
  <?php foreach ($pages as $page) {
    $index = $pages->indexof($page);
    $normalizedIndex = $index / max(1, ($pages->count() - 1));
    $seed = rand();
    echo Html::tag(
      'li',
      [snippet('components/Card', compact('page'), true)],
      [
        'class' => 'card-slot',
        'style' => implode(';', [
          "--card-slot-index: {$index}",
          "--card-slot-seed: {$seed}",
          "--card-slot-index-normalized: {$normalizedIndex}"
        ])
      ]
    );
  } ?>
</ul>
