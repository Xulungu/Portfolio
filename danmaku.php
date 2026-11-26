<?php
/**
 * Danmaku Mode : mini-jeu d'esquive façon bullet hell, indépendant du reste du portfolio.
 * On y arrive depuis la porte de la salle secrète (ou directement par l'adresse).
 */
require __DIR__ . '/includes/config.php';
?>
<!DOCTYPE html>
<html lang="fr"<?= est_statique() ? ' data-statique="1"' : '' ?>>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>Danmaku Mode — <?= e(SITE['nom']) ?></title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✦</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e(ressource('assets/css/archive.css')) ?>">
  <link rel="stylesheet" href="<?= e(ressource('assets/css/danmaku.css')) ?>">
</head>
<body class="page-danmaku">

<header class="dm-haut">
  <a href="<?= e(est_statique() ? 'salle.html' : 'salle.php') ?>">← Quitter l'arène</a>
  <span>Danmaku Mode</span>
  <a href="<?= e(lien_accueil()) ?>">Portfolio</a>
</header>

<main class="dm-zone">
  <div class="dm-cadre">
    <canvas id="danmaku" width="480" height="640" aria-label="Zone de jeu"></canvas>

    <div class="dm-ecran" data-ecran="titre">
      <p class="dm-sur">L'Arène des projectiles</p>
      <h1>Danmaku Mode</h1>
      <p>Survis <strong>60 secondes</strong> aux quatre cartes de sort du Gardien de l'Archive.</p>
      <ul class="dm-touches">
        <li><kbd>←</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd> ou <kbd>Z</kbd><kbd>Q</kbd><kbd>S</kbd><kbd>D</kbd> : se déplacer</li>
        <li><kbd>Maj</kbd> : mode concentré (plus lent, hitbox visible)</li>
        <li><kbd>P</kbd> : pause · <kbd>R</kbd> : recommencer</li>
      </ul>
      <p class="dm-astuce">Seul le petit point blanc au centre est touché. Frôler les projectiles rapporte des points.</p>
      <button class="dm-bouton" data-action="jouer">Commencer <small>(Entrée)</small></button>
    </div>

    <div class="dm-ecran" data-ecran="pause" hidden>
      <h2>Pause</h2>
      <button class="dm-bouton" data-action="reprendre">Reprendre <small>(P)</small></button>
    </div>

    <div class="dm-ecran" data-ecran="defaite" hidden>
      <p class="dm-sur">Touché</p>
      <h2>Défaite</h2>
      <p class="dm-resultat"></p>
      <button class="dm-bouton" data-action="jouer">Recommencer <small>(R)</small></button>
    </div>

    <div class="dm-ecran dm-victoire" data-ecran="victoire" hidden>
      <p class="dm-sur">Carte de sort finale vaincue</p>
      <h2>Victoire</h2>
      <p class="dm-resultat"></p>
      <p>Le Gardien s'incline. L'Archive te reconnaît comme l'un des siens.</p>
      <button class="dm-bouton" data-action="jouer">Rejouer <small>(R)</small></button>
    </div>
  </div>

  <aside class="dm-hud" aria-live="polite">
    <div><span>Temps</span><strong class="hud-temps">0.0 / 60</strong></div>
    <div><span>Vies</span><strong class="hud-vies">♥ ♥ ♥</strong></div>
    <div><span>Frôlements</span><strong class="hud-frolements">0</strong></div>
    <div><span>Meilleur temps</span><strong class="hud-record">—</strong></div>
    <div class="hud-carte"><span>Carte de sort</span><strong class="hud-sort">—</strong></div>
  </aside>
</main>

<script src="<?= e(ressource('assets/js/archive/succes.js')) ?>"></script>
<script src="<?= e(ressource('assets/js/danmaku.js')) ?>" defer></script>
</body>
</html>
