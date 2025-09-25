<?php

include_once 'helpers.php';
date_default_timezone_set('Europe/Paris');

return [
  'thumbs' => [
    'sizes' => [
      'default' => '100vw',
      'half' => implode(',', [
        '(max-width: 1024px) 100vw',
        '50vw'
      ]),
      'card' => implode(',', [
        '(min-width: 1024px) 33vw',
        '(min-width: 800px) 50vw',
        '100vw'
      ])
    ],

    'srcsets' => (function () {
      $srcsets = [
        '300w' => ['width' => 300, 'quality' => 100],
        '400w' => ['width' => 400, 'quality' => 100],
        '800w' => ['width' => 800, 'quality' => 100],
        '960w' => ['width' => 960, 'quality' => 100],
        '1280w' => ['width' => 1280, 'quality' => 100],
        '1920w' => ['width' => 1920, 'quality' => 100]
      ];

      return [
        'default' => $srcsets,
        'avif' => array_map(fn ($srcset) => [...$srcset, 'format' => 'avif'], $srcsets),
        'webp' => array_map(fn ($srcset) => [...$srcset, 'format' => 'webp'], $srcsets)
      ];
    })()
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
      'legals' => menu($kirby, 'legals'),
      'error' => menu($kirby, 'error'),
      '-',
      'users',
      'languages',
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
