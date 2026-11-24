<?php
require __DIR__ . '/includes/config.php';

$titrePage = 'Portfolio';
$stats = statistiques();
require __DIR__ . '/includes/haut.php';
?>

<!-- ============================================================ STATUT (accueil) -->
<section class="eveil" id="statut">
  <?= cercle_magique('eveil-cercle') ?>

  <div class="eveil-texte">
    <p class="systeme-ligne" data-ecrire="[SYSTÈME] Un nouveau Joueur s'est éveillé."></p>
    <h1 class="eveil-nom">
      <span class="eveil-salut">Bonjour, je suis</span>
      <span class="lueur" data-glitch="<?= e(SITE['nom']) ?>"><?= e(SITE['nom']) ?></span>
    </h1>
    <p class="eveil-intro">
      Étudiant en <?= SITE['annee'] ?>ᵉ année de <?= e(SITE['formation']) ?> à l'<?= e(SITE['ecole']) ?>.
      Je crée des applications, des interfaces et des jeux vidéo — et je monte de niveau à chaque projet.
    </p>
    <div class="boutons">
      <a href="#donjons" class="bouton bouton-principal"><span>Entrer dans les donjons</span></a>
      <a href="#contact" class="bouton"><span>M'envoyer un message</span></a>
    </div>
  </div>

  <!-- Fenêtre de statut façon « Système » -->
  <aside class="fenetre statut apparition" aria-label="Fenêtre de statut">
    <div class="fenetre-titre"><span>!</span> STATUT</div>
    <dl class="statut-infos">
      <div><dt>Nom</dt><dd><?= e(SITE['nom']) ?></dd></div>
      <div><dt>Classe</dt><dd><?= e(SITE['classe']) ?></dd></div>
      <div><dt>Niveau</dt><dd>BUT <?= SITE['annee'] ?></dd></div>
      <div><dt>Titre</dt><dd><?= e(SITE['titre']) ?></dd></div>
    </dl>

    <div class="jauge jauge-hp"><span>HP</span><div><i style="--valeur:100%"></i></div><b>100/100</b></div>
    <div class="jauge jauge-mp"><span>MP</span><div><i style="--valeur:86%"></i></div><b>∞</b></div>

    <ul class="statut-chiffres">
      <li><strong data-compteur="<?= $stats['projets'] ?>">0</strong><span>Donjons</span></li>
      <li><strong data-compteur="<?= $stats['ac'] ?>">0</strong><span>AC validés</span></li>
      <li><strong data-compteur="<?= $stats['competences'] ?>">0</strong><span>Compétences</span></li>
      <li><strong data-compteur="<?= $stats['techs'] ?>">0</strong><span>Technos</span></li>
    </ul>
  </aside>
</section>

<!-- ============================================================ DONJONS (projets) -->
<section class="bloc" id="donjons" data-notification="Des portails sont apparus : <?= $stats['projets'] ?> donjons détectés.">
  <?= titre_section('Quêtes', 'Donjons explorés') ?>
  <p class="bloc-intro apparition">Chaque projet est un donjon : plus le rang est élevé, plus il a été long et exigeant.</p>
  <div class="portails">
    <?php foreach (PROJETS as $id => $p): ?>
      <?= carte_projet($id, $p) ?>
    <?php endforeach; ?>
  </div>
</section>

