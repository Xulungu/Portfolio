<?php
/**
 * Petits composants réutilisés sur plusieurs pages.
 */

/** Cercle magique animé (SVG). Les anneaux tournent grâce au CSS. */
function cercle_magique(string $classe = ''): string
{
    static $n = 0;
    $id = 'runes' . (++$n);
    $runes = 'ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ';
    return <<<SVG
<svg class="cercle-magique {$classe}" viewBox="0 0 400 400" aria-hidden="true">
  <defs>
    <path id="{$id}" d="M200,200 m-168,0 a168,168 0 1,1 336,0 a168,168 0 1,1 -336,0"/>
  </defs>
  <g class="anneau anneau-1">
    <circle cx="200" cy="200" r="190"/>
    <circle cx="200" cy="200" r="182" class="fin"/>
    <text><textPath href="#{$id}">{$runes}</textPath></text>
    <circle cx="200" cy="200" r="150" class="fin"/>
  </g>
  <g class="anneau anneau-2">
    <polygon points="200,58 323,271 77,271"/>
    <polygon points="200,342 77,129 323,129"/>
    <circle cx="200" cy="200" r="142" class="tirets"/>
  </g>
  <g class="anneau anneau-3">
    <circle cx="200" cy="200" r="88"/>
    <rect x="138" y="138" width="124" height="124" transform="rotate(45 200 200)"/>
    <rect x="138" y="138" width="124" height="124"/>
    <circle cx="200" cy="200" r="30" class="coeur"/>
  </g>
</svg>
SVG;
}

/** Badge de rang (E à S). */
function badge_rang(string $rang, string $prefixe = 'Rang'): string
{
    return '<span class="badge-rang ' . classe_rang($rang) . '"><small>' . e($prefixe) . '</small>' . e($rang) . '</span>';
}

/** Carte d'un projet (« portail de donjon ») pour la page d'accueil. */
function carte_projet(string $id, array $p): string
{
    $techs = implode('', array_map(fn($t) => '<li>' . e($t) . '</li>', $p['techs']));
    $pixel = $p['pixel'] ? ' pixel' : '';
    $statut = $p['statut'] === 'En cours' ? 'statut-actif' : 'statut-fini';
    return '
<article class="portail apparition ' . classe_rang($p['rang']) . '">
  <a href="' . e(lien_projet($id)) . '" class="portail-lien" data-portail>
    <div class="portail-image">
      <img src="' . e(image($id, $p['couverture'])) . '" alt="Aperçu du projet ' . e($p['titre']) . '" class="' . $pixel . '" loading="lazy">
      <div class="portail-vortex" aria-hidden="true"></div>
      ' . badge_rang($p['rang']) . '
      <span class="portail-statut ' . $statut . '">' . e($p['statut']) . '</span>
    </div>
    <div class="portail-corps">
      <p class="portail-cadre">' . e($p['cadre']) . ' · ' . e($p['equipe']) . '</p>
      <h3>' . e($p['titre']) . '</h3>
      <p class="portail-sous">' . e($p['sous_titre']) . '</p>
      <p>' . e($p['resume']) . '</p>
      <ul class="puces-tech">' . $techs . '</ul>
      <span class="portail-entrer">Entrer dans le donjon <span aria-hidden="true">→</span></span>
    </div>
  </a>
</article>';
}

/** Titre de section façon fenêtre du Système. */
function titre_section(string $etiquette, string $titre, string $id = ''): string
{
    return '<header class="titre-section apparition"' . ($id ? ' id="' . e($id) . '"' : '') . '>
  <span class="titre-etiquette">[ ' . e($etiquette) . ' ]</span>
  <h2 data-glitch="' . e($titre) . '">' . e($titre) . '</h2>
  <span class="titre-trait" aria-hidden="true"></span>
</header>';
}
