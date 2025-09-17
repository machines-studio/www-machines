<nav class='languages'>
  <ul>
    <?php foreach ($kirby->languages()->flip() as $language) {
      echo Html::tag('li', [
        Html::a($page->url($language->code()), $language->code(), [
          'hreflang' => $language->code(),
          'class' => [
            'no-barba',
            $kirby->language() == $language ? 'is-active' : null
          ]
        ])
      ]);
    } ?>
</nav>
