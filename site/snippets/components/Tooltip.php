<?php
  $content ??= '';
  if (!$content || !trim($content)) return;
?>

<div
  class='tooltip'
  role='tooltip'
  style='position: absolute; opacity: 0;'
>
  <?= $content ?>
</div>
