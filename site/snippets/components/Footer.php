<?php
  $groups = [
    'primary' => [
      ['mailto:' . $site->email()],
      [
        r($site->instagram()->isNotEmpty(), 'https://instagram.com/' . $site->instagram()),
        'instagram',
        ['target' => '_blank']
      ]
    ],

    'secondary' => [
      page('legals'),
      page('sitemap'),
      snippet('components/Languages', [], true)
    ]
  ];
?>

<footer class='footer'>
  <?php foreach ($groups as $group) : ?>
    <ul class='footer__links'>
      <?php foreach ($group as $item) : ?>
        <li class='footer__link'>
          <?php
            // Handle string
            if (is_string($item)) {
              echo $item;
              continue;
            }

            // Convert Page to array
            if ($item instanceof \Kirby\Cms\Page) {
              $item = [$item->url(), $item->title()];
            }

            echo Html::a($item[0], $item[1] ?? null, $item[2] ?? [])
          ?>
        </li>
      <?php endforeach ?>
    </ul>
  <?php endforeach ?>
</footer>
