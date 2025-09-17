<?php
  $links = [
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
  <?php foreach ($links as $l) : ?>
    <ul class='footer__links'>
      <?php foreach ($l as $link) {
        // Handle string
        if (is_string($link)) {
          echo $link;
          continue;
        }

        // Convert Page to array
        if ($link instanceof \Kirby\Cms\Page) {
          $link = [$link->url(), $link->title()];
        }

        // Render <li><a></li>
        e($link[0] ?? null, Html::tag(
          'li',
          [Html::a($link[0], $link[1] ?? null, $link[2] ?? [])],
          ['class' => 'footer__link']
        ));
      } ?>
    </ul>
  <?php endforeach ?>
</footer>
