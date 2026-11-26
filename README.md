# Portfolio — Arranga Evan

Portfolio d'étudiant en 2ᵉ année de BUT Informatique (IUT du Limousin), avec une interface sombre et des effets de particules de mana.

## Structure

```
index.php              Page d'accueil (profil, projets, compétences, technologies, à propos, contact)
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
  js/interface.js      Apparitions, notifications, compteurs, menu, transitions, visionneuse
  js/contact.js        Envoi du formulaire (Formspree)
  img/<projet>/        Images de chaque projet
salle.php              Salle secrète (accessible depuis le terminal)
danmaku.php            Mini-jeu Danmaku Mode (indépendant)
assets/js/archive/     L'Archive : succès, terminal secret, secrets cachés dans les pages
outils/build.php       Génère la version statique dans docs/
docs/                  Version statique (HTML) pour GitHub Pages
```

## Ajouter un projet

1. Ajouter une entrée dans `data/projets.php` (titre, technos, compétences, AC…).
2. Mettre ses images dans `assets/img/<id>/`.
3. Écrire son contenu dans `contenus/<id>.php`.

Le nombre de preuves par compétence, les statistiques et les liens entre AC et projets se mettent à jour tout seuls.

## Lancer en local

```
php -S localhost:8000
```

puis ouvrir http://localhost:8000.

## Mettre en ligne

- **Hébergeur PHP** (serveur de l'IUT, AlwaysData, InfinityFree…) : envoyer le dossier tel quel.
- **GitHub Pages** (pas de PHP) : lancer `php outils/build.php`, committer le dossier `docs/`,
  puis dans *Settings → Pages* choisir la branche `main` et le dossier `/docs`.


## L'Archive (easter eggs)

Le site cache un petit univers secret. Pour le tester ou le modifier :

- `assets/js/archive/succes.js` : liste des succès et sauvegarde (localStorage).
- `assets/js/archive/terminal.js` : commandes du terminal (touche `²`), textes de `whoami` et `games`, dossier CLASSIFIED.
- `assets/js/archive/secrets.js` : fragments cachés, Absolute Cinema, âme rouge.
- `danmaku.php?entrainement` : Danmaku avec vies infinies (sans succès).
- Dans la console du navigateur, `Archive.reinitialiser()` remet la progression à zéro.
