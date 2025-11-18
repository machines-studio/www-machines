<?php
  if (!isset($_SERVER['HTTP_X_BARBA'])) {
    snippet('html/header');
    snippet('components/Menu');
  }
?>

<main
  data-barba='container'
  data-barba-namespace='<?= $view = $page->intendedTemplate()->name() ?>'
>
  <?php snippet(["views/$view", 'views/default']) ?>
  <?php snippet('components/Footer') ?>
</main>

<?php
  if (!isset($_SERVER['HTTP_X_BARBA'])) {
    snippet('components/Search');
    snippet('html/footer');
  }
?>
