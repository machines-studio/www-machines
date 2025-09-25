<?php

namespace Machines;

use Exception;
use Kirby;
use Kirby\Content\Field;
use Kirby\Data\Yaml;
use Kirby\Toolkit\Str;
use Kirby\Uuid\Uuid;

load([
  'Machines\\Taxonomy' => 'classes/Taxonomy.php'
], __DIR__);

Kirby::plugin('machines/taxonomy', [
  'options' => [
    'cache' => [
      'active' => true,
      'lifetime' => 0 // minutes
    ]
  ],

  'blueprints' => [
    'fields/taxonomy' => __DIR__ . '/blueprints/fields/taxonomy.yml'
  ],

  'fieldMethods' => [
    // Create a Machines\Taxonomy from an uuid stored in a Field
    'toTaxonomy' => function (Field $field) : Taxonomy {
      $cache = kirby()->cache('machines.taxonomy');
      $taxonomy = $cache->get(Str::slug($field->value ?? '') ?? null);
      if (!$taxonomy) return new Taxonomy();

      return new Taxonomy($taxonomy);
    },

    // Create an array of Machines\Taxonomy from a list of uuid stored in a Field
    'toTaxonomies' => function (Field $field, ?array $pluck = null) : array {
      $taxonomies = [];
      $cache = kirby()->cache('machines.taxonomy');

      // Handle various field types
      $definition = $field->parent()->blueprint()->fields()[$field->key()] ?? [];
      switch ($definition['type'] ?? null) {
        case 'tags':
        case 'select':
        case 'multiselect':
          foreach ($field->split() as $uuid) {
            $taxonomies[] = new Taxonomy($cache->get(Str::slug($uuid) ?? null));
          }
          break;

        case 'structure':
          foreach ($field->toStructure() as $entry) {
            $uuid = $entry->uuid();
            $taxonomies[] = new Taxonomy($cache->get(Str::slug($uuid) ?? null));
          }
          break;
      }

      // Remove taxonomies not present in the plucked array
      if ($pluck && count($pluck)) {
        foreach ($taxonomies as $key => $taxonomy) {
          if (in_array($taxonomy->uuid, $pluck)) continue;
          unset($taxonomies[$key]);
        }
      }

      return $taxonomies;
    }
  ],

  'hooks' => [
    // Implement Kirby@3.8.x UUID logic to structure fields on the taxonomy page
    'page.update:after' => function ($newPage, $oldPage) {
      $cache = kirby()->cache('machines.taxonomy');

      $fields = [];
      foreach ($newPage->blueprint()->fields() as $fieldName => $field) {
        // Find structure fields with taxonomy: true
        if ($field['type'] !== 'structure') continue;
        if (!($field['machines_taxonomy'] ?? null)) continue;

        // Attach uuid to each structure item
        $structure = $newPage->content()->get($fieldName)->yaml();
        foreach ($structure as &$item) {
          // Ensure UUID exists
          $item['uuid'] = $item['uuid'] ?? 'taxonomy://' . Uuid::generate();

          // Store in cache to allow global access
          $cache->set(Str::slug($item['uuid']), $item);
        }

        // Update structure field
        $fields[$fieldName] = Yaml::encode($structure);
      }

      // Update page
      $newPage->update($fields);
    }
  ]
]);
