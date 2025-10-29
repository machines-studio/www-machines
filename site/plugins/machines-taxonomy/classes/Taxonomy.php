<?php

namespace Machines;

use Kirby\Toolkit\Str;

class Taxonomy {
  public $uuid;
  public $value = [];

  public function __construct (?array $options = []) {
    $this->uuid = $options['uuid'] ?? null;
    $this->value = [
      'fr' => $options['fr'] ?? null,
      'en' => ($options['en'] ?? '') ?: ($options['fr'] ?? null)
    ];
  }

  public function get (?string $lang = null) : string {
    $lang ??= kirby()->language()->code();
    return $this->value[$lang] ?? '';
  }

  public function slug () : string {
    return Str::slug($this->get('en'));
  }

  public function __toString () : string {
    return $this->get();
  }
}
