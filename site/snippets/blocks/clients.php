<?php
  $lang = kirby()->language()->code();
  $data = [];

  foreach ($block
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
