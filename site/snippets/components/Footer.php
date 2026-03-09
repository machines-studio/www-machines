<?php
  $groups = [
    'primary' => [
      [
        'url' => r($site->email()->isNotEmpty(), 'mailto:' . $site->email()),
        'title' => 'email',
        'attributes' => [
          'href' => [
            'value' => 'mailto:' . Str::encode($site->email()),
            'escape' => false
          ]
        ]
      ],
      [
        'url' => r($site->instagram()->isNotEmpty(), 'https://instagram.com/' . $site->instagram()),
        'title' => 'instagram'
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

            echo snippet('html/link', $item);
          ?>
        </li>
      <?php endforeach ?>
    </ul>
  <?php endforeach ?>
</footer>
