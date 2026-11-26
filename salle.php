<?php
/**
 * La salle secrète : une caverne sous le portfolio, accessible depuis le terminal
 * (« cd /abysse ») une fois le dossier CLASSIFIED ouvert.
 */
require __DIR__ . '/includes/config.php';
$titre = 'Les Abysses';
?>
<!DOCTYPE html>
<html lang="fr"<?= est_statique() ? ' data-statique="1"' : '' ?>>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title><?= e($titre) ?> — <?= e(SITE['nom']) ?></title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✦</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e(ressource('assets/css/style.css')) ?>">
  <link rel="stylesheet" href="<?= e(ressource('assets/css/archive.css')) ?>">
  <link rel="stylesheet" href="<?= e(ressource('assets/css/salle.css')) ?>">
  <link rel="stylesheet" href="<?= e(ressource('assets/css/consentement.css')) ?>">
  <script src="<?= e(ressource('assets/js/performance.js')) ?>"></script>
  <script src="<?= e(ressource('assets/js/consentement.js')) ?>"></script>
</head>
<body class="page-salle">

<canvas id="poussiere" aria-hidden="true"></canvas>

<a class="salle-retour" href="<?= e(lien_accueil()) ?>">↑ Remonter à la surface</a>

<!-- Écran affiché tant que le dossier CLASSIFIED n'a pas été ouvert -->
<section class="salle-scellee" hidden>
  <p class="salle-ornement" aria-hidden="true">✦</p>
  <h1>Les profondeurs restent scellées</h1>
  <p>Il manque un dossier… et le code qui l'ouvre.</p>
  <a href="<?= e(lien_accueil()) ?>">Remonter</a>
</section>

