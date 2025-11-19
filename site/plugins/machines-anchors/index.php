<?php

namespace machines;
use Kirby;
use Kirby\Toolkit\Str;
use Kirby\Toolkit\Html;

Kirby::plugin('machines/anchors', [
  'options' => [
    'headlines' => 'h2|h3'
  ],

  'hooks' => [
    'kirbytext:after' => [
      fn ($text) => preg_replace_callback(
        '!<(' . option('machines.anchors.headlines') . ')>(.*?)</\\1>!s',
        fn ($match) => Html::tag(
          $match[1],
          [$match[2]],
          ['id' => Str::slug(Str::unhtml($match[2]))]
        ),
        $text
      )
    ]
  ]
]);
