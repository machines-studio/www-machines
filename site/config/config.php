<?php

include_once 'helpers.php';
date_default_timezone_set('Europe/Paris');

return [
  'date' => [
    'handler' => 'intl',
    'formats' => [
      'file' => intl('yyyyMMdd'),
      'iso' => intl('yyyy-MM-dd'),
      'full' => intl('dd MMMM yyyy')
    ]
  ],

  'thumbs' => [
    'presets' => [
      'default' => ['width' => 1920],
      'card' => ['width' => 800]
    ]
  ],

  'panel' => [
    'menu' => fn ($kirby) => array_merge([
      'site' => [
        'label' => 'Site',
        'icon' => 'smile',
        'current' => function () : bool {
          $links = ['site'];
          $path  = Kirby\Cms\App::instance()->path();
          return Str::contains($path, 'site');
        }
      ],
      '-',
      'home' => menu($kirby, 'home'),
      'agenda' => menu($kirby, 'agenda'),
      '-',
    ],
    (function () use ($kirby) {
      $items = [];
      foreach ($kirby->site()->children()->listed() as $group) {
        $id = $group->slug();
        $items[$id] = menu($kirby, $id);
      }
      return $items;
    })(),
    [
      '-',
      'les-cahiers' => menu($kirby, 'les-cahiers'),
      'legals' => menu($kirby, 'legals'),
      'error' => menu($kirby, 'error'),
      '-',
      'users',
      'languages',
      'retour',
      'system'
    ])
  ],

  'sitemap' => [
    'ignore' => ['error']
  ],

  'routes' => [
    [ // Sitemap for robots
      'pattern' => ['sitemap.xml', 'sitemap_index.xml'],
      'action'  => function () {
        $content = snippet('html/sitemap', [
          'pages' => site()->pages()->index(),
          'ignore' => kirby()->option('sitemap.ignore', ['error'])
        ], true);
        return new Kirby\Cms\Response($content, 'application/xml');
      }
    ],

    [ // Sitemap for humans
      'pattern' => 'sitemap',
      'action' => function () {
        return new Page(['slug' => 'sitemap', 'template' => 'sitemap']);
      }
    ],

    [ // Quick panel access from any page by appending /panel to the url
      'pattern' => '(:all)/panel',
      'action' => function ($uid) {
        if ($page = page($uid)) return go($page->panel()->url());
        return go('/panel');
      }
    ]
  ],

  'ready' => fn () => [
    'panel' => [
      'css' => vite()->panelCss('panel.js'),
      'js' => vite()->panelJs('panel.js')
    ]
  ]
];
