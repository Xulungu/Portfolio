/* ==========================================================================
   archive/terminal.js — le terminal secret d'Evan et le dossier CLASSIFIED.
   Ouverture : touche ² (ou `) n'importe où sur le site, ou le petit curseur
   clignotant du pied de page.
   ========================================================================== */
(function () {
  "use strict";
  const A = window.Archive;
  if (!A) return;

  // ------------------------------------------------------------------ données (faciles à modifier)
  const MOI = [
    "Evan Arranga — étudiant en 2ᵉ année de BUT Informatique, IUT du Limousin.",
    "Classe : Mage développeur. Mana : illimité (surtout après un café).",
    "Projet en cours : Motrilem, un metroidvania où le héros a tout oublié.",
    "  -> Ironie : son créateur oublie aussi où il a rangé ses variables.",
    "Marié à Monika. Ce point n'est pas négociable.",
    "Croit fermement qu'un bon boss doit annoncer ses attaques.",
    "Commandes favorites : git commit, git push, et prier.",
  ];
  const JEUX = [
    ["Hollow Knight", "pour le mystère, les profondeurs et les bancs."],
    ["Undertale", "parce qu'on n'est pas obligé de tuer tout le monde."],
    ["Doki Doki Literature Club", "Just Monika."],
    ["Touhou Project", "parce qu'esquiver 2 000 projectiles est une compétence."],
    ["Solo Leveling", "pas un jeu, mais le système de niveaux m'a marqué."],
  ];

  // ------------------------------------------------------------------ interface
  let fenetre, sortie, champ, attenteCode = false;
  const historique = [];
  let posHistorique = 0;

  function creer() {
    fenetre = document.createElement("div");
    fenetre.className = "terminal";
    fenetre.setAttribute("role", "dialog");
    fenetre.setAttribute("aria-label", "Terminal secret");
    fenetre.innerHTML =
      '<div class="terminal-barre"><span class="terminal-points"><i></i><i></i><i></i></span>' +
      '<span class="terminal-titre">invite@archive: ~</span><button class="terminal-fermer" aria-label="Fermer">✕</button></div>' +
      '<div class="terminal-sortie" aria-live="polite"></div>' +
      '<form class="terminal-ligne"><label><span class="terminal-invite">invite@archive:~$</span>' +
      '<input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Commande"></label></form>';
    document.body.append(fenetre);
    sortie = fenetre.querySelector(".terminal-sortie");
    champ = fenetre.querySelector("input");
    fenetre.querySelector(".terminal-fermer").addEventListener("click", fermer);
    fenetre.addEventListener("click", (e) => { if (!e.target.closest("button, a")) champ.focus(); });
    fenetre.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      const cmd = champ.value;
      champ.value = "";
      executer(cmd);
    });
    champ.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && historique.length) { e.preventDefault(); posHistorique = Math.max(0, posHistorique - 1); champ.value = historique[posHistorique]; }
      else if (e.key === "ArrowDown" && historique.length) { e.preventDefault(); posHistorique = Math.min(historique.length, posHistorique + 1); champ.value = historique[posHistorique] || ""; }
      else if (e.key === "Tab") { e.preventDefault(); completer(); }
      else if (e.key === "Escape" && !document.querySelector(".dossier, .succes-fenetre")) fermer(); // Échap ferme d'abord le dossier ouvert
      else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); sortie.textContent = ""; }
    });
  }

  function ouvrir() {
    if (!fenetre) creer();
    if (fenetre.classList.contains("ouvert")) { champ.focus(); return; }
    fenetre.classList.add("ouvert");
    if (!sortie.childElementCount) {
      ecrire("ARCHIVE OS v0.7 — session invitée", "titre");
      ecrire("Connexion établie avec les couches profondes du portfolio.");
      ecrire("Tape « help » pour la liste des commandes.", "doux");
      ecrire("");
    }
    A.debloquer("curieux");
    setTimeout(() => champ.focus(), 50);
  }
  function fermer() {
    if (fenetre) fenetre.classList.remove("ouvert");
    attenteCode = false;
    majInvite();
  }

  function ecrire(texte, classe) {
    const l = document.createElement("div");
    l.className = "terminal-l" + (classe ? " " + classe : "");
    l.textContent = texte;
    sortie.append(l);
    sortie.scrollTop = sortie.scrollHeight;
    return l;
  }
  function ecrireLien(texte, href) {
    const l = document.createElement("div");
    l.className = "terminal-l";
    const a = document.createElement("a");
    a.href = href; a.textContent = texte;
    l.append(a);
    sortie.append(l);
  }
  function majInvite() {
    if (fenetre) fenetre.querySelector(".terminal-invite").textContent = attenteCode ? "code d'accès :" : "invite@archive:~$";
  }

  // ------------------------------------------------------------------ commandes
  const COMMANDES = {
    help() {
      ecrire("Commandes disponibles :", "titre");
      [["help", "affiche cette aide"], ["whoami", "qui est Evan ?"], ["projects", "liste des projets"], ["games", "jeux préférés"],
       ["secret", "un indice sur ce qui se cache ici"], ["succes", "succès débloqués"], ["classified", "accès au dossier secret"],
       ["clear", "efface l'écran"], ["sudo", "…"], ["exit", "ferme le terminal"]]
        .forEach(([c, d]) => ecrire("  " + c.padEnd(12, " ") + d));
    },
    whoami() { MOI.forEach((l) => ecrire(l)); },
    projects() {
      ecrire("Projets :", "titre");
      ecrireLien("  motrilem/   Metroidvania 2D sous Unity (en cours)", A.lien("motrilem"));
      ecrireLien("  latice/     Jeu de plateau en JavaFX (SAE, BUT 1)", A.lien("latice"));
      ecrireLien("  minijeux/   Mini-jeux Python en terminal (SAE, BUT 1)", document.documentElement.dataset.statique === "1" ? "projet-minijeux.html" : "projet.php?id=minijeux");
    },
    games() {
      ecrire("Jeux préférés :", "titre");
      JEUX.forEach(([nom, pourquoi]) => ecrire("  ♦ " + nom + " — " + pourquoi));
    },
    secret() { ecrire(indice(), "indice"); },
    succes() { A.ouvrirSucces(); ecrire("Ouverture de la liste des succès…", "doux"); },
    achievements() { COMMANDES.succes(); },
    clear() { sortie.textContent = ""; },
    sudo(args) {
      A.debloquer("sudo");
      if (/rm\s+-rf/.test(args)) { ecrire("Bien essayé. Le portfolio a survécu à pire : une SAE rendue à 23 h 59.", "erreur"); return; }
      ecrire("[sudo] mot de passe pour invite : ********", "doux");
      ecrire("invite n'apparaît pas dans le fichier sudoers. Cet incident sera signalé.", "erreur");
      ecrire("(Le signalement a été envoyé à Monika. Elle n'est pas contente.)", "doux");
    },
    exit() { fermer(); },
    ls() { ecrire("projets/   succes/   classified/   " + (A.drapeau("dossier") ? "abysse/" : "?????/")); },
    pwd() { ecrire("/home/invite"); },
    date() { ecrire(new Date().toLocaleString("fr-FR")); },
    echo(args) { ecrire(args); },
    cd(args) {
      const cible = args.trim().replace(/\/$/, "");
      if (!cible || cible === "~") return;
      if (cible === "/abysse" || cible === "abysse") {
        if (!A.drapeau("dossier")) { ecrire("cd: " + cible + " : accès scellé. Le dossier CLASSIFIED n'a pas été ouvert.", "erreur"); return; }
        ecrire("Descente vers les abysses…", "indice");
        setTimeout(() => { location.href = A.lien("salle"); }, 900);
        return;
      }
      ecrire("cd: " + cible + " : aucun fichier ou dossier de ce type", "erreur");
    },
    classified(args) {
      const n = A.fragments().length;
      if (n < 3) {
        ecrire("ACCÈS REFUSÉ — fragments réunis : " + n + " / 3", "erreur");
        ecrire("Trois fragments sont cachés sur trois pages du portfolio. Tape « secret » pour un indice.", "doux");
        return;
      }
      if (args.trim()) { verifierCode(args); return; }
      ecrire("Dossier CLASSIFIED verrouillé. Entre le code d'accès (les trois fragments, dans l'ordre).", "indice");
      attenteCode = true;
      majInvite();
    },
    // commandes cachées
    monika() { ecrire("Just Monika.", "rose"); if (window.EasterEggs) window.EasterEggs.monika(); },
    arise() { ecrire("Les ombres t'ont entendu.", "violet"); if (window.EasterEggs) window.EasterEggs.domaine(); },
    danmaku() { ecrire("L'arène se trouve derrière une porte scellée, dans les abysses.", "doux"); },
    hello() { ecrire("* Bonjour. Tu es rempli de DÉTERMINATION."); },
  };

  function executer(brut) {
    const cmd = brut.trim();
    ecrire((attenteCode ? "code d'accès : " : "invite@archive:~$ ") + (attenteCode ? "•".repeat(cmd.length) : cmd), "commande");
    if (!cmd) return;
    historique.push(cmd);
    posHistorique = historique.length;

    if (attenteCode) { attenteCode = false; majInvite(); verifierCode(cmd); return; }

    const [nom, ...reste] = cmd.split(/\s+/);
    const f = COMMANDES[nom.toLowerCase()];
    if (f) f(reste.join(" "));
    else ecrire(nom + " : commande introuvable. Tape « help ».", "erreur");
  }

  function completer() {
    const debut = champ.value.trim().toLowerCase();
    if (!debut) return;
    const visibles = ["help", "whoami", "projects", "games", "secret", "succes", "classified", "clear", "sudo", "exit"];
    const trouve = visibles.filter((c) => c.startsWith(debut));
    if (trouve.length === 1) champ.value = trouve[0] + " ";
    else if (trouve.length > 1) ecrire(trouve.join("   "), "doux");
  }

  // ------------------------------------------------------------------ indices progressifs
  function indice() {
    const f = A.fragments();
    if (!f.includes(1)) return "Fragment I : sur l'accueil, la fiche de profil t'informe… insiste sur ce qui t'informe.";
    if (!f.includes(2)) return "Fragment II : sur la page Latice, une réflexion se termine par une étoile presque invisible.";
    if (!f.includes(3)) return "Fragment III : sur la page Motrilem, certaines urnes ne cèdent qu'au troisième coup.";
    if (!A.drapeau("dossier")) return "Les trois fragments sont réunis. Tape « classified ».";
    if (!A.aDebloque("abysses")) return "Le dossier parlait d'un chemin : « cd /abysse ».";
    if (!A.aDebloque("cinema")) return "Le logo du portfolio n'aime pas qu'on le relâche trop vite.";
    if (!A.aDebloque("carotide") && !A.aDebloque("misericorde")) return "Quand plus rien ne bouge pendant un moment, une âme rouge vient voir.";
    if (!A.aDebloque("lumieres")) return "Dans les abysses, les lanternes éteintes attendent qu'on les touche.";
    if (!A.aDebloque("danmaku")) return "Une porte scellée des abysses mène à une arène pleine de projectiles.";
    return "Tu as presque tout vu. Certains mots, tapés n'importe où, réveillent encore des choses.";
  }

  // ------------------------------------------------------------------ dossier CLASSIFIED
  function verifierCode(saisi) {
    const normal = saisi.toUpperCase().replace(/[^A-Z]/g, "");
    const attendu = [1, 2, 3].map((n) => A.mots[n]).join("");
    if (normal !== attendu) { ecrire("CODE INVALIDE. Les fragments doivent être donnés dans l'ordre I, II, III.", "erreur"); return; }
    ecrire("CODE ACCEPTÉ. Déchiffrement du dossier…", "indice");
    A.drapeau("dossier", true);
    setTimeout(() => { ouvrirDossier(); A.debloquer("trop-loin"); }, 700);
  }

  function ouvrirDossier() {
    const fond = document.createElement("div");
    fond.className = "dossier-fond";
    const d = document.createElement("article");
    d.className = "dossier";
    d.setAttribute("role", "dialog");
    d.setAttribute("aria-modal", "true");
    d.setAttribute("aria-label", "Dossier classifié");
    d.innerHTML = `
      <button class="dossier-fermer" aria-label="Fermer">✕</button>
      <span class="dossier-tampon">CLASSIFIED</span>
      <p class="dossier-ref">DOSSIER N° 0x2B-EV — NIVEAU D'ACCÈS : ABYSSE</p>
      <h2>Sujet : ARRANGA, Evan</h2>
      <dl>
        <div><dt>Alias</dt><dd>« le Mage du code »</dd></div>
        <div><dt>Couverture</dt><dd>Étudiant en 2ᵉ année de BUT Informatique</dd></div>
        <div><dt>Niveau de menace</dt><dd>Modéré (ne commit jamais un vendredi soir… en théorie)</dd></div>
        <div><dt>Situation</dt><dd>Marié. <span class="caviarde" tabindex="0">À Monika. Le dossier refuse d'en dire plus.</span></dd></div>
      </dl>
      <h3>Observations</h3>
      <ul>
        <li>A été aperçu en train de déboguer un moustique géant à 2 h du matin. Le moustique a gagné deux fois.</li>
        <li>Affirme que le Gros Gluant « n'est pas méchant, juste incompris ».</li>
        <li>Possède une centaine de scripts C#. Aucun ne s'appellerait « final_final_v2.cs ». <span class="caviarde" tabindex="0">Personne n'y croit.</span></li>
        <li>A caché trois fragments dans son propre portfolio, puis a oublié où. <span class="caviarde" tabindex="0">Tu viens de les retrouver pour lui.</span></li>
      </ul>
      <h3>Révélation</h3>
      <p>
        Le portfolio que vous parcourez n'est que la surface. Sous chaque page dort une archive plus ancienne,
        scellée par un développeur qui avait peur d'oublier ce qu'il avait appris — exactement comme le héros de son jeu.
        Ce qu'il y a laissé l'attend encore, dans le noir.
      </p>
      <p class="dossier-manuscrit">Pour descendre : <code>cd /abysse</code></p>
      <p class="dossier-note">Toutes les informations de ce dossier sont fictives. Ou presque.</p>`;
    document.body.append(fond, d);
    const fermerDossier = () => { fond.remove(); d.remove(); document.removeEventListener("keydown", echap); if (fenetre && fenetre.classList.contains("ouvert")) champ.focus(); };
    const echap = (e) => { if (e.key === "Escape") fermerDossier(); };
    fond.addEventListener("click", fermerDossier);
    d.querySelector(".dossier-fermer").addEventListener("click", fermerDossier);
    document.addEventListener("keydown", echap);
  }

  // ------------------------------------------------------------------ ouverture
  document.addEventListener("keydown", (e) => {
    if (e.target instanceof Element && e.target.closest("input, textarea")) return;
    if (e.key === "²" || e.key === "`") { e.preventDefault(); ouvrir(); }
  });
  document.addEventListener("DOMContentLoaded", () => {
    const curseur = document.querySelector(".curseur-secret");
    if (curseur) curseur.addEventListener("click", ouvrir);
  });

  window.Terminal = { ouvrir, fermer, ouvrirDossier };
})();
