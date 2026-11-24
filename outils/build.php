<?php
/**
 * Génère une version statique (HTML) du portfolio dans le dossier docs/,
 * pour l'héberger sur GitHub Pages (qui n'exécute pas le PHP).
 *
 * Utilisation (depuis le dossier du portfolio) :
 *     php outils/build.php
 */

$racine = dirname(__DIR__);

// Mode « rendu d'une page » : appelé par ce même script pour chaque page
if (($argv[1] ?? '') === '--rendu') {
    define('VERSION_STATIQUE', true);
    chdir($racine);
    if ($argv[2] === 'index') {
        require $racine . '/index.php';
    } else {
        $id = $argv[2];
        require $racine . '/projet.php';
    }
    exit;
}

$sortie = $racine . '/docs';
require $racine . '/data/projets.php';

/** Copie récursive d'un dossier. */
function copier(string $de, string $vers): void
{
    @mkdir($vers, 0777, true);
    foreach (scandir($de) as $f) {
        if ($f === '.' || $f === '..') continue;
        is_dir("$de/$f") ? copier("$de/$f", "$vers/$f") : copy("$de/$f", "$vers/$f");
    }
}

/** Rend une page dans un processus PHP séparé (chaque page redéfinit ses constantes). */
function rendre(string $page): string
{
    $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__FILE__) . ' --rendu ' . escapeshellarg($page);
    return shell_exec($cmd) ?? '';
}

@mkdir($sortie, 0777, true);
copier($racine . '/assets', $sortie . '/assets');

$pages = ['index' => 'index.html'];
foreach (array_keys(PROJETS) as $id) {
    $pages[$id] = 'projet-' . $id . '.html';
}

foreach ($pages as $page => $fichier) {
    $html = rendre($page);
    // les paramètres ?v=... ne servent qu'en PHP
    $html = preg_replace('/(\.(?:css|js))\?v=\d+/', '$1', $html);
    file_put_contents($sortie . '/' . $fichier, $html);
    echo "✓ docs/$fichier\n";
}
file_put_contents($sortie . '/.nojekyll', '');
echo "Version statique prête dans docs/\n";
