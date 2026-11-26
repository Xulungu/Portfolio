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
        En lisant ce livre, le protagoniste retrouve brièvement la mémoire, avant que celle-ci ne soit absorbée par
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
  <h2>Personnages et ennemis en jeu</h2>
  <p>Les sprites tels qu'ils apparaissent dans la démo, avec leurs animations.</p>
  <div class="cartes">
    <div class="carte carte-fiche" tabindex="0" role="button" aria-haspopup="dialog">
      <?= sprite_anime(image('motrilem', 'heros_marche.png'), 12, 47, 86, 1.6, 0.96, 'Le protagoniste en train de marcher') ?>
      <h3>Le protagoniste</h3>
      <p>Revenu d'entre les morts, il ne garde qu'un souvenir : sa magie. Animations de repos, de marche, de course et de saut.</p>
      <div class="carte-detail" hidden data-etiquette="En jeu">
        <p>Mort 5000 ans avant les événements du jeu, il revient à la vie sans aucun souvenir. Il découvre le livre qui raconte la légende des deux frères mages et doit en retrouver les pages pour reconstituer son identité.</p>
        <ul class="fiche-stats"><li><span>Taille d'une image</span><strong>48 × 90 px</strong></li><li><span>Animations</span><strong>repos 6 · marche 12 · course 12 · saut 6 images</strong></li><li><span>Apparences</span><strong>7 couleurs de cape</strong></li></ul>
      </div>
    </div>
    <div class="carte carte-fiche" tabindex="0" role="button" aria-haspopup="dialog">
      <?= sprite_anime(image('motrilem', 'moustique.png'), 7, 67, 70, 1.6, 0.63, 'Moustique piqueur en vol') ?>
      <h3>Moustique piqueur</h3>
      <p>Il s'arrête, tremble en rougissant, puis lance une copie fantôme de sa trompe sur le joueur.</p>
      <div class="carte-detail" hidden data-etiquette="En jeu">
        <p>Ennemi volant du marécage. Quand le joueur s'approche, il s'immobilise, tremble et rougit : c'est l'alerte. Une copie fantôme de sa trompe se forme puis file vers le joueur. Elle fait plus de dégâts que le simple contact.</p>
        <ul class="fiche-stats"><li><span>Animation de vol</span><strong>7 images</strong></li><li><span>Dégâts de la trompe</span><strong>30</strong></li></ul>
      </div>
    </div>
    <div class="carte carte-fiche" tabindex="0" role="button" aria-haspopup="dialog">
      <img src="<?= e(image('motrilem', 'slime_jeu.png')) ?>" alt="Slime" class="pixel" width="99">
      <h3>Slimes</h3>
      <p>Ennemis de base du marécage, qu'on peut aussi vaincre en les écrasant.</p>
      <div class="carte-detail" hidden data-etiquette="En jeu">
        <p>Ils avancent par petits bonds et sautent vers le joueur quand il approche. Ils font demi-tour devant les trous et les bassins d'acide. On peut les écraser en sautant dessus ou les détruire à la magie ; les gros slimes se divisent en deux petits.</p>
        <ul class="fiche-stats"><li><span>Points de vie</span><strong>3 (gros : 7)</strong></li><li><span>Dégâts</span><strong>10 (gros : 15)</strong></li><li><span>Animations</span><strong>repos 2 images · saut</strong></li></ul>
      </div>
    </div>
    <div class="carte carte-fiche" tabindex="0" role="button" aria-haspopup="dialog">
      <img src="<?= e(image('motrilem', 'slime_jeu.png')) ?>" alt="Le Gros Gluant" class="pixel" width="150">
      <h3>Le Gros Gluant</h3>
      <p>Mini-boss : un slime 2,3 fois plus grand, en arène fermée. Bonds, ondes de choc au sol, crachats de glu et appels de petits slimes. Il garde un éclat de vie.</p>
      <div class="carte-detail" hidden data-etiquette="En jeu">
        <p>Le mini-boss du Terrier gluant. Quand le joueur entre dans son antre, les grilles se ferment et sa barre de vie apparaît. Il retombe lourdement en envoyant deux ondes gluantes au ras du sol, crache des boules de glu en cloche et fait tomber des petits slimes du plafond quand il est blessé. Plus il perd de vie, plus il enchaîne vite. À sa mort, il laisse son noyau et un éclat de vie.</p>
        <ul class="fiche-stats"><li><span>Points de vie</span><strong>30</strong></li><li><span>Dégâts</span><strong>25, ralentit le joueur</strong></li><li><span>Taille</span><strong>2,3 × un slime</strong></li></ul>
      </div>
    </div>
  </div>

  <div class="boss">
    <div class="flotte"><?= sprite_anime(image('motrilem', 'seraphel.png'), 12, 226, 234, 1.2, 0.24, 'Séraphel, le premier boss, ailes en mouvement') ?></div>
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

  <h3 class="sous-titre-section">Le protagoniste et ses 7 skins</h3>
  <p>Le joueur choisit l'apparence de sa cape : rouge (par défaut), gris, rose, vert, bleu, blanc ou noir.</p>
  <img src="<?= e(image('motrilem', 'heros_skins.png')) ?>" alt="Les 7 skins du protagoniste : rouge, gris, rose, vert, bleu, blanc et noir" class="pixel planche-skins" data-agrandir>

  <h3 class="sous-titre-section">Objets du monde</h3>
  <div class="cartes">
    <div class="carte carte-fiche" tabindex="0" role="button" aria-haspopup="dialog">
      <div class="duo-sprites">
        <img src="<?= e(image('motrilem', 'statue_0.png')) ?>" alt="Statue d'ange non activée" class="pixel" width="96">
        <span aria-hidden="true">→</span>
        <img src="<?= e(image('motrilem', 'statue_3.png')) ?>" alt="Statue d'ange activée, ailes déployées" class="pixel" width="96">
      </div>
      <h3>Statue d'ange</h3>
      <p>Point de sauvegarde. Elle déploie ses ailes la première fois qu'on l'utilise et les garde ensuite.</p>
      <div class="carte-detail" hidden data-etiquette="En jeu">
        <p>Prier devant une statue sauvegarde la partie, rend toute la vie et place le point de réapparition. La première fois, elle déploie ses ailes et les garde : on voit d'un coup d'œil quelles statues ont déjà été activées.</p>
        <ul class="fiche-stats"><li><span>Animation</span><strong>4 étapes, de repliée à déployée</strong></li></ul>
      </div>
    </div>
    <div class="carte carte-fiche" tabindex="0" role="button" aria-haspopup="dialog">
      <img src="<?= e(image('motrilem', 'eclat_vie.png')) ?>" alt="Éclat de vie" class="pixel" width="52">
      <h3>Éclat de vie</h3>
      <p>Caché dans le monde : chaque éclat augmente la vie maximale de 20.</p>
      <div class="carte-detail" hidden data-etiquette="En jeu">
        <p>Objet caché à trouver en explorant. Chaque éclat ne peut être ramassé qu'une fois : il est mémorisé dans la sauvegarde. Le Gros Gluant en garde un.</p>
        <ul class="fiche-stats"><li><span>Bonus</span><strong>+20 points de vie maximum</strong></li></ul>
      </div>
    </div>
    <div class="carte carte-fiche" tabindex="0" role="button" aria-haspopup="dialog">
      <img src="<?= e(image('motrilem', 'urne.png')) ?>" alt="Urne" class="pixel" width="40">
      <h3>Urne</h3>
      <p>Objet cassable du décor ; elle ne réapparaît qu'après une sauvegarde.</p>
      <div class="carte-detail" hidden data-etiquette="En jeu">
        <p>Urne en terre cuite qu'un sort fait voler en éclats. Une fois sur sept, elle contient un peu de soin. Elle reste cassée tant que le joueur ne sauvegarde pas : mourir ou changer de carte ne la répare pas.</p>
        <ul class="fiche-stats"><li><span>Chance de soin</span><strong>1 sur 7</strong></li></ul>
      </div>
    </div>
  </div>
