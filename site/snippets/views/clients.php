<?php
  $lang = kirby()->language()->code();

  snippet('components/Article', [], slots: true);
    slot('content');
      echo $page->blocks()->toBlocks();

      $data = [];
      foreach ($page
        ->clients()
        ->toStructure()
        ->groupBy(
          fn ($group) => $group->$lang()->or($group->fr())
        ) as $name => $group) {
        foreach ($group->first()->clients()->toStructure() as $client) {
          $data[$name][] = [$client->name(), $client->link()];
        }
      }

      snippet('components/Clients', ['data' => $data]);
    endslot();
  endsnippet();
