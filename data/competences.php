<?php
/**
 * Les 6 compétences du BUT Informatique, présentées comme des « skills ».
 * Les AC sont rangés par compétence ; les projets qui les démontrent
 * sont retrouvés automatiquement à partir de data/projets.php.
 */

const AC_LIBELLES = [
    'AC11.01' => 'Implémenter des conceptions simples',
    'AC11.02' => 'Élaborer des conceptions simples',
    'AC11.03' => 'Tester et évaluer les résultats',
    'AC11.04' => 'Développer des interfaces utilisateurs',
    'AC21.01' => 'Élaborer des spécifications',
    'AC21.03' => 'Adopter de bonnes pratiques',
    'AC21.04' => 'Valider par les tests',
    'AC31.02' => 'Faire évoluer une application',
    'AC12.01' => 'Analyser un problème',
    'AC12.02' => 'Comparer des algorithmes',
    'AC22.01' => 'Choisir des structures de données',
    'AC13.01' => 'Identifier les composants d\'un système',
    'AC13.03' => 'Installer et configurer un système',
    'AC14.01' => 'Interroger une base de données',
    'AC14.03' => 'Concevoir une base de données',
    'AC15.01' => 'Comprendre les besoins',
    'AC15.02' => 'Utiliser des outils de gestion',
    'AC16.03' => 'Comprendre les rôles en équipe',
    'AC16.04' => 'Travailler en équipe',
    'AC26.03' => 'Collaborer efficacement',
];

const COMPETENCES = [
    'C1' => [
        'nom'     => 'Réaliser un développement d\'application',
        'skill'   => 'Invocation d\'application',
        'type'    => 'Active',
        'rune'    => '✦',
        'element' => 'feu',
        'resume'  => 'Java, Python, C#, JavaFX, Unity, PHP, JavaScript.',
        'ac'      => ['AC11.01', 'AC11.02', 'AC11.03', 'AC11.04', 'AC21.01', 'AC21.03', 'AC21.04', 'AC31.02'],
        'autres_preuves' => [],
    ],
    'C2' => [
        'nom'     => 'Optimiser des applications',
        'skill'   => 'Accélération arcanique',
        'type'    => 'Passive',
        'rune'    => '⚡',
        'element' => 'foudre',
        'resume'  => 'Structures de données, logique algorithmique, IA d\'ennemis.',
        'ac'      => ['AC12.01', 'AC12.02', 'AC22.01'],
        'autres_preuves' => [],
    ],
    'C3' => [
        'nom'     => 'Administrer des systèmes',
        'skill'   => 'Domaine du système',
        'type'    => 'Passive',
        'rune'    => '⬡',
        'element' => 'glace',
        'resume'  => 'Linux, configuration système, scripts.',
        'ac'      => ['AC13.01', 'AC13.03'],
        'autres_preuves' => ['TP Linux'],
    ],
    'C4' => [
        'nom'     => 'Gérer des données',
        'skill'   => 'Grimoire des données',
        'type'    => 'Active',
        'rune'    => '◈',
        'element' => 'glace',
        'resume'  => 'SQL, modélisation, requêtes, sérialisation JSON.',
        'ac'      => ['AC14.01', 'AC14.03'],
        'autres_preuves' => ['SAE SQL'],
    ],
    'C5' => [
        'nom'     => 'Conduire un projet',
        'skill'   => 'Commandement du raid',
        'type'    => 'Active',
        'rune'    => '♛',
        'element' => 'ombre',
        'resume'  => 'Organisation, planification, suivi des étapes.',
        'ac'      => ['AC15.01', 'AC15.02'],
        'autres_preuves' => [],
    ],
    'C6' => [
        'nom'     => 'Collaborer au sein d\'une équipe',
        'skill'   => 'Lien des invocations',
        'type'    => 'Passive',
        'rune'    => '⚔',
        'element' => 'ombre',
        'resume'  => 'Git, communication, coordination en équipe.',
        'ac'      => ['AC16.03', 'AC16.04', 'AC26.03'],
        'autres_preuves' => [],
    ],
];

// Inventaire : technologies utilisées, avec une « rareté » selon l'expérience
const INVENTAIRE = [
    ['nom' => 'Java', 'icone' => 'J',       'rarete' => 'epique',     'type' => 'Langage'],
    ['nom' => 'JavaFX', 'icone' => 'FX',     'rarete' => 'rare',       'type' => 'Interface'],
    ['nom' => 'Python', 'icone' => 'Py',     'rarete' => 'epique',     'type' => 'Langage'],
    ['nom' => 'C#', 'icone' => 'C#',         'rarete' => 'legendaire', 'type' => 'Langage'],
    ['nom' => 'Unity', 'icone' => 'U',      'rarete' => 'legendaire', 'type' => 'Moteur'],
    ['nom' => 'SQL', 'icone' => 'DB',        'rarete' => 'rare',       'type' => 'Données'],
    ['nom' => 'PHP', 'icone' => 'php',        'rarete' => 'rare',       'type' => 'Web'],
    ['nom' => 'JavaScript', 'icone' => 'JS', 'rarete' => 'rare',       'type' => 'Web'],
    ['nom' => 'HTML / CSS', 'icone' => '&lt;/&gt;', 'rarete' => 'epique',     'type' => 'Web'],
    ['nom' => 'Git', 'icone' => '⎇',        'rarete' => 'epique',     'type' => 'Outil'],
    ['nom' => 'Linux', 'icone' => '$_',      'rarete' => 'commun',     'type' => 'Système'],
];
