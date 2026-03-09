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
    <div class='pubdate'>
      <?php foreach ($page->year()->toEntries() as $year) : ?>
        <time datetime='<?= $year->kirbytextinline() ?>'><?= $year->kirbytextinline() ?></time>
      <?php endforeach ?>
    </div>

    <?= $page->credits()->markdown() ?>
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
