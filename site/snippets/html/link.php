<?php
  /**
   * Output a link from a page or an array
   * snippet('html/link', $page);
   * snippet('html/link', ['url' => 'https://example.com', 'title' => 'Example', 'attributes' => []]);
   */

  $item ??= null; // $item contains the whole object passed to a snippet

  // Handle Kirby uuid representations
  if ($item instanceof \Kirby\Content\Field && $item->value) {
    if (str_starts_with($item->value, 'page://')) $item = $item->toPage();
    else if (str_starts_with($item->value, 'file://')) $item = $item->toFile();
  }

  if ($item instanceof \Kirby\Cms\Page) {
    echo Html::a($item->url(), $item->title(), [
      'class' => r($item->isOpen() || $item->isActive(), 'is-active'),
      'target' => Str::startsWith($item->url(), $site->url())
        ? null
        : (
          Str::startsWith($item->url(), '#')
            ? null
            : '_blank'
          )
    ]);
  } else if ($item instanceof \Kirby\Cms\File) {
    echo Html::a($item->url(), tt('link.download', ['filename' => $item->nicename()->or($item->filename())]), [
      'download' => $item->filename()
    ]);
  } else {
    $url ??= null;
    if (!trim($url ?? '')) return

    $title ??= $url ?? null;
    $active ??= false;
    $escape ??= true;

    $attributes ??= [];
    if ($active) $attributes['class'] = ($attributes['class'] ?? '') . ' is-active';
    if (!Str::startsWith($url, $site->url()) && !Str::startsWith($url, '#')) $attributes['target'] = '_blank';

    echo Html::a($url, [$title ?? $url], $attributes);
  }
?>
