<?php
  $data ??= [/* 'group' => ['client', 'client'] */];
  if (!count($data)) return;

  $index = 0;
?>

<section class='clients'>
  <ul>
    <?php foreach ($data as $group => $clients) : ?>
      <li class='clients__group'><?= $group ?></li>

      <?php foreach ($clients as $client) : ?>
        <?php $index += 2 ?>
        <?php snippet('components/HueShifter', [
          'tag' => 'li',
          'offset' => $index,
          'attributes' => ['class' => 'clients__client']
        ], slots: true) ?>
          <?php slot('content') ?>
            <?php if (trim($client[1] ?? '')) : ?>
              <a href='<?= $client[1] ?>' target='_blank' rel='noopener'>
                <?= $client[0] ?>
              </a>
            <?php else : ?>
              <?= $client[0] ?>
            <?php endif ?>
          <?php endSlot() ?>
        <?php endSnippet() ?>
      <?php endforeach ?>
    <?php endforeach ?>
    <li class='clients__group'><?= t('clients.more') ?></li>
  </ul>
</section>
