<?php
  snippet('components/Slideshow', ['medias' => $page->slideshow()->toFiles()]);

  snippet('components/Article', [], slots: true);
    slot('content');
      echo $page->blocks()->toBlocks();
    endslot();
  endsnippet();
