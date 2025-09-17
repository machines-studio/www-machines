<?php
  $lang = kirby()->language()->code();
  $blocks = $page->blocks()->toBlocks();
?>

<?php snippet('components/Slideshow', [
  'medias' => $page->files() // TODO dynamic
]) ?>

<article>
  <h2><?= $page->title() ?></h2>

  <section>
    <aside>
      <div class='years'>
        <?php foreach ($page->year()->toEntries() as $year) : ?>
          <div class='year'><?= $year ?></div>
        <?php endforeach ?>
      </div>

      <ul class='credits'>
        <?php foreach ($page->credits()->toStructure() as $credit) : ?>
          <li class='credit' data-name='<?= $credit->$lang()->or($credit->fr()) ?>'>
            <ul class='credit__entries'>
              <?php foreach ($credit->entries()->toEntries() as $entry) : ?>
                <li class='credit__entry'>
                  <?= $entry ?>
                </li>
              <?php endforeach ?>
            </ul>
          </li>
        <?php endforeach ?>
      </ul>
    </aside>

    <?= $blocks->first() ?>
  </section>

  <?php foreach ($blocks->slice(1) as $block) : ?>
    <section>
      <aside></aside>
      <?= $block ?>
    </section>
  <?php endforeach ?>

</article>

