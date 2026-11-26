<?php /* Contenu de la page du projet Mini-Jeux (inclus par projet.php) */ ?>

<section class="fenetre apparition">
  <h2>Contexte</h2>
  <p>
    Projet réalisé dans le cadre d'une SAE de 1ʳᵉ année du BUT Informatique.
    Objectif : développer une application Python en terminal regroupant plusieurs mini-jeux,
    avec gestion des joueurs, des scores et de la sauvegarde des données.
  </p>
</section>

<section class="fenetre apparition">
  <h2>Objectifs</h2>
  <ul class="liste-quete">
    <li>Créer un système de connexion avec sauvegarde des joueurs.</li>
    <li>Développer trois mini-jeux jouables en terminal.</li>
    <li>Mettre en place un menu principal clair et interactif.</li>
    <li>Gérer les scores globaux et par jeu.</li>
    <li>Implémenter des bots pour jouer contre l'ordinateur.</li>
    <li>Créer des fichiers d'aide pour expliquer les règles.</li>
  </ul>
</section>

<section class="fenetre apparition">
  <h2>Mon rôle</h2>
  <p>En binôme, j'ai principalement travaillé sur :</p>
  <ul>
    <li>la gestion des joueurs (création, connexion, stockage dans <code>joueurs.txt</code>) ;</li>
    <li>le menu principal et la navigation entre les jeux ;</li>
    <li>l'affichage des scores globaux et des scores par jeu ;</li>
    <li>le jeu des devinettes ;</li>
    <li>les fichiers d'aide ;</li>
    <li>les bots (mode joueur contre bot).</li>
  </ul>
</section>

<section class="fenetre apparition">
  <h2>Les trois mini-jeux</h2>
  <div class="cartes">
    <div class="carte">
      <h3>Devinettes</h3>
      <p>Deviner un nombre choisi au hasard.</p>
      <img src="<?= e(image('minijeux', 'devinettesJeu.png')) ?>" alt="Jeu des devinettes" data-agrandir loading="lazy">
    </div>
    <div class="carte">
      <h3>Allumettes</h3>
      <p>Éviter de prendre la dernière allumette.</p>
      <img src="<?= e(image('minijeux', 'allumettesJeu.png')) ?>" alt="Jeu des allumettes" data-agrandir loading="lazy">
    </div>
    <div class="carte">
      <h3>Morpion</h3>
      <p>Aligner trois symboles.</p>
      <img src="<?= e(image('minijeux', 'morpionJeu.png')) ?>" alt="Jeu du morpion" data-agrandir loading="lazy">
    </div>
  </div>
</section>

<section class="fenetre apparition">
  <h2>Fonctionnalités</h2>
  <div class="galerie">
    <figure><img src="<?= e(image('minijeux', 'nomJoueur.png')) ?>" alt="Connexion d'un joueur" data-agrandir loading="lazy"><figcaption>Création de compte et connexion</figcaption></figure>
    <figure><img src="<?= e(image('minijeux', 'menuJeu.png')) ?>" alt="Menu principal" data-agrandir loading="lazy"><figcaption>Menu principal</figcaption></figure>
    <figure><img src="<?= e(image('minijeux', 'menudujeu.png')) ?>" alt="Menu d'un jeu" data-agrandir loading="lazy"><figcaption>Menu d'un jeu</figcaption></figure>
    <figure><img src="<?= e(image('minijeux', 'menuVS.png')) ?>" alt="Choix du mode joueur contre bot" data-agrandir loading="lazy"><figcaption>Mode joueur contre bot</figcaption></figure>
    <figure><img src="<?= e(image('minijeux', 'pointtotaux.png')) ?>" alt="Scores totaux" data-agrandir loading="lazy"><figcaption>Scores totaux</figcaption></figure>
    <figure><img src="<?= e(image('minijeux', 'pointdujeu.png')) ?>" alt="Scores par jeu" data-agrandir loading="lazy"><figcaption>Scores par jeu</figcaption></figure>
    <figure><img src="<?= e(image('minijeux', 'aide.png')) ?>" alt="Fichier d'aide d'un jeu" data-agrandir loading="lazy"><figcaption>Aide intégrée à chaque jeu</figcaption></figure>
  </div>
</section>

<section class="fenetre apparition">
  <h2>Livrables</h2>
  <ul>
    <li>Application Python complète</li>
    <li>Gestion des joueurs et des scores</li>
    <li>Trois mini-jeux fonctionnels avec bots</li>
    <li>Fichiers d'aide</li>
    <li>Code commenté</li>
  </ul>
</section>

<section class="fenetre apparition" id="analyse">
  <h2>Analyse réflexive</h2>
  <p>
    Ce projet m'a permis de renforcer ma maîtrise de Python, la gestion des fichiers,
    la structuration en modules et la création d'interfaces textuelles claires.
    La difficulté principale a été la sauvegarde des données et la navigation fluide entre les jeux.
    J'ai aussi appris à concevoir des bots simples et à rendre le code générique pour accueillir plusieurs jeux.
  </p>
</section>
