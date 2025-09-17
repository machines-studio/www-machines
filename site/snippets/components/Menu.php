<input id='toggle-menu' type='checkbox'>

<menu class='menu'>
  <h1>
    <a href='<?= $site->url() ?>' title='<?= t('menu.go-home') ?>'>
      <?php snippet('svg/machines.nut.black') ?>
      <span><?= $site->title()?></span>
    </a>
  </h1>

  <label for='toggle-menu'>
    <?php snippet('svg/hamburger') ?>
  </label>

  <ul class='menu__links'>
    <?php foreach ($site->children()->listed() as $child) {
      snippet('components/HueShifter', [
        'tag' => 'li',
        'attributes' => ['class' => 'menu__link'],
        'content' => Html::a($child->url(), $child->title(), ['class' => r($child->isActive(), 'is-active')], true)
      ]);
    } ?>
  </ul>
</menu>
