<?php /* Contenu de la page du projet Motrilem (inclus par projet.php) */ ?>

<ul class="chiffres apparition">
  <li><strong data-compteur="100" data-prefixe="~">0</strong><span>scripts C#</span></li>
  <li><strong data-compteur="7">0</strong><span>scènes jouables</span></li>
  <li><strong data-compteur="3">0</strong><span>magies</span></li>
  <li><strong data-compteur="2">0</strong><span>boss</span></li>
</ul>

<section class="fenetre apparition">
  <h2>Contexte</h2>
  <p>
    Motrilem est un projet personnel que je développe seul. C'est un jeu 2D de type
    <strong>metroidvania</strong> réalisé sous Unity, inspiré de jeux comme <em>Hollow Knight</em>.
    Le joueur incarne un personnage mort 5000 ans avant les événements du jeu, revenu à la vie
    sans aucun souvenir de son passé.
  </p>
  <p>
    La démo actuelle se joue du menu principal jusqu'à la fin du premier donjon : un tutoriel,
    un marécage à explorer, un mini-boss, un boss complet et un système de sauvegarde.
  </p>
</section>

<section class="fenetre apparition">
  <h2>Univers et histoire</h2>
  <div class="lore">
    <div class="lore-sprites" aria-hidden="true">
      <img src="<?= e(image('motrilem', 'mage_lumiere.png')) ?>" alt="" class="pixel flotte" width="60">
      <img src="<?= e(image('motrilem', 'livre_ouvert.png')) ?>" alt="" class="pixel flotte lent" width="102">
      <img src="<?= e(image('motrilem', 'mage_ombre.png')) ?>" alt="" class="pixel flotte" width="60">
    </div>
    <div>
      <p>
        Un an après son réveil, le protagoniste découvre un livre ancien qui raconte la légende de deux
        frères mages : l'un héros, l'autre devenu un puissant antagoniste. Leur affrontement s'est terminé
        par la mort des deux.
      </p>
      <p>
        En lisant ce livre, le héros retrouve brièvement la mémoire, avant que celle-ci ne soit absorbée par
        l'ouvrage. Il ne lui reste qu'un souvenir : la maîtrise d'un type de magie. Pour retrouver son identité,
        il doit récupérer les pages du livre dispersées dans le monde, chacune gardée par un boss.
      </p>
    </div>
  </div>
</section>

<section class="fenetre apparition">
  <h2>Parcours de la démo</h2>
  <ol class="chronologie">
    <li><strong>Menu principal</strong> : Jouer, Paramètres (volumes musique / effets / dialogues), Quitter.</li>
    <li><strong>Tutoriel dans la grotte</strong> : intro en fondu, panneaux, livre de la légende, puis choix définitif de l'affinité magique.</li>
    <li><strong>Le marécage acide</strong> : un monde découpé en plusieurs cartes reliées (Berges contaminées, Racines noyées, Ruines englouties, Hauteurs infestées, Cœur du marécage).</li>
    <li><strong>Le Terrier gluant</strong> : l'antre du mini-boss, le Gros Gluant.</li>
    <li><strong>Le donjon de Séraphel</strong> : le Seuil, la Galerie des Remerciements, l'antichambre, puis l'arène du boss.</li>
    <li><strong>Une page du livre</strong> : récompense du boss, qui débloque l'attaque chargée. Une porte « À suivre… » termine la démo.</li>
  </ol>
</section>

