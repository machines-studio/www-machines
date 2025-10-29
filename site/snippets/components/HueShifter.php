<?php
  $tag ??= 'div';
  $offset ??= 0;

  $content ??= $slots->content() ?? null;

  $attributes ??= [];
  $attributes['class'] = 'hue-shifter ' . ($attributes['class'] ?? '');
  $attributes['style'] = "--hue-offset: {$offset}deg";

  echo Html::tag($tag, is_array($content) ? $content : [$content], $attributes);
?>
