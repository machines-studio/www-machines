<?php snippet('components/Article', [
  'title' => $page->title()
], slots: true) ?>
  <?php slot('content') ?>
    <?php foreach ($page->blocks()->toBlocks() as $block) : ?>
      <?= $block ?>
    <?php endforeach ?>
  <?php endslot() ?>
<?php endsnippet() ?>
