<?php
  $pages = $site
    ->children()->listed()->filterBy('intendedTemplate', 'projects')
    ->children()->listed()
    ->sortBy('title', 'ASC');
?>

<?php snippet('components/Article', [
  'title' => 'index'
], slots: true) ?>
  <?php slot('content') ?>
    <section class='prose'>
      <?= $page->blocks()->toBlocks() ?>
    </section>

    <table>
      <thead>
        <td data-sort='ASC'><span><?= t('index.project') ?></span></td>
        <td data-content='parent'><span><?= t('index.category') ?></span></td>
        <td data-content='pubdate'><span><?= t('index.pubdate') ?></span></td>
      </thead>

      <tbody>
        <?php foreach ($pages as $page) : ?>
          <?php $years = $page->year()->toEntries() ?>
          <tr data-href='<?= $page->url() ?>'>
            <td><?php snippet('html/link', $page) ?></td>
            <td data-content='parent'><?= $page->parent()->title() ?></td>
            <td
              data-content='pubdate'
              data-value-ASC='<?= $years->first() ?>'
              data-value-DESC='<?= $years->last() ?>'
            >
              <?php foreach ($years as $year) : ?>
                <time datetime='<?= $year->kirbytextinline() ?>'><?= $year->kirbytextinline() ?></time>
              <?php endforeach ?>
            </td>
          </tr>
        <?php endforeach ?>
      </tbody>
    </table>
  <?php endslot() ?>
<?php endsnippet() ?>
