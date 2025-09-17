<?php
  snippet('components/Article', [], slots: true);

  slot('header');
  echo $page->text()->kirbytext();
  endslot();

  slot('content');
  echo '<section>';
  snippet('components/Clients', [
    // TODO dynamic
    'data' => [
      'grands groupes' => [
        ['AG2R LA MONDIALE', 'https://example.com'],
        ['EDF', 'https://example.com'],
        ['L’Oréal Luxe', 'https://example.com'],
        ['SNCF', 'https://example.com'],
        ['ENEDIS', 'https://example.com'],
      ],
      'institutions publiques' => [
        ['Ministère de la Culture', 'https://example.com'],
        ['Centre des monuments nationaux', 'https://example.com'],
        ['Frac Île-de-France', 'https://example.com'],
        ['Frac Picardie', 'https://example.com'],
        ['Frac Auvergne', 'https://example.com'],
        ['Quai des Savoirs, Toulouse', 'https://example.com'],
        ['CNAP — Centre national des arts plastiques', 'https://example.com'],
        ['Le Signe — Centre national du graphisme', 'https://example.com'],
        ['Le Bel Ordinaire', 'https://example.com'],
        ['La Gaîté Lyrique', 'https://example.com'],
        ['Centre Pompidou', 'https://example.com'],
        ['La SCAM', 'https://example.com'],
        ['La Bifurk', 'https://example.com'],
        ['Etopia, Center for Art and Technology', 'https://example.com'],
        ['Cité des Sciences et de l’Industrie', 'https://example.com'],
        ['L’Arche', 'https://example.com'],
        ['Stereolux', 'https://example.com'],
        ['CRÉNAU', 'https://example.com'],
        ['Le Pavillon Namur', 'https://example.com'],
        ['Musée des Arts et Métiers', 'https://example.com'],
        ['La Villette', 'https://example.com'],
        ['Saint-Ex', 'https://example.com'],
        ['Ateliers Médicis', 'https://example.com'],
      ],
      'collectivités' => [
        ['Département de Loire-Atlantique', 'https://example.com'],
        ['Metz Métropole', 'https://example.com'],
        ['Ville de Rouen', 'https://example.com'],
        ['Ville du Havre', 'https://example.com'],
        ['QDSi quartier des spectacles', 'https://example.com'],
      ],
      'associations' => [
        ['Fédération Française du Paysage', 'https://example.com'],
        ['Les monteurs associés', 'https://example.com'],
        ['Scénaristes de cinéma associés', 'https://example.com'],
        ['Revue Sur-Mesure', 'https://example.com'],
        ['Association des décorateurs de cinéma', 'https://example.com'],
      ],
      'entreprises' => [
        ['b-com', 'https://example.com'],
        ['Lyon Parc Auto', 'https://example.com'],
      ],
      'ESS' => [
        ['Mobicoop', 'https://example.com'],
        ['Paris Habitat', 'https://example.com'],
      ],
      'festivals' => [
        ['Scopitone', 'https://example.com'],
        ['Mirage festival', 'https://example.com'],
        ['Constellations Metz', 'https://example.com'],
        ['Safra’Numérique', 'https://example.com'],
        ['Fête des Lumières, Lyon', 'https://example.com'],
        ['Bright Brussels', 'https://example.com'],
        ['Nuit Blanche, Paris', 'https://example.com'],
        ['Chroniques — Biennale des Imaginaires numériques', 'https://example.com'],
      ],
      'indépendants' => [
        ['artistes', 'https://example.com'],
        ['graphistes', 'https://example.com'],
        ['architectes', 'https://example.com'],
      ]
    ]
  ]);
  echo '</section>';
  endslot();

  endsnippet();
