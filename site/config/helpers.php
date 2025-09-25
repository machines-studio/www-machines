<?php

// Config helper to add a Page as a panel.menu entry
function menu ($kirby, string $uid) {
  $page = $kirby->page($uid);
  if (!$page) return;

  return [
    'icon' => $page->blueprint()->icon() ?? 'page',
    'label' => $page->title(),
    'link' => $page->panel()->url(),
    'current' => function (string $current) use ($uid) : bool {
      $path = Kirby\Cms\App::instance()->path();
      return Str::contains($path, "pages/$uid");
    }
  ];
}