<section class="fenetre apparition">
  <h2>Système de magie</h2>
  <p>Au début du jeu, le joueur choisit une affinité sur un écran de cartes animé. Le choix est définitif et change toute la façon de combattre :</p>
  <div class="cartes">
    <div class="carte element-feu">
      <img src="<?= e(image('motrilem', 'icone_feu.png')) ?>" alt="" class="pixel" width="48">
      <h3>Feu</h3>
      <p>Boule de feu qui explose en petite zone et fait brûler l'ennemi (dégâts sur la durée).</p>
    </div>
    <div class="carte element-foudre">
      <img src="<?= e(image('motrilem', 'icone_foudre.png')) ?>" alt="" class="pixel" width="48">
      <h3>Foudre</h3>
      <p>Éclair très rapide qui rebondit sur deux ennemis proches.</p>
    </div>
    <div class="carte element-glace">
      <img src="<?= e(image('motrilem', 'icone_glace.png')) ?>" alt="" class="pixel" width="48">
      <h3>Glace</h3>
      <p>Éclat qui ralentit ; trois coups rapprochés gèlent complètement l'ennemi.</p>
    </div>
  </div>
  <ul>
    <li>Visée dans 8 directions (haut, bas et diagonales).</li>
    <li>Attaque chargée débloquée après le premier boss : maintenir puis relâcher.</li>
    <li>Effets visuels propres à chaque magie : aura autour du joueur, braises, brume froide, étincelles.</li>
  </ul>
</section>

<section class="fenetre apparition">
  <h2>Déplacements</h2>
  <p>J'ai beaucoup travaillé le « ressenti » des contrôles, qui fait la différence dans un jeu de plateforme :</p>
  <ul>
    <li>Marche et course avec un élan qui se construit progressivement et se conserve en l'air.</li>
    <li>Saut variable (relâcher la touche raccourcit le saut), <em>coyote time</em> et <em>jump buffer</em>.</li>
    <li>Plateformes traversables par le bas, plateformes mobiles, nénuphars et ascenseurs.</li>
    <li>Regarder en haut ou en bas pour voir la suite du niveau.</li>
    <li>Nage dans l'acide une fois l'immunité obtenue, avec un bond pour en sortir.</li>
  </ul>
</section>

<section class="fenetre apparition">
  <h2>Ennemis et boss</h2>
  <div class="cartes">
    <div class="carte">
      <img src="<?= e(image('motrilem', 'MC.png')) ?>" alt="Le protagoniste" class="pixel" width="70">
      <h3>Le protagoniste</h3>
      <p>Revenu d'entre les morts, il ne garde qu'un souvenir : sa magie.</p>
    </div>
    <div class="carte">
      <img src="<?= e(image('motrilem', 'ennemy.png')) ?>" alt="Moustique piqueur" width="80">
      <h3>Moustique piqueur</h3>
      <p>Il s'arrête, tremble en rougissant, puis lance une copie fantôme de sa trompe sur le joueur.</p>
    </div>
    <div class="carte">
      <img src="<?= e(image('motrilem', 'slime.png')) ?>" alt="Slime" class="pixel" width="64">
      <h3>Slimes</h3>
      <p>Ennemis de base du marécage, qu'on peut aussi vaincre en les écrasant.</p>
    </div>
    <div class="carte">
      <h3>Le Gros Gluant</h3>
      <p>Mini-boss en arène fermée : bonds, ondes de choc au sol, crachats de glu et appels de petits slimes. Il garde un éclat de vie.</p>
    </div>
  </div>

  <div class="boss">
    <img src="<?= e(image('motrilem', 'Boss1.png')) ?>" alt="Séraphel, le premier boss" width="220" class="flotte" data-agrandir>
    <div>
      <p class="boss-alerte">⚠ BOSS</p>
      <h3>Séraphel — « Ce qui bourdonne dans la lumière »</h3>
      <p>Un moustique géant, presque une divinité, gonflé d'acide. C'est le combat le plus abouti du jeu :</p>
      <ul>
        <li>Une dizaine d'attaques : trompes, plongeon, charge annoncée, pluie d'acide, geysers, nova, spirale, vague d'acide, essaim…</li>
        <li>Plusieurs phases : à mi-vie, il plonge dans un bassin pour se soigner, puis revient enragé et invoque des moustiques qu'il dévore s'ils survivent.</li>
        <li>L'arène se dégrade : le sol s'effondre dans l'acide au fil du combat.</li>
        <li>Réaction à chaque magie : le feu le brûle, la glace le ralentit, la foudre l'étourdit.</li>
      </ul>
    </div>
  </div>
