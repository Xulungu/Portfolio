<?php /* Contenu de la page du projet Latice (inclus par projet.php) */ ?>

<section class="fenetre apparition">
  <h2>Contexte</h2>
  <p>
    Projet réalisé dans le cadre d'une SAE de 1ʳᵉ année du BUT Informatique.
    Objectif : recréer le jeu de plateau <strong>Latice</strong> en Java et JavaFX, avec une interface jouable.
  </p>
</section>

<section class="fenetre apparition">
  <h2>Objectifs</h2>
  <ul class="liste-quete">
    <li>Reproduire fidèlement les mécaniques du jeu Latice.</li>
    <li>Développer une interface graphique complète en JavaFX.</li>
    <li>Gérer les interactions, les animations et les règles de score.</li>
    <li>Proposer une expérience utilisateur fluide.</li>
  </ul>
</section>

<section class="fenetre apparition">
  <h2>Mon rôle</h2>
  <p>Dans une équipe de 3 personnes, j'ai été responsable de :</p>
  <ul>
    <li>la création complète de l'interface JavaFX ;</li>
    <li>la gestion des événements utilisateurs ;</li>
    <li>l'intégration des sons (achats, victoire, musique) ;</li>
    <li>la mise en place du fond animé ;</li>
    <li>la synchronisation entre la logique et l'affichage.</li>
  </ul>
</section>

<section class="fenetre apparition">
  <h2>Fonctionnalités</h2>

  <div class="cartes">
    <div class="carte">
      <h3>Système de points</h3>
      <ul>
        <li>Case soleil : <strong>+2 points</strong></li>
        <li>Double : <strong>+1 point</strong></li>
        <li>Triple : <strong>+2 points</strong></li>
        <li>Latice : <strong>+3 points</strong></li>
      </ul>
    </div>
    <div class="carte">
      <h3>Actions possibles</h3>
      <ul>
        <li>Acheter une action</li>
        <li>Échanger son rack</li>
        <li>Passer son tour</li>
        <li>Ouvrir / fermer le menu des actions</li>
      </ul>
    </div>
    <div class="carte">
      <h3>Ambiance</h3>
      <ul>
        <li>Musique dynamique qui évolue pendant la partie.</li>
        <li>Vidéo de fond animée en boucle.</li>
      </ul>
    </div>
  </div>

  <div class="galerie">
    <figure><img src="<?= e(image('latice', 'finPartie.png')) ?>" alt="Plateau en fin de partie" data-agrandir loading="lazy"><figcaption>Plateau en fin de partie</figcaption></figure>
    <figure><img src="<?= e(image('latice', 'ecranActions.png')) ?>" alt="Menu des actions" data-agrandir loading="lazy"><figcaption>Menu des actions</figcaption></figure>
    <figure><img src="<?= e(image('latice', 'ecranWin.png')) ?>" alt="Fenêtre de victoire" data-agrandir loading="lazy"><figcaption>Fenêtre de victoire</figcaption></figure>
  </div>
</section>

<section class="fenetre apparition">
  <h2>Livrables</h2>
  <ul>
    <li>Interface JavaFX complète</li>
    <li>Gestion des règles et du score</li>
    <li>Intégration audio et vidéo</li>
    <li>Code source commenté</li>
  </ul>
</section>

<section class="fenetre apparition" id="analyse">
  <h2>Analyse réflexive</h2>
  <p>
    Ce projet m'a permis de comprendre la structure d'une application JavaFX et l'importance
    de séparer la logique et l'affichage. La synchronisation entre les actions, les règles et l'interface a été
    la principale difficulté. J'ai aussi appris à intégrer des sons et des vidéos de manière performante
    et à garder un code propre en équipe.
  </p>
</section>
