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

<a class="retour apparition" href="<?= e(lien_accueil('projets')) ?>">← Retour aux projets</a>

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

  <section class="fenetre apparition">
    <h2>Compétences du BUT démontrées</h2>
    <ul class="liste-competences">
      <?php foreach ($p['competences'] as $code => $texte): $c = COMPETENCES[$code]; ?>
        <li class="element-<?= e($c['element']) ?>">
          <span class="competence-rune" aria-hidden="true"><?= e($c['rune']) ?></span>
          <div><strong><?= e($code) ?> — <?= e($c['nom']) ?></strong><p><?= e($texte) ?></p></div>
        </li>
      <?php endforeach; ?>
    </ul>
  </section>

  <section class="fenetre apparition">
    <h2>Apprentissages Critiques (AC) démontrés</h2>
    <ul class="liste-ac ouverte">
      <?php foreach ($p['ac'] as $ac => $preuve): ?>
        <li class="ac-valide"><strong><?= e($ac) ?></strong> <?= e(AC_LIBELLES[$ac] ?? '') ?> <span class="ac-preuve">— <?= e($preuve) ?></span></li>
      <?php endforeach; ?>
    </ul>
  </section>
</div>

<nav class="donjons-voisins apparition" aria-label="Autres projets">
  <a href="<?= e(lien_projet($precedent)) ?>" data-portail>
    <small>← Projet précédent</small><strong><?= e(PROJETS[$precedent]['titre']) ?></strong>
  </a>
  <a href="<?= e(lien_projet($suivant)) ?>" data-portail>
    <small>Projet suivant →</small><strong><?= e(PROJETS[$suivant]['titre']) ?></strong>
  </a>
</nav>

<?php require __DIR__ . '/includes/bas.php'; ?>