<!-- ============================================================ COMPÉTENCES -->
<section class="bloc" id="competences" data-notification="Fenêtre des compétences ouverte.">
  <?= titre_section('Compétences du BUT', 'Arbre des compétences') ?>
  <p class="bloc-intro apparition">
    Les 6 compétences du BUT Informatique. Le rang est calculé automatiquement selon le nombre de projets qui les prouvent.
    Clique sur une compétence pour voir ses Apprentissages Critiques (AC).
  </p>

  <div class="competences">
    <?php foreach (COMPETENCES as $code => $c):
        $r = rang_competence($code);
        $projets = projets_pour_competence($code); ?>
      <article class="competence apparition element-<?= e($c['element']) ?>" style="--progression:<?= $r['pourcentage'] ?>%">
        <button class="competence-entete" aria-expanded="false">
          <span class="competence-rune" aria-hidden="true"><?= e($c['rune']) ?></span>
          <span class="competence-noms">
            <small><?= e($code) ?> · <?= e($c['type']) ?></small>
            <strong><?= e($c['skill']) ?></strong>
            <span><?= e($c['nom']) ?></span>
          </span>
          <?= badge_rang($r['rang']) ?>
        </button>

        <div class="competence-barre"><i></i></div>
        <p class="competence-resume"><?= e($c['resume']) ?></p>

        <div class="competence-detail"><div>
          <ul class="liste-ac">
            <?php foreach ($c['ac'] as $ac):
                $preuves = projets_pour_ac($ac); ?>
              <li class="<?= $preuves ? 'ac-valide' : '' ?>">
                <strong><?= e($ac) ?></strong> <?= e(AC_LIBELLES[$ac] ?? '') ?>
                <?php if ($preuves): ?>
                  <span class="ac-preuves">
                    <?php foreach ($preuves as $pid => $p): ?>
                      <a href="<?= e(lien_projet($pid)) ?>" data-portail><?= e($p['titre']) ?></a>
                    <?php endforeach; ?>
                  </span>
                <?php endif; ?>
              </li>
            <?php endforeach; ?>
          </ul>
          <p class="competence-preuves">
            <em>Preuves :</em>
            <?php
            $noms = array_map(fn($p) => $p['titre'], $projets);
            echo e(implode(', ', array_merge($noms, $c['autres_preuves'])) ?: '—');
            ?>
          </p>
        </div></div>
      </article>
    <?php endforeach; ?>
  </div>
</section>

<!-- ============================================================ INVENTAIRE (technos) -->
<section class="bloc" id="inventaire" data-notification="Inventaire chargé.">
  <?= titre_section('Équipement', 'Inventaire') ?>
  <ul class="inventaire">
    <?php foreach (INVENTAIRE as $objet): ?>
      <li class="objet apparition rarete-<?= e($objet['rarete']) ?>">
        <span class="objet-icone" aria-hidden="true"><b><?= $objet['icone'] ?></b></span>
        <strong><?= e($objet['nom']) ?></strong>
        <small><?= e($objet['type']) ?> · <?= e(ucfirst(str_replace(['legendaire', 'epique'], ['légendaire', 'épique'], $objet['rarete']))) ?></small>
      </li>
    <?php endforeach; ?>
  </ul>
</section>

<!-- ============================================================ JOURNAL (à propos) -->
<section class="bloc" id="journal">
  <?= titre_section('Lore', 'Journal du joueur') ?>
  <div class="journal">
    <article class="fenetre apparition">
      <h3>Origine</h3>
      <p>
        Étudiant passionné par le développement logiciel, j'aime créer des projets variés :
        interfaces graphiques, jeux vidéo, scripts Python, applications Java et projets Unity.
      </p>
    </article>
    <article class="fenetre apparition">
      <h3>Ce qui me fait avancer</h3>
      <p>
        Je cherche à comprendre un projet dans sa globalité. J'accorde une grande importance à la cohérence visuelle,
        à la fluidité d'un parcours et à la qualité technique. J'aime explorer de nouvelles technologies,
        expérimenter, corriger, améliorer et repousser les limites de ce que je sais faire.
      </p>
    </article>
    <article class="fenetre apparition">
      <h3>Quête principale</h3>
      <p>
        Devenir un développeur polyvalent, capable de créer des projets complets, immersifs et bien construits,
        tout en continuant à apprendre et à affiner mes compétences.
      </p>
    </article>
  </div>
</section>

<!-- ============================================================ CONTACT -->
<section class="bloc" id="contact" data-notification="Cercle d'invocation prêt.">
  <?= titre_section('Invocation', 'Me contacter') ?>
  <div class="contact">
    <?= cercle_magique('contact-cercle') ?>
    <form id="formulaire-contact" class="fenetre apparition" action="<?= e(SITE['formspree']) ?>" method="POST" novalidate>
      <p>Envie de collaborer, une question sur un projet ? Trace le cercle et envoie ton message.</p>
      <label>Ton nom
        <input type="text" id="nom" name="name" autocomplete="name" required>
      </label>
      <label>Ton email
        <input type="email" id="email" name="email" autocomplete="email" required>
      </label>
      <label>Ton message
        <textarea id="message" name="message" rows="5" required></textarea>
      </label>
      <!-- Piège anti-robots : ce champ doit rester vide -->
      <input type="text" name="_gotcha" class="piege" tabindex="-1" autocomplete="off">
      <button type="submit" class="bouton bouton-principal"><span>Lancer l'invocation</span></button>
    </form>
  </div>
</section>

<?php require __DIR__ . '/includes/bas.php'; ?>
