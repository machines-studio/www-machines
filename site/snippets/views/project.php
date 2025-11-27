<?php
  $lang = kirby()->language()->code();
  $blocks = $page->blocks()->toBlocks();
?>

<?php snippet('components/Slideshow', ['medias' => $page->slideshow()->toFiles()]) ?>

<h2>
  <?= $page->title() ?>
</h2>

<header>
  <aside>
    <ul class='metas'>
      <li class='meta' data-name='year'>
        <?php foreach ($page->year()->toEntries() as $year) : ?>
          <div class='year'><?= $year->kirbytextinline() ?></div>
        <?php endforeach ?>
      </li>

      <?php foreach ($page->credits()->toStructure() as $credit) : ?>
        <li class='meta' data-name='<?= $credit->$lang()->or($credit->fr()) ?>'>
          <ul class='meta__entries'>
            <?php foreach ($credit->entries()->toEntries() as $entry) : ?>
            <li class='meta__entry'>
              <?php
                // Format some people working at chevalvert as * tooltip
                $regex = '/(.*?)[,\s\(](\s+)?chevalvert/i';
                $peoples = ['Arnaud Juracek', 'Stéphane Buellet'];
                preg_match($regex, $entry, $matches);
                echo in_array(trim($matches[1] ?? ''), $peoples)
                  ? trim($matches[1]) . Html::tag('span', '✳', ['title' => t('project.meta.chevalvert')])
                  : $entry;
              ?>
            </li>
          <?php endforeach ?>
        </ul>
      </li>
      <?php endforeach ?>
    </ul>
  </aside>

  <?= $blocks->first() ?>
</header>

<?php snippet('components/Article', [], slots: true) ?>
  <?php slot('content') ?>
    <?php foreach ($blocks->slice(1) as $block) : ?>
      <?= $block ?>
    <?php endforeach ?>
  <?php endslot() ?>
<?php endsnippet() ?>
