<?php

include_once 'helpers.php';
date_default_timezone_set('Europe/Paris');

return [
  'smartypants' => true,
  'languages' => ['detect' => true],

  'thumbs' => [
    'driver' => 'im',

    'srcsets' => [
      'default' => [
        '200w' => ['width' => 200, 'format' => 'webp'],
        '600w' => ['width' => 600, 'format' => 'webp'],
        '800w' => ['width' => 800, 'format' => 'webp'],
        '1200w' => ['width' => 1200, 'format' => 'webp'],
        '1600w' => ['width' => 1600, 'format' => 'webp'],
        '1920w' => ['width' => 1920, 'format' => 'webp']
      ]
    ],

    'sizes' => [
      'default' => '100vw',
      'small' => '1vw',
      'half' => implode(',', [
        '(max-width: 1024px) 100vw',
        '50vw'
      ]),
      'card' => implode(',', [
        '(max-width: 800px) 100vw',
        '(max-width: 1024px) 25vw',
        '20vw'
      ])
    ]
  ],

  'sitemap' => [
    'ignore' => ['error', 'legals', 'sitemap']
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
      'home' => menu($kirby, 'home')
    ],
    // Listed
    (function () use ($kirby) {
      $items = ['-'];
      foreach ($kirby->site()->children()->listed() as $group) {
        $id = $group->slug();
        $items[$id] = menu($kirby, $id);
      }
      return $items;
    })(),
    // Unlisted
    (function () use ($kirby) {
      $items = ['-'];
      foreach ($kirby->site()->children()->unlisted() as $group) {
        $id = $group->slug();
        $items[$id] = menu($kirby, $id);
      }
      return $items;
    })(),
    [
      '-',
      'users',
      'matomo',
      'languages',
      'system',
    ])
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

    [ // Sitemap for humans
      'pattern' => 'logo',
      'action' => function () {
        return new Page(['slug' => 'logo', 'template' => 'logo']);
      }
    ],

    [ // Quick panel access from any page by appending /panel to the url
      'pattern' => '(fr|en)/(:all)/panel',
      'action' => function ($lang, $uid) {
        if ($page = page($uid)) return go($page->panel()->url() . "?language=$lang");
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
