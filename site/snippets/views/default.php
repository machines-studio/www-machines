<?php

snippet('components/Article', [], slots: true);
  slot('content');
    echo $page->blocks()->toBlocks();
  endslot();
endsnippet();
