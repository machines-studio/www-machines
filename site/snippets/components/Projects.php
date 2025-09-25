<?php
  $projects ??= new Collection();
  $tags = $page->taxonomy()->toTaxonomies($projects->pluck('tags', ',', true));
?>

<section class='projects'>
  <ul class='projects__items'>
    <?php for ($i = 0; $i < 1; $i++) : // DEBUG ?>
    <?php foreach ($projects as $project) : ?>
      <li>
        <?php snippet('components/ProjectCard', ['project' => $project]) ?>
      </li>
    <?php endforeach ?>
    <?php endfor // DEBUG ?>
  </ul>

  <nav class='projects__filter'>
    <?php snippet('components/HueShifter', [
      'tag' => 'button',
      'content' => snippet('svg/view-grid', [], true) // TODO go to grid view
    ]) ?>

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
        'attributes' => ['id' => 'clear-filter']
      ]) ?>
    </fieldset>

    <?php snippet('components/HueShifter', [
      'tag' => 'button',
      'content' => snippet('svg/shuffle', [], true) // TODO go to shuffled view
    ]) ?>
  </nav>
</section>