<main class="salle" hidden>
  <header class="salle-titre">
    <p class="salle-ornement" aria-hidden="true">— ✦ —</p>
    <h1>Les Abysses</h1>
    <p>Ce qui dort sous le portfolio</p>
  </header>

  <div class="salle-scene">
    <!-- décor lointain (parallaxe) -->
    <svg class="decor decor-loin" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="M0,0 H1600 V120 L1540,190 1500,110 1440,260 1390,130 1320,210 1260,90 1200,240 1150,120 1080,180 1010,80 950,230 900,110 840,170 760,70 700,250 640,130 580,200 520,90 450,220 400,120 330,190 260,80 200,240 140,120 80,200 0,100 Z"/>
      <path d="M0,900 V760 L90,700 180,740 260,680 380,720 470,660 600,700 700,650 820,690 930,640 1050,700 1160,660 1270,710 1380,650 1480,700 1600,670 V900 Z"/>
    </svg>
    <svg class="decor decor-proche" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="M0,0 H460 L440,60 420,40 400,150 380,60 350,90 330,30 300,120 270,40 240,70 200,20 160,110 120,30 80,60 40,20 0,90 Z"/>
      <path d="M1600,0 H1150 L1170,50 1195,30 1210,140 1235,50 1260,80 1290,20 1320,110 1350,40 1390,90 1420,30 1460,120 1500,40 1540,70 1600,20 Z"/>
      <path d="M0,900 V820 Q200,780 420,800 T800,790 T1200,805 T1600,790 V900 Z"/>
    </svg>

    <!-- lanternes (à allumer) -->
    <?php foreach ([[14, 9, 150], [33, 4, 90], [64, 6, 120], [86, 10, 170]] as $i => [$x, $y, $fil]): ?>
      <button class="lanterne" data-lanterne="<?= $i ?>" style="left:<?= $x ?>%;top:<?= $y ?>%;--fil:<?= $fil ?>px" aria-label="Lanterne éteinte">
        <span class="lanterne-fil" aria-hidden="true"></span>
        <svg viewBox="0 0 40 60" aria-hidden="true">
          <path class="lanterne-cage" d="M14,6 h12 v4 h4 l4,10 v22 l-4,8 h-20 l-4,-8 v-22 l4,-10 h4 z"/>
          <ellipse class="lanterne-coeur" cx="20" cy="32" rx="8" ry="10"/>
          <path class="lanterne-cage" d="M10,20 h20 M10,42 h20 M20,10 v40" />
        </svg>
      </button>
    <?php endforeach; ?>

    <!-- stèle -->
    <button class="objet objet-stele" data-objet="stele" aria-label="Stèle ancienne">
      <svg viewBox="0 0 120 240" aria-hidden="true">
        <path class="pierre" d="M20,236 V40 Q20,6 60,6 Q100,6 100,40 V236 Z"/>
        <path class="pierre-bord" d="M10,236 h100 v-14 h-100 z"/>
        <g class="runes">
          <path d="M42,52 l16,0 M50,44 l0,22 M70,50 l8,8 l-8,8"/>
          <path d="M40,92 q20,-14 40,0 M46,104 h28 M60,96 v22"/>
          <path d="M44,140 l12,12 l12,-12 l12,12 M50,166 h20"/>
          <path d="M46,190 l14,-10 l14,10 v14 h-28 z"/>
        </g>
      </svg>
    </button>

    <!-- vestiges des projets -->
    <div class="vestiges">
      <button class="objet objet-vestige" data-objet="tuile" aria-label="Tuile ornée d'un soleil">
        <svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="4" width="32" height="32" rx="3" class="pierre"/><circle cx="20" cy="20" r="6" class="eclat"/><path class="eclat-trait" d="M20,7v6M20,27v6M7,20h6M27,20h6M11,11l4,4M25,25l4,4M29,11l-4,4M15,25l-4,4"/></svg>
      </button>
      <button class="objet objet-vestige" data-objet="allumette" aria-label="Une allumette">
        <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8,34 L30,8" class="bois"/><circle cx="31" cy="7" r="4" class="eclat"/></svg>
      </button>
      <button class="objet objet-vestige" data-objet="page" aria-label="Une page déchirée">
        <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9,5 h18 l6,6 v24 l-3,-2 -3,3 -3,-3 -3,3 -3,-3 -3,3 -3,-2 z" class="papier"/><path d="M13,14h14M13,19h14M13,24h10" class="eclat-trait"/></svg>
      </button>
    </div>

    <!-- banc -->
    <button class="objet objet-banc" data-objet="banc" aria-label="Un banc">
      <svg viewBox="0 0 200 90" aria-hidden="true">
        <path class="metal" d="M14,30 Q100,10 186,30 M20,44 H180 M20,56 H180"/>
        <path class="metal" d="M30,44 V86 M170,44 V86 M30,30 V44 M170,30 V44 M100,22 V44"/>
        <path class="metal fin" d="M40,70 q60,-14 120,0"/>
      </svg>
    </button>

    <!-- porte scellée -->
    <button class="objet objet-porte" data-objet="porte" aria-label="Porte scellée">
      <svg viewBox="0 0 160 240" aria-hidden="true">
        <path class="pierre" d="M10,236 V90 Q10,10 80,10 Q150,10 150,90 V236 Z"/>
        <path class="porte-noir" d="M30,236 V96 Q30,32 80,32 Q130,32 130,96 V236 Z"/>
        <g class="sceau">
          <circle cx="80" cy="130" r="34"/>
          <circle cx="80" cy="130" r="24"/>
          <path d="M80,96 V164 M46,130 H114 M56,106 L104,154 M104,106 L56,154"/>
        </g>
      </svg>
    </button>

    <!-- petit esprit qui erre -->
    <div class="esprit" aria-hidden="true"></div>
  </div>

  <!-- boîte de texte -->
  <div class="salle-dialogue" hidden role="dialog" aria-live="polite">
    <p class="salle-dialogue-titre"></p>
    <div class="salle-dialogue-texte"></div>
    <p class="salle-dialogue-suite">Cliquer pour fermer</p>
  </div>
</main>

<script src="<?= e(ressource('assets/js/archive/succes.js')) ?>"></script>
<script>window.LIEN_DANMAKU = <?= json_encode(est_statique() ? 'danmaku.html' : 'danmaku.php') ?>;</script>
<script src="<?= e(ressource('assets/js/salle.js')) ?>" defer></script>
</body>
</html>
