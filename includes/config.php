<?php
/**
 * Configuration générale du portfolio et petites fonctions utilitaires.
 * Inclus en premier par chaque page.
 */

declare(strict_types=1);

// Informations personnelles
const SITE = [
    'nom'        => 'Arranga Evan',
    'prenom'     => 'Evan',
    'formation'  => 'BUT Informatique',
    'annee'      => 2,
    'ecole'      => 'IUT du Limousin',
    'classe'     => 'Développeur d\'applications',
    'github'     => 'https://github.com/Xulungu',
    'formspree'  => 'https://formspree.io/f/xpweokgk',
];

require_once __DIR__ . '/../data/competences.php';
require_once __DIR__ . '/../data/projets.php';
require_once __DIR__ . '/composants.php';

/** Échappe une valeur pour l'afficher dans du HTML. */
function e(?string $texte): string
{
    return htmlspecialchars($texte ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Liens internes. Le site fonctionne en PHP (projet.php?id=...) ;
 * l'outil outils/build.php génère aussi une version statique (projet-xxx.html)
 * pour GitHub Pages, qui ne sait pas exécuter de PHP.
 */
function est_statique(): bool
{
    return defined('VERSION_STATIQUE');
}

function lien_accueil(string $ancre = ''): string
{
    return (est_statique() ? 'index.html' : 'index.php') . ($ancre !== '' ? '#' . $ancre : '');
}

function lien_projet(string $id): string
{
    return est_statique() ? 'projet-' . $id . '.html' : 'projet.php?id=' . urlencode($id);
}

/** Chemin d'une image d'un projet. */
function image(string $projet, string $fichier): string
{
    return 'assets/img/' . $projet . '/' . $fichier;
}

/** Version d'un fichier CSS/JS (évite que le navigateur garde une ancienne version en cache). */
function ressource(string $chemin): string
{
    $fichier = __DIR__ . '/../' . $chemin;
    return $chemin . (is_file($fichier) ? '?v=' . filemtime($fichier) : '');
}

/** Compétence (C1 à C6) à laquelle appartient un AC : ACnc.xx -> Cc. */
function competence_de_ac(string $ac): string
{
    return 'C' . substr($ac, 3, 1);
}

/** Projets qui démontrent une compétence (par leurs AC ou leur liste de compétences). */
function projets_pour_competence(string $code): array
{
    $liste = [];
    foreach (PROJETS as $id => $p) {
        $viaAc = array_filter(array_keys($p['ac']), fn($ac) => competence_de_ac($ac) === $code);
        if ($viaAc || isset($p['competences'][$code])) {
            $liste[$id] = $p;
        }
    }
    return $liste;
}

/** Année du BUT à laquelle se rattache un AC : ACnc.xx -> n. */
function niveau_ac(string $ac): int
{
    return (int) substr($ac, 2, 1);
}

/** Tous les AC démontrés dans le portfolio, triés par compétence puis par code. */
function ac_demontres(): array
{
    $liste = [];
    foreach (PROJETS as $p) {
        foreach (array_keys($p['ac']) as $ac) {
            $liste[$ac] = true;
        }
    }
    $liste = array_keys($liste);
    usort($liste, fn($a, $b) => [competence_de_ac($a), $a] <=> [competence_de_ac($b), $b]);
    return $liste;
}

/** Projets qui démontrent un AC précis. */
function projets_pour_ac(string $ac): array
{
    return array_filter(PROJETS, fn($p) => isset($p['ac'][$ac]));
}

/**
 * Rang d'une compétence, calculé à partir du nombre de preuves
 * (projets du portfolio + autres travaux) : E, D, C, B, A puis S.
 */
function rang_competence(string $code): array
{
    $preuves = count(projets_pour_competence($code)) + count(COMPETENCES[$code]['autres_preuves']);
    $rangs = ['E', 'D', 'C', 'B', 'A', 'S'];
    return [
        'rang'    => $rangs[min($preuves, count($rangs) - 1)],
        'preuves' => $preuves,
        'pourcentage' => min(100, (int) round($preuves / 5 * 100)),
    ];
}

/** Statistiques globales affichées dans la carte de profil. */
function statistiques(): array
{
    $ac = [];
    $techs = [];
    foreach (PROJETS as $p) {
        $ac = array_merge($ac, array_keys($p['ac']));
        $techs = array_merge($techs, $p['techs']);
    }
    return [
        'projets'     => count(PROJETS),
        'ac'          => count(array_unique($ac)),
        'competences' => count(COMPETENCES),
        'techs'       => count(array_unique($techs)),
    ];
}

/** Classe CSS associée à un rang (couleur du badge). */
function classe_rang(string $rang): string
{
    return 'rang-' . strtolower($rang);
}
