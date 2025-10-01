<?php
  $project ??= null;
  if (!$project) return;

  $filter ??= implode('|', [
    $project->title(),
    ...array_merge(...$project->year()->toEntries()->toArray()),
    ...$project->tags()->toTaxonomies()
  ]);
?>

<a
  href='<?= $project->url() ?>'
  class='project-card'
  aria-label='<?= $project->title() ?>'
  data-filter='<?= $filter ?>'
>
  <?php snippet('components/Tooltip', ['content' => $project->title()]) ?>
  <?php snippet('html/image', [
    'image' => $project->thumbnail()->toFile(),
    'sizes' => option('thumbs.sizes.card')
  ]) ?>
</a>
