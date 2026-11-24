<?php
require __DIR__ . '/includes/config.php';

$titrePage = 'Portfolio';
$stats = statistiques();
require __DIR__ . '/includes/haut.php';
?>

<!-- ============================================================ ACCUEIL -->
<section class="eveil" id="statut">
  <?= cercle_magique('eveil-cercle') ?>

  <div class="eveil-texte">
    <p class="systeme-ligne" data-ecrire="> Bienvenue sur mon portfolio."></p>
    <h1 class="eveil-nom">
      <span class="eveil-salut">Bonjour, je suis</span>
      <span class="lueur" data-glitch="<?= e(SITE['nom']) ?>"><?= e(SITE['nom']) ?></span>
    </h1>
    <p class="eveil-intro">
      Étudiant en <?= SITE['annee'] ?>ᵉ année de <?= e(SITE['formation']) ?> à l'<?= e(SITE['ecole']) ?>.
      Je conçois des applications, des interfaces et des jeux vidéo, et je cherche à progresser à chaque projet.
    </p>
    <div class="boutons">
      <a href="#donjons" class="bouton bouton-principal"><span>Voir mes projets</span></a>
      <a href="#contact" class="bouton"><span>Me contacter</span></a>
    </div>
  </div>

  <!-- Carte de profil -->
  <aside class="fenetre statut apparition" aria-label="Profil">
    <div class="fenetre-titre"><span>i</span> PROFIL</div>
    <dl class="statut-infos">
      <div><dt>Nom</dt><dd><?= e(SITE['nom']) ?></dd></div>
      <div><dt>Spécialité</dt><dd><?= e(SITE['classe']) ?></dd></div>
      <div><dt>Formation</dt><dd><?= e(SITE['formation']) ?></dd></div>
      <div><dt>Établissement</dt><dd><?= e(SITE['ecole']) ?></dd></div>
    </dl>

    <div class="jauge jauge-mp"><span>BUT</span><div><i style="--valeur:<?= round(SITE['annee'] / 3 * 100) ?>%"></i></div><b><?= SITE['annee'] ?>ᵉ / 3 ans</b></div>

    <ul class="statut-chiffres">
      <li><strong data-compteur="<?= $stats['projets'] ?>">0</strong><span>Projets</span></li>
      <li><strong data-compteur="<?= $stats['ac'] ?>">0</strong><span>AC validés</span></li>
      <li><strong data-compteur="<?= $stats['competences'] ?>">0</strong><span>Compétences</span></li>
      <li><strong data-compteur="<?= $stats['techs'] ?>">0</strong><span>Technologies</span></li>
    </ul>
  </aside>
</section>

<!-- ============================================================ PROJETS -->
<section class="bloc" id="projets">
  <?= titre_section('Réalisations', 'Projets') ?>
  <p class="bloc-intro apparition">Une sélection de projets universitaires et personnels, en Java, Python et C#.</p>
  <div class="portails">
    <?php foreach (PROJETS as $id => $p): ?>
      <?= carte_projet($id, $p) ?>
    <?php endforeach; ?>
  </div>
</section>

<!-- ============================================================ COMPÉTENCES -->
<section class="bloc" id="competences">
  <?= titre_section('Référentiel', 'Compétences du BUT') ?>
  <p class="bloc-intro apparition">
    Les 6 compétences du BUT Informatique et les projets qui les illustrent.
    Cliquez sur une compétence pour afficher ses Apprentissages Critiques (AC).
  </p>

  <div class="competences">
    <?php foreach (COMPETENCES as $code => $c):
        $r = rang_competence($code);
        $projets = projets_pour_competence($code); ?>
      <article class="competence apparition element-<?= e($c['element']) ?>" style="--progression:<?= $r['pourcentage'] ?>%">
        <button class="competence-entete" aria-expanded="false">
          <span class="competence-rune" aria-hidden="true"><?= e($c['rune']) ?></span>
          <span class="competence-noms">
            <small>Compétence <?= e($code) ?></small>
            <strong><?= e($c['nom']) ?></strong>
          </span>
          <span class="badge-rang <?= classe_rang($r['rang']) ?>"><small><?= $r['preuves'] > 1 ? 'Preuves' : 'Preuve' ?></small><?= $r['preuves'] ?></span>
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
            <em>Projets associés :</em>
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

<!-- ============================================================ TECHNOLOGIES -->
<section class="bloc" id="technologies">
  <?= titre_section('Outils', 'Technologies') ?>
  <ul class="inventaire">
    <?php foreach (INVENTAIRE as $objet): ?>
      <li class="objet apparition rarete-<?= e($objet['rarete']) ?>">
        <span class="objet-icone" aria-hidden="true"><b><?= $objet['icone'] ?></b></span>
        <strong><?= e($objet['nom']) ?></strong>
        <small><?= e($objet['type']) ?></small>
      </li>
    <?php endforeach; ?>
  </ul>
</section>

<!-- ============================================================ À PROPOS -->
<section class="bloc" id="a-propos">
  <?= titre_section('Profil', 'À propos') ?>
  <div class="journal">
    <article class="fenetre apparition">
      <h3>Parcours</h3>
      <p>
        Étudiant passionné par le développement logiciel, j'aime créer des projets variés :
        interfaces graphiques, jeux vidéo, scripts Python, applications Java et projets Unity.
      </p>
    </article>
    <article class="fenetre apparition">
      <h3>Ce qui me motive</h3>
      <p>
        Je cherche à comprendre un projet dans sa globalité. J'accorde une grande importance à la cohérence visuelle,
        à la fluidité d'un parcours et à la qualité technique. J'aime explorer de nouvelles technologies,
        expérimenter, corriger, améliorer et repousser les limites de ce que je sais faire.
      </p>
    </article>
    <article class="fenetre apparition">
      <h3>Objectif</h3>
      <p>
        Devenir un développeur polyvalent, capable de créer des projets complets, immersifs et bien construits,
        tout en continuant à apprendre et à affiner mes compétences.
      </p>
    </article>
  </div>
</section>

<!-- ============================================================ CONTACT -->
<section class="bloc" id="contact">
  <?= titre_section('Contact', 'Me contacter') ?>
  <div class="contact">
    <?= cercle_magique('contact-cercle') ?>
    <form id="formulaire-contact" class="fenetre apparition" action="<?= e(SITE['formspree']) ?>" method="POST" novalidate>
      <p>Une question sur un projet, une proposition de stage ou de collaboration ? Écrivez-moi.</p>
      <label>Nom
        <input type="text" id="nom" name="name" autocomplete="name" required>
      </label>
      <label>Email
        <input type="email" id="email" name="email" autocomplete="email" required>
      </label>
      <label>Message
        <textarea id="message" name="message" rows="5" required></textarea>
      </label>
      <!-- Piège anti-robots : ce champ doit rester vide -->
      <input type="text" name="_gotcha" class="piege" tabindex="-1" autocomplete="off">
      <button type="submit" class="bouton bouton-principal"><span>Envoyer le message</span></button>
    </form>
  </div>
</section>

<?php require __DIR__ . '/includes/bas.php'; ?>
