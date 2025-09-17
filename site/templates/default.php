<?php snippet('html/header') ?>
<?php snippet('components/Menu') ?>

<main
  data-barba='container'
  data-barba-namespace='<?= $view = $page->intendedTemplate()->name() ?>'
>
  <?php snippet(["views/$view", 'views/default']) ?>
  <?php snippet('components/Footer') ?>
</main>

<?php snippet('html/footer') ?>