</section>

<section class="fenetre apparition">
  <h2>Systèmes du jeu</h2>
  <div class="cartes">
    <div class="carte"><h3>Sauvegarde</h3><p>Fichier JSON écrit en priant devant une statue d'ange : vie, magie, améliorations, objets ramassés et point de réapparition.</p></div>
    <div class="carte"><h3>Monde en cartes</h3><p>Le marécage est découpé en plusieurs scènes. Les transitions conservent la position et l'élan du joueur, et le nom de chaque zone s'affiche à l'entrée.</p></div>
    <div class="carte"><h3>Exploration</h3><p>Éclats de vie cachés (+20 PV max), urnes cassables, murs fissurés, leviers, salles de vagues d'ennemis.</p></div>
    <div class="carte"><h3>Audio</h3><p>Musique par zone avec fondu enchaîné, musique de combat, bruitages, réglage séparé des volumes.</p></div>
    <div class="carte"><h3>Interface</h3><p>Barre de vie, barre du boss, menu pause, écran de mort, dialogues, navigation clavier et souris.</p></div>
    <div class="carte"><h3>Rendu</h3><p>Décors en parallaxe, particules, lumières qui vacillent, animations du joueur et des ennemis.</p></div>
  </div>
</section>

<section class="fenetre fenetre-ombre apparition">
  <h2>En préparation : un boss final qui apprend du joueur</h2>
  <p>
    Pendant toute la partie, le jeu mesure la façon de jouer : précision des sorts, distance gardée avec les ennemis,
    taux d'esquive, agressivité, préférence entre la magie et l'écrasement. Ce profil est enregistré dans la sauvegarde.
    Il servira de base à l'IA du boss final, qui devra imiter ou contrer le style du joueur.
  </p>
</section>

<section class="fenetre apparition">
  <h2>Méthode de travail</h2>
  <ul>
    <li><strong>Outils d'éditeur Unity</strong> : des scripts génèrent automatiquement les scènes (tutoriel, marécage, donjon), ce qui me permet de modifier un niveau sans tout refaire à la main.</li>
    <li><strong>Conception du niveau en Python</strong> : un petit outil décrit le marécage et génère le code C# du découpage en zones.</li>
    <li><strong>Itérations</strong> : 13 étapes de développement sauvegardées (tutoriel, v2, v3, étang, monde ouvert, panneaux, marécage, boss…), avec Git en parallèle.</li>
    <li><strong>Code commenté en français</strong> et organisé par dossier : joueur, magie, ennemis, sauvegarde, audio, menus, visuels.</li>
  </ul>
</section>

<section class="fenetre apparition">
  <h2>Analyse réflexive</h2>
  <p>
    Au début, Motrilem se limitait à un personnage qui se déplace. Le faire grandir jusqu'à une vraie démo m'a appris
    à penser en systèmes : chaque élément (sauvegarde, magie, zones, musique) doit fonctionner avec tous les autres.
    La sauvegarde et le passage entre les cartes ont été les parties les plus difficiles, car il faut retrouver
    exactement l'état du jeu d'une scène à l'autre.
  </p>
  <p>
    Le combat contre Séraphel m'a montré l'importance de la lisibilité : chaque attaque doit être annoncée pour
    que le joueur puisse réagir. J'ai aussi compris l'intérêt d'outils maison : générer les scènes par code m'a fait
    gagner beaucoup de temps à chaque correction.
  </p>
</section>

<section class="fenetre apparition">
  <h2>Prochaines étapes</h2>
  <ul class="liste-quete">
    <li>La suite de l'aventure après le donjon de Séraphel.</li>
    <li>De nouvelles pages du livre et de nouveaux boss.</li>
    <li>Le boss final avec une IA adaptée au profil du joueur.</li>
  </ul>
</section>
