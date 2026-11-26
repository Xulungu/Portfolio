<?php
/**
 * Page d'un projet. Exemple : projet.php?id=motrilem
 * Les infos viennent de data/projets.php, le contenu détaillé de contenus/<id>.php.
 */
require __DIR__ . '/includes/config.php';

$id = $id ?? ($_GET['id'] ?? '');
if (!isset(PROJETS[$id])) {
    http_response_code(404);
    $titrePage = 'Projet introuvable';
    require __DIR__ . '/includes/haut.php';
    echo '<section class="bloc introuvable">' . cercle_magique('eveil-cercle')
       . '<p class="systeme-ligne">&gt; Ce projet n\'existe pas.</p>'
       . '<a class="bouton bouton-principal" href="' . e(lien_accueil('projets')) . '"><span>Retour aux projets</span></a></section>';
    require __DIR__ . '/includes/bas.php';
    exit;
}

$p = PROJETS[$id];
$titrePage = $p['titre'] . ' — ' . $p['sous_titre'];
$description = $p['resume'];

// Projets précédent / suivant
$ids = array_keys(PROJETS);
$pos = array_search($id, $ids, true);
$precedent = $ids[($pos - 1 + count($ids)) % count($ids)];
$suivant = $ids[($pos + 1) % count($ids)];

require __DIR__ . '/includes/haut.php';
?>

<div class="liens-haut apparition">
  <a class="retour" href="<?= e(lien_accueil('projets')) ?>">← Retour aux projets</a>
  <a class="lien-prof" href="#enseignants">Partie enseignants ↓</a>
</div>

<section class="donjon-entree <?= classe_rang($p['rang']) ?>">
  <?= cercle_magique('donjon-cercle') ?>
  <div class="donjon-titre">
    <p class="systeme-ligne" data-ecrire="> <?= e($p['cadre']) ?> · <?= e($p['annee']) ?>"></p>
    <h1><span class="lueur" data-glitch="<?= e($p['titre']) ?>"><?= e($p['titre']) ?></span></h1>
    <p class="donjon-sous"><?= e($p['sous_titre']) ?></p>
    <p><?= e($p['resume']) ?></p>
  </div>
  <figure class="donjon-image apparition">
    <img src="<?= e(image($id, $p['couverture'])) ?>" alt="Aperçu du projet <?= e($p['titre']) ?>" class="<?= $p['pixel'] ? 'pixel' : '' ?>" data-agrandir>
  </figure>
</section>

<aside class="fenetre infos-donjon apparition" aria-label="Fiche du projet">
  <div class="fenetre-titre"><span>i</span> FICHE DU PROJET</div>
  <dl>
    <div><dt>Cadre</dt><dd><?= e($p['cadre']) ?></dd></div>
    <div><dt>Équipe</dt><dd><?= e($p['equipe']) ?></dd></div>
    <div><dt>Statut</dt><dd class="<?= $p['statut'] === 'En cours' ? 'statut-actif' : 'statut-fini' ?>"><?= e($p['statut']) ?></dd></div>
    <div><dt>Année</dt><dd><?= e($p['annee']) ?></dd></div>
    <div><dt>Technologies</dt><dd><ul class="puces-tech"><?php foreach ($p['techs'] as $t): ?><li><?= e($t) ?></li><?php endforeach; ?></ul></dd></div>
    <?php if ($p['github']): ?>
      <div><dt>Code</dt><dd><a href="<?= e($p['github']) ?>" target="_blank" rel="noopener">Voir sur GitHub ↗</a></dd></div>
    <?php endif; ?>
  </dl>
</aside>

<div class="donjon-contenu">
  <?php require __DIR__ . '/contenus/' . $id . '.php'; ?>
</div>

<section class="espace-prof apparition" id="enseignants" aria-labelledby="titre-enseignants">
  <header class="espace-prof-entete">
    <span class="espace-prof-badge">Espace enseignants</span>
    <h2 id="titre-enseignants">Pour les enseignants</h2>
    <p>Synthèse des compétences du BUT Informatique et des apprentissages critiques (AC) mobilisés dans ce projet.</p>
  </header>

  <div class="espace-prof-corps">
    <h3>Compétences mobilisées</h3>
    <ul class="liste-competences">
      <?php foreach ($p['competences'] as $code => $texte): $c = COMPETENCES[$code]; ?>
        <li class="element-<?= e($c['element']) ?>">
          <span class="competence-rune" aria-hidden="true"><?= e($c['rune']) ?></span>
          <div><strong><?= e($code) ?> — <?= e($c['nom']) ?></strong><p><?= e($texte) ?></p></div>
        </li>
      <?php endforeach; ?>
    </ul>

    <h3>Apprentissages critiques démontrés</h3>
    <div class="tableau-defile">
      <table class="tableau-ac">
        <thead>
          <tr><th scope="col">AC</th><th scope="col">Apprentissage critique</th><th scope="col">Compétence</th><th scope="col">Niveau</th><th scope="col">Ce que le projet démontre</th></tr>
        </thead>
        <tbody>
          <?php
          $acs = array_keys($p['ac']);
          usort($acs, fn($a, $b) => [competence_de_ac($a), $a] <=> [competence_de_ac($b), $b]);
          foreach ($acs as $ac): $comp = competence_de_ac($ac); ?>
            <tr class="element-<?= e(COMPETENCES[$comp]['element']) ?>">
              <th scope="row"><?= e($ac) ?></th>
              <td><?= e(AC_LIBELLES[$ac] ?? '') ?></td>
              <td><span class="puce-competence"><?= e($comp) ?></span></td>
              <td>BUT <?= niveau_ac($ac) ?></td>
              <td><?= e($p['ac'][$ac]) ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>

    <h3>Traces disponibles</h3>
    <ul class="traces">
      <li><a href="#analyse">Analyse réflexive</a> — retour sur les difficultés et les apprentissages du projet.</li>
      <?php if ($p['github']): ?>
        <li><a href="<?= e($p['github']) ?>" target="_blank" rel="noopener">Code source sur GitHub ↗</a></li>
      <?php endif; ?>
      <li>Captures d'écran et description des fonctionnalités dans les sections ci-dessus.</li>
      <li><a href="<?= e(lien_accueil('enseignants')) ?>">Tableau récapitulatif de tous les AC du portfolio</a></li>
    </ul>
  </div>
</section>

<nav class="donjons-voisins apparition" aria-label="Autres projets">
  <a href="<?= e(lien_projet($precedent)) ?>" data-portail>
    <small>← Projet précédent</small><strong><?= e(PROJETS[$precedent]['titre']) ?></strong>
  </a>
  <a href="<?= e(lien_projet($suivant)) ?>" data-portail>
    <small>Projet suivant →</small><strong><?= e(PROJETS[$suivant]['titre']) ?></strong>
  </a>
</nav>

<?php require __DIR__ . '/includes/bas.php'; ?>
