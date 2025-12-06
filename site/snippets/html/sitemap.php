<?= '<?xml version="1.0" encoding="utf-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <?php $kirby = kirby() ?>
  <?php foreach ($kirby->site()->index() as $page): ?>
    <?php if (in_array($page->uri(), $ignore)) continue ?>
    <?php foreach ($kirby->languages() as $language) : ?>
      <url>
        <loc><?= html($page->url($language->code())) ?></loc>
        <lastmod><?= $page->modified('c', 'date') ?></lastmod>
        <priority><?= number_format($page->isHomePage() ? 1 : 0.8 / $page->depth(), 1) ?></priority>
        <?php foreach ($kirby->languages() as $language) : ?>
          <xhtml:link rel='alternate' hreflang='<?= $language->code() ?>' href='<?= $page->url($language->code()) ?>' />
        <?php endforeach ?>
      </url>
    <?php endforeach ?>
  <?php endforeach ?>
</urlset>
