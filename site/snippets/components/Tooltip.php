<?php
  $content ??= '';
  if (!$content || !trim($content)) return;
?>

<div class='tooltip' role='tooltip'>
  <?= $content ?>
</div>
