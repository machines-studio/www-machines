<section class='splashscreen'>
  <?php snippet('svg/machines.letters') ?>
  <?php snippet('components/Cards', [
    'layout' => 'fan',
    'pages' => $page->projects()->toPages()
  ]) ?>
</section>

<?php
  snippet('components/Article', [], slots: true);
    slot('content');
      echo $page->blocks()->toBlocks();
    endslot();
  endsnippet();
?>
