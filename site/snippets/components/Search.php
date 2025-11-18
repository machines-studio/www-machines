<input type='checkbox' id='toggle-search'>

<section class='search'>

  <form>
    <?php snippet('components/HueShifter', [
      'tag' => 'div',
      'attributes' => ['class' => 'search__input']
    ], slots: true) ?>
      <?php slot('content') ?>
        <?php snippet('svg/search') ?>
        <input
          autofocus
          required
          type='search'
          name='q'
          placeholder='<?= t('search.placeholder') ?>'
          value='<?= get('q') ?>'
        />
        <label for='toggle-search' aria-label='<?= t('search.toggle') ?>'>
          <?php snippet('svg/xmark') ?>
        </label>
      <?php endSlot() ?>
    <?php endSnippet() ?>

    <ul class='search__results'>
      <?php foreach ($site->index()->filterBy('intendedTemplate', 'project') as $project) : ?>
        <li
          class='search__result'
          data-filter='<?= implode('|', [
            Str::unhtml($project->title()),
            $project->id()
          ]) ?>'
        >
          <a href='<?= $project->url() ?>' tabindex='-1'>
            <?php snippet('html/image', [
              'image' => $project->thumbnail()->toFile(),
              'sizes' => option('thumbs.sizes.small')
            ]) ?>
            <span class='title'><?= $project->title() ?></span>
          </a>
        </li>
      <?php endforeach ?>
    </ul>
  </form>
</section>