</section>

<section class="fenetre apparition">
  <h2>Sketch design : premières versions</h2>
  <p>Les premiers croquis des personnages, avant les sprites définitifs du jeu.</p>
  <div class="cartes">
    <div class="carte carte-fiche" tabindex="0" role="button" aria-haspopup="dialog">
      <img src="<?= e(image('motrilem', 'MC.png')) ?>" alt="Premier croquis du protagoniste" class="pixel" width="70">
      <h3>Le protagoniste</h3>
      <p>Première version du protagoniste.</p>
      <div class="carte-detail" hidden data-etiquette="Sketch design">
        <p>Premier design du protagoniste. La version du jeu reprend la cape à capuche et les yeux lumineux, dans un sprite plus grand et entièrement animé.</p>
      </div>
    </div>
    <div class="carte carte-fiche" tabindex="0" role="button" aria-haspopup="dialog">
      <img src="<?= e(image('motrilem', 'ennemy.png')) ?>" alt="Premier croquis du moustique piqueur" width="80">
      <h3>Moustique piqueur</h3>
      <p>Premier design du moustique.</p>
      <div class="carte-detail" hidden data-etiquette="Sketch design">
        <p>Premier design du moustique piqueur. La version du jeu le reprend avec une animation de vol de 7 images.</p>
      </div>
    </div>
    <div class="carte carte-fiche" tabindex="0" role="button" aria-haspopup="dialog">
      <img src="<?= e(image('motrilem', 'slime.png')) ?>" alt="Premier croquis du slime" class="pixel" width="64">
      <h3>Slime</h3>
      <p>Première version du slime.</p>
      <div class="carte-detail" hidden data-etiquette="Sketch design">
        <p>Premier slime, bleu et plus petit. La version du jeu est verte, plus détaillée, avec des images de repos et de saut.</p>
      </div>
    </div>
    <div class="carte carte-fiche" tabindex="0" role="button" aria-haspopup="dialog">
      <img src="<?= e(image('motrilem', 'Boss1.png')) ?>" alt="Premier croquis de Séraphel" width="150">
      <h3>Séraphel</h3>
      <p>Premier design du boss, avant le découpage du corps et des ailes pour l'animation.</p>
      <div class="carte-detail" hidden data-etiquette="Sketch design">
        <p>Premier design de Séraphel, dessiné en une seule image. Pour le jeu, il a été découpé en un corps et trois ailes séparées : chaque aile pivote autour de son point d'attache, ce qui permet d'animer les battements.</p>
      </div>
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
