# Portfolio — Arranga Evan

Portfolio d'étudiant en 2ᵉ année de BUT Informatique (IUT du Limousin), sur le thème des fenêtres du « Système », du mana et de la magie.

## Structure

```
index.php              Page d'accueil (statut, donjons, compétences, inventaire, journal, contact)
projet.php             Page d'un projet : projet.php?id=motrilem
includes/
  config.php           Infos du site + fonctions (liens, rangs calculés, statistiques)
  composants.php       Composants réutilisés (cercle magique, carte projet, badge de rang…)
  haut.php / bas.php   Début et fin de chaque page
data/
  projets.php          Liste des projets (infos, technos, compétences, AC)
  competences.php      Les 6 compétences du BUT, les AC, l'inventaire des technos
contenus/              Contenu détaillé de chaque projet
assets/
  css/style.css        Thème complet
  js/magie.js          Fond animé : particules de mana, traînée du curseur, explosions
  js/interface.js      Apparitions, notifications, compteurs, menu, portails, easter egg
  js/contact.js        Envoi du formulaire (Formspree)
  img/<projet>/        Images de chaque projet
outils/build.php       Génère la version statique dans docs/
docs/                  Version statique (HTML) pour GitHub Pages
```

## Ajouter un projet

1. Ajouter une entrée dans `data/projets.php` (titre, rang, technos, compétences, AC…).
2. Mettre ses images dans `assets/img/<id>/`.
3. Écrire son contenu dans `contenus/<id>.php`.

Les rangs des compétences, les statistiques et les liens entre AC et projets se mettent à jour tout seuls.

## Lancer en local

```
php -S localhost:8000
```

puis ouvrir http://localhost:8000.

## Mettre en ligne

- **Hébergeur PHP** (serveur de l'IUT, AlwaysData, InfinityFree…) : envoyer le dossier tel quel.
- **GitHub Pages** (pas de PHP) : lancer `php outils/build.php`, committer le dossier `docs/`,
  puis dans *Settings → Pages* choisir la branche `main` et le dossier `/docs`.

## Easter egg

Taper `arise` au clavier sur n'importe quelle page.
