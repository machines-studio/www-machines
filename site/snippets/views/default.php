<?php snippet('components/Article', [
  'title' => $page->title()
], slots: true) ?>
  <?php slot('content') ?>
    <?php foreach ($page->blocks()->toBlocks() as $block) : ?>
      <section>
        <?= $block ?>
      </section>
    <?php endforeach ?>
  <?php endslot() ?>
<?php endsnippet() ?>
