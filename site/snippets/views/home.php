<?php
  snippet('svg/machines.letters');

  $projects = $site->index()->filterBy('intendedTemplate', 'project')->shuffle();
  for ($i = 0; $i < 3; $i++) {
    snippet('components/ProjectCard', [
      'project' => $projects->nth($i)
    ]);
  }

  snippet('components/Article', [], slots: true);
    slot('content');
      echo $page->blocks()->toBlocks();
    endslot();
  endsnippet();
