<?php
/**
 * Début de page : <head>, fond magique et barre de navigation.
 * Variables attendues : $titrePage (string), $description (string, facultatif).
 */
$titrePage   = $titrePage ?? 'Portfolio';
$description = $description ?? 'Portfolio d\'' . SITE['nom'] . ', étudiant en ' . SITE['annee'] . 'ᵉ année de ' . SITE['formation'] . '.';
?>
<!DOCTYPE html>
<html lang="fr"<?= est_statique() ? ' data-statique="1"' : '' ?>>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= e($titrePage) ?> — <?= e(SITE['nom']) ?></title>
  <meta name="description" content="<?= e($description) ?>">
  <meta name="theme-color" content="#05060f">
  <script>document.documentElement.classList.add("js");try{if(sessionStorage.getItem("transition"))document.documentElement.classList.add("arrivee");var t=sessionStorage.getItem("theme");if(t==="monarque"||t==="monika")document.documentElement.classList.add(t);}catch(e){}</script>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✦</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e(ressource('assets/css/style.css')) ?>">
  <link rel="stylesheet" href="<?= e(ressource('assets/css/archive.css')) ?>">
  <link rel="stylesheet" href="<?= e(ressource('assets/css/consentement.css')) ?>">
  <script src="<?= e(ressource('assets/js/performance.js')) ?>"></script>
  <script src="<?= e(ressource('assets/js/consentement.js')) ?>"></script>
</head>
<body>

<!-- Fond : particules de mana (dessinées par assets/js/magie.js) -->
<canvas id="mana" aria-hidden="true"></canvas>
<div class="voile" aria-hidden="true"></div>

<a class="evitement" href="#contenu">Aller au contenu</a>

<header class="entete">
  <a class="logo" href="<?= e(lien_accueil()) ?>" aria-label="Accueil">
    <span class="logo-rune"><span>E</span></span>
    <span class="logo-texte">
      <strong><?= e(SITE['nom']) ?></strong>
      <small><?= e(SITE['formation']) ?> · <?= SITE['annee'] ?>ᵉ année</small>
    </span>
  </a>

  <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu">
    <span></span><span></span><span></span>
  </button>

  <nav id="menu" class="menu">
    <a href="<?= e(lien_accueil()) ?>">Accueil</a>
    <a href="<?= e(lien_accueil('projets')) ?>">Projets</a>
    <a href="<?= e(lien_accueil('competences')) ?>">Compétences</a>
    <a href="<?= e(lien_accueil('technologies')) ?>">Technologies</a>
    <a href="<?= e(lien_accueil('a-propos')) ?>">À propos</a>
    <a href="<?= e(lien_accueil('enseignants')) ?>">Enseignants</a>
    <a href="<?= e(lien_accueil('contact')) ?>" class="menu-cta">Contact</a>
  </nav>

  <!-- Barre de progression : se remplit en faisant défiler la page -->
  <div class="barre-mp" aria-hidden="true"><span class="barre-mp-label">MP</span><div class="barre-mp-fond"><div class="barre-mp-remplie"></div></div></div>
</header>

<main id="contenu">
