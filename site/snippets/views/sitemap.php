<?php
  function walk (Kirby\Cms\Page $page) {
    if (!$page) return;
    if (in_array($page->uri(), option('sitemap.ignore', ['error']))) return;

    echo '<li>';
    echo Html::a($page->url(), $page->title());
    if (($children = $page->children()->listed()) && $children->count() >= 1) {
      echo '<ul>';
      foreach ($children as $child) walk($child);
      echo '</ul>';
    }
    echo '</li>';
  }
?>

<?php snippet('components/Article', [
  'title' => $page->title()
], slots: true) ?>
  <?php slot('content') ?>
    <ul>
      <?php foreach (site()->children()->listed() as $page) walk($page) ?>
    </ul>
  <?php endslot() ?>
<?php endsnippet() ?>
