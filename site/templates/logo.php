<?php snippet('html/header') ?>

<main data-barba-namespace='<?= $view = $page->intendedTemplate()->name() ?>'>
  <section class='white'>
    <?php snippet('svg/machines.nut.black') ?>
  </section>

  <section class='black'>
    <?php snippet('svg/machines.nut.white') ?>
  </section>
</main>

<?php snippet('html/footer') ?>
