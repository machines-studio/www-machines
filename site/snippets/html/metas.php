<link rel='icon' type='image/png' href='assets/favicons/favicon-96x96.png' sizes='96x96' />
<link rel='icon' type='image/svg+xml' href='assets/favicons/favicon.svg' />
<link rel='shortcut icon' href='assets/favicons/favicon.ico' />
<link rel='apple-touch-icon' sizes='180x180' href='assets/favicons/apple-touch-icon.png' />
<meta name='apple-mobile-web-app-title' content='machines.studio' />
<link rel='manifest' href='assets/favicons/site.webmanifest' />
<meta name='theme-color' content='#e4e4e4' />

<meta name='application-name' content='<?= $site->title() ?>'>
<meta name='description' content='<?= $site->description()->html() ?>'>
<meta name='keywords' content='<?= $site->keywords()->html() ?>'>

<meta property='og:url' content='<?= $site->url() ?>'>
<meta property='og:type' content='website'>
<meta property='og:title' content='<?= r($page !== $site->homePage(), $page->title()->html() . ' | ') . $site->title()->html() ?>'>
<meta property='og:description' content='<?= $site->description()->html() ?>'>
<meta property='og:site_name' content='<?= $site->title() ?>'>
<meta property='og:locale' content='fr'>

<?php if ($cover = $site->cover()->toFile()) : ?>
  <meta property='og:image' content='<?= $cover->url() ?>'>
  <meta property='og:image:width' content='<?= $cover->width() ?>'>
  <meta property='og:image:height' content='<?= $cover->height() ?>'>
<?php endif ?>
