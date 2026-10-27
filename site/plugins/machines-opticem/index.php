<?php

/**
 * Add a class to first em in a paragraph (not doable in CSS only because
 * :first-child does not take into account prior node (technically doable in CSS
 * only, but only in Firefox using the :-moz-first-node pseudo class))
 */

namespace Machines;

use Kirby;
use Kirby\Content\Field;

Kirby::plugin('machines/opticem', [
  'fieldMethods' => [
    'kirbytext' => function (Field $field, array $options = []) : Field {
      // Overriding the core field method: run the core kirbytext first so
      // that kirbytext parsing and hooks (e.g. machines/anchors) still apply
      $field->value = kirby()->kirbytext($field->value, array_merge($options, [
        'parent' => $field->parent(),
        'field' => $field
      ]));

      if (preg_match('/<p><em\b/i', $field->value ?? '')) {
        $field->value = preg_replace(
          '/<p><em\b/i',
          '<p><em class="is-first-node"',
          $field->value
        );
      }

      return $field;
    }
  ]
]);
