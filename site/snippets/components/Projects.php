<?php
  $pages ??= new Collection();
  $tags = $page->taxonomy()->toTaxonomies($pages->pluck('tags', ',', true));
?>

<section class='projects'>
  <?php snippet('components/Cards', [
    'pages' => $pages,
    'layout' => 'grid'
  ]) ?>

  <nav class='projects__filter'>
    <fieldset>
      <input id='toggle-search' type='checkbox'>

      <?php snippet('components/HueShifter', [
        'tag' => 'label',
        'content' => snippet('svg/search', [], true),
        'attributes' => ['for' => 'toggle-search']
      ]) ?>

      <?php snippet('components/HueShifter', [
        'tag' => 'input',
        'attributes' => [
          'type' => 'search',
          'name' => 'filter',
          'placeholder' => t('projects.filter.search.placeholder')
        ]
      ]) ?>

      <?php foreach ($tags as $tag) {
        snippet('components/HueShifter', [
          'tag' => 'a',
          'content' => $tag,
          'attributes' => [
            'data-tag' => $tag->slug(),
            // TODO[next] concurrent multiple tags
            'class' => r(param('tag') === $tag->slug(), 'is-active'),
            'href' => url($page->url(), [
              'query' => get(),
              'params' => array_merge(params(), ['tag' => $tag->slug()])
            ])
          ]
        ]);
      } ?>

      <?php snippet('components/HueShifter', [
        'tag' => 'button',
        'content' => snippet('svg/xmark', [], true),
        'attributes' => [
          'id' => 'clear-filter',
          'aria-label' => t('projects.filter.clear')
        ]
      ]) ?>
    </fieldset>
  </nav>
</section>
