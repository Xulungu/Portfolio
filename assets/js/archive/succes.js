/* ==========================================================================
   archive/succes.js — le socle de « l'Archive », l'univers caché du portfolio.
   Garde la progression du visiteur (localStorage) : succès débloqués,
   fragments du dossier CLASSIFIED et quelques drapeaux.
   Expose window.Archive, utilisé par tous les autres easter eggs.
   ========================================================================== */
(function () {
  "use strict";

  const CLE = "archive-evan";

  // Liste des succès. « secret: true » : titre caché tant qu'il n'est pas débloqué.
  const SUCCES = [
    { id: "curieux", titre: "Curieux maladif", description: "Ouvrir le terminal secret.", indice: "Certaines touches ne servent à rien… en apparence.", secret: false },
    { id: "inspecteur", titre: "Inspecteur Gadget", description: "Retrouver les trois fragments du dossier CLASSIFIED.", indice: "Trois fragments, trois pages.", secret: false },
    { id: "trop-loin", titre: "Tu es allé beaucoup trop loin", description: "Ouvrir le dossier CLASSIFIED.", indice: "Un dossier attend le bon code.", secret: true },
    { id: "abysses", titre: "Explorateur des abysses", description: "Descendre dans la salle secrète.", indice: "Sous le portfolio, il y a autre chose.", secret: true },
    { id: "lumieres", titre: "Allumeur de lanternes", description: "Rallumer toutes les lanternes de la salle secrète.", indice: "L'obscurité n'est pas une fatalité.", secret: true },
    { id: "cinema", titre: "Absolute Cinema", description: "Déclencher la séquence cinématique.", indice: "Le logo n'aime pas qu'on le lâche trop vite.", secret: false },
    { id: "carotide", titre: "Le sang de la carotide", description: "Survivre au défi de l'âme rouge.", indice: "Quand plus rien ne bouge, quelque chose apparaît.", secret: true },
    { id: "misericorde", titre: "Miséricorde", description: "Épargner l'âme rouge.", indice: "Tout le monde n'a pas besoin de se battre.", secret: true },
    { id: "danmaku", titre: "Survivant du danmaku", description: "Survivre jusqu'au bout du Danmaku Mode.", indice: "Une porte scellée mène à une arène.", secret: true },
    { id: "monarque", titre: "Domaine du Monarque", description: "Taper « arise ».", indice: "Les ombres répondent à un seul mot.", secret: true },
    { id: "monika", titre: "Just Monika", description: "Taper « monika ».", indice: "Un nom, et tout devient vert.", secret: true },
    { id: "pyromancien", titre: "Pyromancien", description: "Taper « ignis ».", indice: "Un mot ancien qui veut dire « feu ».", secret: true },
    { id: "surcharge", titre: "Mana infini", description: "Entrer le code Konami.", indice: "↑ ↑ …", secret: true },
    { id: "sudo", titre: "Permission refusée", description: "Essayer « sudo » dans le terminal.", indice: "Tu n'es pas root ici.", secret: true },
    { id: "archiviste", titre: "L'Archive complète", description: "Débloquer tous les autres succès.", indice: "Tout découvrir.", secret: false },
  ];

  // ------------------------------------------------------------------ sauvegarde
  function charger() {
    try {
      const d = JSON.parse(localStorage.getItem(CLE) || "{}");
      return { succes: d.succes || {}, fragments: d.fragments || [], drapeaux: d.drapeaux || {} };
    } catch (e) {
      return { succes: {}, fragments: [], drapeaux: {} };
    }
  }
  let etat = charger();
  // On n'écrit dans le navigateur que si le visiteur a accepté (sinon la partie reste en mémoire)
  const sauvegardeAutorisee = () => !window.Consentement || window.Consentement.accepte();
  function sauver() {
    if (!sauvegardeAutorisee()) return;
    try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) { /* stockage indisponible : la partie reste en mémoire */ }
  }
  // Le visiteur accepte en cours de visite : on enregistre ce qu'il a déjà découvert
  document.addEventListener("consentement", (e) => { if (e.detail === "oui") sauver(); });

  // ------------------------------------------------------------------ chemins (version PHP ou statique)
  const statique = document.documentElement.dataset.statique === "1";
  function lien(page) {
    const pages = statique
      ? { accueil: "index.html", salle: "salle.html", danmaku: "danmaku.html", motrilem: "projet-motrilem.html", latice: "projet-latice.html" }
      : { accueil: "index.php", salle: "salle.php", danmaku: "danmaku.php", motrilem: "projet.php?id=motrilem", latice: "projet.php?id=latice" };
    return pages[page] || pages.accueil;
  }

  // ------------------------------------------------------------------ annonce d'un succès
  let file = [];
  let annonceEnCours = false;
  function annoncer(s) {
    file.push(s);
    if (!annonceEnCours) suivante();
  }
  function suivante() {
    const s = file.shift();
    if (!s) { annonceEnCours = false; return; }
    annonceEnCours = true;
    const el = document.createElement("div");
    el.className = "succes-toast";
    el.setAttribute("role", "status");
    el.innerHTML = '<span class="succes-icone" aria-hidden="true">✦</span><div><small>Succès débloqué</small><strong></strong><p></p></div>';
    el.querySelector("strong").textContent = s.titre;
    el.querySelector("p").textContent = s.description;
    document.body.append(el);
    setTimeout(() => {
      el.classList.add("sortie");
      setTimeout(() => { el.remove(); suivante(); }, 450);
    }, 3800);
  }

  // ------------------------------------------------------------------ API
  function debloquer(id) {
    const s = SUCCES.find((x) => x.id === id);
    if (!s || etat.succes[id]) return false;
    etat.succes[id] = Date.now();
    sauver();
    annoncer(s);
    majCompteur();
    // tout le reste débloqué -> succès final
    if (id !== "archiviste" && SUCCES.every((x) => x.id === "archiviste" || etat.succes[x.id])) {
      setTimeout(() => debloquer("archiviste"), 600);
    }
    return true;
  }
  const aDebloque = (id) => Boolean(etat.succes[id]);

  // Fragments du dossier CLASSIFIED (1, 2, 3)
  const MOTS = { 1: "MANA", 2: "OMBRE", 3: "ABYSSE" };
  function trouverFragment(n) {
    const nouveau = !etat.fragments.includes(n);
    if (nouveau) { etat.fragments.push(n); etat.fragments.sort(); sauver(); }
    afficherFragment(n, nouveau);
    if (etat.fragments.length === 3) debloquer("inspecteur");
    return nouveau;
  }
  function afficherFragment(n, nouveau) {
    const el = document.createElement("div");
    el.className = "fragment-toast";
    el.innerHTML = '<span class="fragment-tampon">CLASSIFIED</span><small></small><strong></strong><p></p>';
    el.querySelector("small").textContent = "Fragment " + ["I", "II", "III"][n - 1] + " / III";
    el.querySelector("strong").textContent = "« " + MOTS[n] + " »";
    el.querySelector("p").textContent = etat.fragments.length === 3
      ? "Les trois fragments sont réunis. Le terminal attend un code."
      : (nouveau ? "Fragment ajouté au dossier. " : "Déjà dans le dossier. ") + etat.fragments.length + " / 3";
    document.body.append(el);
    el.addEventListener("click", () => el.remove());
    setTimeout(() => { el.classList.add("sortie"); setTimeout(() => el.remove(), 450); }, 5000);
  }

  function drapeau(nom, valeur) {
    if (valeur === undefined) return etat.drapeaux[nom];
    etat.drapeaux[nom] = valeur;
    sauver();
  }

  // ------------------------------------------------------------------ fenêtre des succès
  function ouvrirSucces() {
    if (document.querySelector(".succes-fenetre")) return;
    const total = SUCCES.length;
    const obtenus = SUCCES.filter((s) => etat.succes[s.id]).length;
    const fond = document.createElement("div");
    fond.className = "succes-fond";
    const fen = document.createElement("div");
    fen.className = "succes-fenetre";
    fen.setAttribute("role", "dialog");
    fen.setAttribute("aria-modal", "true");
    fen.setAttribute("aria-label", "Succès");
    fen.innerHTML =
      '<button class="succes-fermer" aria-label="Fermer">✕</button>' +
      '<p class="succes-surtitre">L\'Archive</p>' +
      '<h2>Succès</h2>' +
      '<div class="succes-progression"><div><i style="width:' + Math.round((obtenus / total) * 100) + '%"></i></div><span>' + obtenus + " / " + total + "</span></div>" +
      '<ul class="succes-liste"></ul>' +
      '<p class="succes-note">Fragments du dossier : ' + etat.fragments.length + ' / 3</p>' +
      (sauvegardeAutorisee() ? "" : '<p class="succes-note-sauvegarde">Sauvegarde désactivée : ta progression sera perdue en quittant le site.<button type="button" class="activer-sauvegarde">Activer la sauvegarde</button></p>');
    const liste = fen.querySelector(".succes-liste");
    SUCCES.forEach((s) => {
      const li = document.createElement("li");
      const ok = Boolean(etat.succes[s.id]);
      li.className = ok ? "obtenu" : "verrouille";
      const titre = ok || !s.secret ? s.titre : "???";
      const texte = ok ? s.description : s.indice;
      li.innerHTML = '<span class="succes-icone" aria-hidden="true">' + (ok ? "✦" : "?") + '</span><div><strong></strong><p></p>' + (ok ? "<small></small>" : "") + "</div>";
      li.querySelector("strong").textContent = titre;
      li.querySelector("p").textContent = texte;
      if (ok) li.querySelector("small").textContent = "Obtenu le " + new Date(etat.succes[s.id]).toLocaleDateString("fr-FR");
      liste.append(li);
    });
    document.body.append(fond, fen);
    const fermer = () => { fond.remove(); fen.remove(); document.removeEventListener("keydown", echap); };
    const echap = (e) => { if (e.key === "Escape") fermer(); };
    fond.addEventListener("click", fermer);
    fen.querySelector(".succes-fermer").addEventListener("click", fermer);
    const activer = fen.querySelector(".activer-sauvegarde");
    if (activer) activer.addEventListener("click", () => { fermer(); if (window.Consentement) window.Consentement.ouvrirPanneau(); });
    document.addEventListener("keydown", echap);
    fen.querySelector(".succes-fermer").focus({ preventScroll: true });
  }

  // Compteur discret dans le pied de page (visible dès le premier succès)
  function majCompteur() {
    const b = document.querySelector(".archive-compteur");
    if (!b) return;
    const n = SUCCES.filter((s) => etat.succes[s.id]).length;
    b.hidden = n === 0;
    b.querySelector("span").textContent = n + " / " + SUCCES.length;
  }
  document.addEventListener("DOMContentLoaded", () => {
    majCompteur();
    const b = document.querySelector(".archive-compteur");
    if (b) b.addEventListener("click", ouvrirSucces);
  });

  window.Archive = {
    debloquer, aDebloque, trouverFragment, drapeau, ouvrirSucces, lien,
    fragments: () => etat.fragments.slice(),
    mots: MOTS,
    succes: () => SUCCES.map((s) => ({ ...s, obtenu: Boolean(etat.succes[s.id]) })),
    reinitialiser() { etat = { succes: {}, fragments: [], drapeaux: {} }; sauver(); majCompteur(); },
  };
})();
