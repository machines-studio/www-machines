<section class='splashscreen'>
  <?php snippet('svg/nut.black') ?>
  <h1><?php snippet('svg/letters.black') ?></h1>

  <?php
    foreach ($site->letters()->toFiles() as $image) {
      snippet('html/image', compact('image'));
    }
  ?>

</section>
