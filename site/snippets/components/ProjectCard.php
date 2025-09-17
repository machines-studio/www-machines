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
  <?php snippet('html/image', [
    'image' => $project->thumbnail()->toFile(),
    'preset' => 'card'
  ]) ?>
</a>
