/* ==========================================================================
   interface.js — comportements de l'interface :
   apparitions au défilement, notifications, machine à écrire,
   compteurs, barre de mana, menu mobile, compétences dépliables,
   transition entre les pages et visionneuse d'images.
   ========================================================================== */
(function () {
  "use strict";

  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, racine = document) => racine.querySelector(sel);
  const $$ = (sel, racine = document) => Array.from(racine.querySelectorAll(sel));

  // sessionStorage peut être bloqué (navigation privée stricte) : on protège les accès
  const memoire = {
    lire(cle) { try { return sessionStorage.getItem(cle); } catch (e) { return null; } },
    ecrire(cle, val) { try { sessionStorage.setItem(cle, val); } catch (e) { /* rien */ } },
    effacer(cle) { try { sessionStorage.removeItem(cle); } catch (e) { /* rien */ } },
  };

  // ------------------------------------------------------------------ notifications
  const zoneNotifs = $(".notifications");
  function notifier(texte, type = "", duree = 4200) {
    if (!zoneNotifs) return;
    const n = document.createElement("div");
    n.className = "notif " + type;
    n.innerHTML = '<span class="notif-icone">i</span><div></div>';
    n.querySelector("div").append(document.createTextNode(texte));
    zoneNotifs.append(n);
    while (zoneNotifs.children.length > 3) zoneNotifs.firstElementChild.remove();
    setTimeout(() => {
      n.classList.add("sortie");
      n.addEventListener("animationend", () => n.remove(), { once: true });
    }, duree);
  }
  window.notifier = notifier;

  // ------------------------------------------------------------------ machine à écrire
  function ecrire(el) {
    const texte = el.dataset.ecrire || "";
    if (reduit) { el.textContent = texte; return Promise.resolve(); }
    el.textContent = "";
    el.classList.add("ecriture");
    return new Promise((fini) => {
      let i = 0;
      const id = setInterval(() => {
        el.textContent = texte.slice(0, ++i);
        if (i >= texte.length) {
          clearInterval(id);
          setTimeout(() => { el.classList.remove("ecriture"); fini(); }, 900);
        }
      }, 38);
    });
  }

  // ------------------------------------------------------------------ compteurs
  function compter(el) {
    const cible = parseInt(el.dataset.compteur, 10) || 0;
    const prefixe = el.dataset.prefixe || "";
    if (reduit) { el.textContent = prefixe + cible; return; }
    const debut = performance.now(), duree = 1400;
    (function pas(t) {
      const p = Math.min((t - debut) / duree, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = prefixe + Math.round(cible * ease);
      if (p < 1) requestAnimationFrame(pas);
    })(debut);
  }

  // ------------------------------------------------------------------ glitch
  function glitch(el) {
    if (reduit || !el) return;
    el.classList.remove("glitch");
    void el.offsetWidth; // relance l'animation
    el.classList.add("glitch");
    setTimeout(() => el.classList.remove("glitch"), 400);
  }

  // ------------------------------------------------------------------ apparitions au défilement
  const observateur = new IntersectionObserver((entrees) => {
    for (const entree of entrees) {
      if (!entree.isIntersecting) continue;
      const el = entree.target;
      el.classList.add("visible");
      $$("[data-compteur]", el).forEach(compter);
      if (el.matches("[data-compteur]")) compter(el);
      if (el.classList.contains("titre-section")) glitch($("h2", el));
      observateur.unobserve(el);
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  // petit décalage entre les éléments d'une même grille (effet cascade)
  $$(".apparition").forEach((el) => {
    const freres = el.parentElement ? $$(":scope > .apparition", el.parentElement) : [];
    const rang = freres.indexOf(el);
    if (rang > 0 && freres.length > 1) el.style.transitionDelay = Math.min(rang, 8) * 90 + "ms";
    observateur.observe(el);
  });

  // ------------------------------------------------------------------ barre de mana + lien actif
  const barre = $(".barre-mp-remplie");
  const liens = $$(".menu a[href*='#']");
  const sections = liens
    .map((a) => document.getElementById(a.getAttribute("href").split("#")[1]))
    .filter(Boolean);

  function auDefilement() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    if (barre) barre.style.transform = `scaleX(${p})`;

    if (sections.length && document.body.contains(sections[0])) {
      let courante = null;
      for (const s of sections) if (s.getBoundingClientRect().top < window.innerHeight * 0.4) courante = s;
      liens.forEach((a) => a.classList.toggle("actif", courante && a.getAttribute("href").endsWith("#" + courante.id)));
    }
  }
  let attente = false;
  window.addEventListener("scroll", () => {
    if (attente) return;
    attente = true;
    requestAnimationFrame(() => { auDefilement(); attente = false; });
  }, { passive: true });
  auDefilement();

  // ------------------------------------------------------------------ menu mobile
  const burger = $(".burger"), menu = $("#menu");
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const ouvert = menu.classList.toggle("ouvert");
      burger.setAttribute("aria-expanded", String(ouvert));
    });
    $$("a", menu).forEach((a) => a.addEventListener("click", () => {
      menu.classList.remove("ouvert");
      burger.setAttribute("aria-expanded", "false");
    }));
  }

  // ------------------------------------------------------------------ compétences dépliables
  const couleursElements = { feu: ["blanc", "violet"], foudre: ["blanc", "cyan"], glace: ["cyan", "blanc"], ombre: ["violet", "bleu"] };
  $$(".competence-entete").forEach((bouton) => {
    bouton.addEventListener("click", () => {
      const carte = bouton.closest(".competence");
      const ouverte = carte.classList.toggle("ouverte");
      bouton.setAttribute("aria-expanded", String(ouverte));
      if (ouverte && window.Magie && !reduit) {
        const r = $(".competence-rune", carte).getBoundingClientRect();
        const el = (carte.className.match(/element-(\w+)/) || [])[1];
        window.Magie.explosion(r.left + r.width / 2, r.top + r.height / 2, 22, couleursElements[el] || ["cyan"], 5);
      }
    });
  });

  // ------------------------------------------------------------------ transition entre les pages (mosaïque)
  // Des tuiles sombres recouvrent l'écran en cascade depuis le point du clic,
  // puis se retirent depuis le centre à l'arrivée sur la nouvelle page.
  const transition = $(".page-transition");
  const DUREE_TUILE = 450, ETALEMENT = 380;

  function preparerTuiles(x, y) {
    const taille = window.innerWidth < 600 ? 60 : 90;
    const colonnes = Math.ceil(window.innerWidth / taille);
    const lignes = Math.ceil(window.innerHeight / taille);
    transition.style.setProperty("--colonnes", colonnes);
    transition.textContent = "";
    const l = window.innerWidth / colonnes, h = window.innerHeight / lignes;
    const max = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const fragment = document.createDocumentFragment();
    for (let j = 0; j < lignes; j++) {
      for (let i = 0; i < colonnes; i++) {
        const t = document.createElement("div");
        t.className = "tuile";
        const d = Math.hypot((i + 0.5) * l - x, (j + 0.5) * h - y) / max;
        t.style.setProperty("--delai", Math.round(d * ETALEMENT + Math.random() * 60) + "ms");
        fragment.append(t);
      }
    }
    transition.append(fragment);
  }

  // Arrivée sur la page : l'écran est déjà couvert (classe posée dans le <head>), on découvre
  if (transition && document.documentElement.classList.contains("arrivee")) {
    memoire.effacer("transition");
    preparerTuiles(window.innerWidth / 2, window.innerHeight / 2);
    transition.classList.add("prete", "ouverture");
    setTimeout(() => {
      document.documentElement.classList.remove("arrivee");
      transition.classList.remove("prete", "ouverture");
      transition.textContent = "";
    }, ETALEMENT + DUREE_TUILE + 120);
  }

  $$("[data-portail]").forEach((lien) => {
    lien.addEventListener("click", (e) => {
      if (reduit || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0 || !transition) return;
      e.preventDefault();
      const carte = lien.closest(".portail");
      if (carte) {
        carte.classList.add("choisi");
        carte.parentElement.classList.add("selection");
      }
      preparerTuiles(e.clientX, e.clientY);
      // laisse le temps à la carte de s'avancer avant de recouvrir l'écran
      setTimeout(() => transition.classList.add("fermeture"), carte ? 180 : 0);
      memoire.ecrire("transition", "1");
      setTimeout(() => { window.location.href = lien.href; }, (carte ? 180 : 0) + ETALEMENT + DUREE_TUILE);
    });
  });

  // retour arrière du navigateur : on remet la page dans son état normal
  window.addEventListener("pageshow", (e) => {
    if (!e.persisted || !transition) return;
    transition.className = "page-transition";
    transition.textContent = "";
    document.documentElement.classList.remove("arrivee");
    $$(".selection").forEach((el) => el.classList.remove("selection"));
    $$(".choisi").forEach((el) => el.classList.remove("choisi"));
  });

  // ------------------------------------------------------------------ visionneuse d'images
  const visionneuse = $(".visionneuse");
  if (visionneuse) {
    const img = $("img", visionneuse);
    const fermer = () => { visionneuse.hidden = true; img.src = ""; };
    $$("[data-agrandir]").forEach((el) => {
      el.addEventListener("click", () => {
        img.src = el.currentSrc || el.src;
        img.alt = el.alt;
        img.classList.toggle("pixel", el.classList.contains("pixel"));
        visionneuse.hidden = false;
      });
    });
    visionneuse.addEventListener("click", fermer);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !visionneuse.hidden) fermer(); });
  }

  // ------------------------------------------------------------------ fiches des cartes (page Motrilem)
  // Un clic sur une carte l'agrandit jusqu'au centre de l'écran : sprite en grand + description détaillée.
  (function () {
    const cartes = $$(".carte-fiche");
    if (!cartes.length) return;
    const DUREE = reduit ? 0 : 380;
    let ouverte = null;

    // Agrandit un sprite (image ou planche animée) pour qu'il tienne dans environ hMax × lMax pixels
    function agrandir(el, hMax, lMax) {
      const pixel = el.classList.contains("pixel") || el.classList.contains("sprite-anime");
      let l, h;
      if (el.classList.contains("sprite-anime")) { l = +el.dataset.l; h = +el.dataset.h; }
      else { l = el.naturalWidth || el.width; h = el.naturalHeight || el.height; }
      if (!l || !h) return;
      let k = Math.min(hMax / h, lMax / l, 8);
      if (pixel && k > 1) k = Math.floor(k); // facteur entier : pixels bien nets
      el.style.width = Math.round(l * k) + "px";
      el.style.height = Math.round(h * k) + "px";
      el.removeAttribute("width");
    }

    function ouvrir(carte) {
      if (ouverte) return;
      const detail = $(".carte-detail", carte);
      const depart = carte.getBoundingClientRect();
      const petit = window.innerWidth < 700;

      const fond = document.createElement("div");
      fond.className = "fiche-fond";
      const fiche = document.createElement("div");
      fiche.className = "fiche";
      fiche.setAttribute("role", "dialog");
      fiche.setAttribute("aria-modal", "true");
      fiche.setAttribute("aria-label", $("h3", carte).textContent);
      fiche.innerHTML = '<button class="fiche-fermer" aria-label="Fermer">✕</button><div class="fiche-visuel"></div><div class="fiche-texte"></div>';

      // visuel : copie des sprites de la carte, agrandis
      const visuel = $(".fiche-visuel", fiche);
      const sprites = $$(":scope > img, :scope > .sprite-anime, :scope > .duo-sprites", carte);
      sprites.forEach((sp) => {
        const copie = sp.cloneNode(true);
        visuel.append(copie);
        const cibles = copie.classList.contains("duo-sprites") ? $$("img", copie) : [copie];
        cibles.forEach((c) => agrandir(c, petit ? 170 : (cibles.length > 1 ? 210 : 280), petit ? 260 : (cibles.length > 1 ? 170 : 340)));
      });

      // texte : étiquette, titre, résumé de la carte, puis le détail
      const texte = $(".fiche-texte", fiche);
      const etiquette = document.createElement("span");
      etiquette.className = "fiche-etiquette" + (detail.dataset.etiquette === "Sketch design" ? " sketch" : "");
      etiquette.textContent = detail.dataset.etiquette;
      const titre = document.createElement("h3");
      titre.textContent = $("h3", carte).textContent;
      const resume = $(":scope > p", carte);
      texte.append(etiquette, titre);
      if (resume) { const r = resume.cloneNode(true); r.className = "fiche-resume"; texte.append(r); }
      $$(":scope > *", detail).forEach((n) => texte.append(n.cloneNode(true)));

      document.body.append(fond, fiche);
      document.documentElement.classList.add("fiche-active");

      // FLIP : on part de la place exacte de la carte et on grandit jusqu'à la position finale
      const arrivee = fiche.getBoundingClientRect();
      const depuis = `translate(${depart.left - arrivee.left}px, ${depart.top - arrivee.top}px) scale(${depart.width / arrivee.width}, ${depart.height / arrivee.height})`;
      fiche.style.transformOrigin = "0 0";
      fiche.style.transform = depuis;
      carte.classList.add("carte-source");
      void fiche.offsetWidth;
      fiche.style.transition = `transform ${DUREE}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
      fiche.style.transform = "none";
      fond.classList.add("visible");
      setTimeout(() => fiche.classList.add("contenu-visible"), DUREE * 0.55);

      ouverte = { carte, fond, fiche, depuis };
      fond.addEventListener("click", fermer);
      $(".fiche-fermer", fiche).addEventListener("click", fermer);
      $(".fiche-fermer", fiche).focus({ preventScroll: true });
    }

    function fermer() {
      if (!ouverte) return;
      const { carte, fond, fiche, depuis } = ouverte;
      ouverte = null;
      fiche.classList.remove("contenu-visible");
      fiche.style.transition = `transform ${DUREE * 0.8}ms cubic-bezier(0.6, 0, 0.8, 0.4)`;
      fiche.style.transform = depuis;
      fond.classList.remove("visible");
      setTimeout(() => {
        fiche.remove(); fond.remove();
        carte.classList.remove("carte-source");
        document.documentElement.classList.remove("fiche-active");
        carte.focus({ preventScroll: true });
      }, DUREE * 0.8);
    }

    cartes.forEach((carte) => {
      carte.addEventListener("click", () => ouvrir(carte));
      carte.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ouvrir(carte); }
      });
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") fermer(); });
  })();

  // ------------------------------------------------------------------ inclinaison 3D des portails
  if (!reduit && window.matchMedia("(pointer: fine)").matches) {
    $$(".portail-lien").forEach((carte) => {
      carte.addEventListener("pointermove", (e) => {
        const r = carte.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        carte.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      });
      carte.addEventListener("pointerleave", () => { carte.style.transform = ""; });
    });
  }

  // ------------------------------------------------------------------ easter eggs
  // Taper au clavier (en dehors des champs du formulaire) :
  //   « arise »  -> Domaine du Monarque : tout le site passe au violet (retaper pour en sortir)
  //   « monika » -> Just Monika : boîte de dialogue, et le site passe au vert émeraude (retaper pour en sortir)
  //   Code Konami (↑ ↑ ↓ ↓ ← → ← → B A) -> surcharge de mana
  (function () {
    const racine = document.documentElement;
    const THEMES = ["monarque", "monika"];
    let saisie = "";
    let konami = [];
    const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

    // Thèmes de couleur ----------------------------------------------------
    const voile = document.createElement("div");
    voile.className = "voile-theme";
    voile.setAttribute("aria-hidden", "true");
    document.body.append(voile);
    const themeActuel = () => THEMES.find((t) => racine.classList.contains(t)) || null;
    if (window.Magie) window.Magie.theme(themeActuel());

    /** Active un thème (ou l'enlève s'il est déjà actif). Renvoie true s'il vient d'être activé. */
    function basculerTheme(nom) {
      const actif = themeActuel() !== nom;
      racine.classList.add("theme-transition");
      THEMES.forEach((t) => racine.classList.remove(t));
      if (actif) racine.classList.add(nom);
      if (actif) memoire.ecrire("theme", nom); else memoire.effacer("theme");
      if (window.Magie) window.Magie.theme(actif ? nom : null);
      setTimeout(() => racine.classList.remove("theme-transition"), 1400);
      return actif;
    }

    // Domaine du Monarque -------------------------------------------------
    function domaine() {
      if (window.Archive) window.Archive.debloquer("monarque");
      if (basculerTheme("monarque")) {
        const ecran = document.createElement("div");
        ecran.className = "arise";
        ecran.innerHTML = "<span>ARISE</span>";
        document.body.append(ecran);
        setTimeout(() => ecran.remove(), 2600);
        if (window.Magie && !reduit) window.Magie.ombres();
        notifier("Domaine du Monarque déployé.", "ombre");
      } else {
        notifier("Le domaine se dissipe.");
      }
    }

    // Just Monika ---------------------------------------------------------
    let monikaOuverte = false;
    function monika() {
      if (monikaOuverte) return;
      monikaOuverte = true;
      if (window.Archive) window.Archive.debloquer("monika");
      const logo = $(".logo-texte strong");
      const nomOriginal = logo ? logo.textContent : "";

      racine.classList.add("glitch-monika");
      setTimeout(() => racine.classList.remove("glitch-monika"), 900);
      // le site passe au vert émeraude pendant le glitch
      let vert = false;
      setTimeout(() => { vert = basculerTheme("monika"); }, 450);
      if (logo) setTimeout(() => { if (vert) logo.textContent = "Just Monika"; }, 460);

      const boite = document.createElement("div");
      boite.className = "monika-boite";
      boite.setAttribute("role", "dialog");
      boite.innerHTML = '<span class="monika-nom">Monika</span><p class="monika-texte"></p><span class="monika-suite" aria-hidden="true">▼</span>';
      setTimeout(() => {
        const phrase = vert ? "Just Monika. ♥" : "Tu me quittes déjà ? ♥";
        document.body.append(boite);
        if (window.Magie && !reduit) window.Magie.explosion(window.innerWidth / 2, window.innerHeight - 120, 40, ["rose", "blanc"], 7);
        const texte = $(".monika-texte", boite);
        let i = 0;
        const id = setInterval(() => {
          texte.textContent = phrase.slice(0, ++i);
          if (i >= phrase.length) clearInterval(id);
        }, reduit ? 1 : 80);
      }, 900);

      function fermer() {
        if (!boite.isConnected) return;
        boite.classList.add("sortie");
        setTimeout(() => boite.remove(), 400);
        if (logo) logo.textContent = nomOriginal;
        monikaOuverte = false;
        document.removeEventListener("keydown", surEchap);
      }
      function surEchap(e) { if (e.key === "Escape") fermer(); }
      boite.addEventListener("click", fermer);
      document.addEventListener("keydown", surEchap);
      setTimeout(fermer, 8000);
    }

    // Ignis : explosions de flammes en chaîne (moteur dans assets/js/archive/ignis.js)
    function ignis() {
      if (window.Archive) window.Archive.debloquer("pyromancien");
      if (window.Ignis) window.Ignis.lancer();
    }

    // Surcharge de mana (code Konami) -------------------------------------
    // Un cercle magique apparaît, tourne de plus en plus vite pendant que le mana converge vers lui,
    // puis il explose : onde de choc, tremblement de l'écran et pluie d'étincelles.
    let surchargeEnCours = false;
    function surcharge() {
      if (surchargeEnCours) return;
      if (window.Archive) window.Archive.debloquer("surcharge");
      if (reduit || !window.Magie) { notifier("Surcharge de mana !"); return; }
      surchargeEnCours = true;
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;

      const scene = document.createElement("div");
      scene.className = "surcharge";
      scene.setAttribute("aria-hidden", "true");
      const modele = $(".cercle-magique");
      if (modele) {
        const cercle = modele.cloneNode(true);
        cercle.setAttribute("class", "cercle-magique surcharge-cercle");
        scene.append(cercle);
      }
      const texte = document.createElement("p");
      texte.className = "surcharge-texte";
      texte.innerHTML = "SURCHARGE<br>DE MANA";
      scene.append(texte);
      document.body.append(scene);

      window.Magie.charge(cx, cy, 1300);                       // 0 → 1,3 s : le mana converge
      setTimeout(() => {                                        // 1,4 s : explosion
        scene.classList.add("explosion");
        racine.classList.add("tremblement");
        window.Magie.explosion(cx, cy, 90, ["cyan", "bleu", "blanc"], 16);
        window.Magie.onde(cx, cy, "cyan");
        setTimeout(() => window.Magie.onde(cx, cy, "bleu"), 120);
        setTimeout(() => window.Magie.onde(cx, cy, "blanc"), 240);
        for (let k = 0; k < 6; k++) {
          setTimeout(() => {
            const x = window.innerWidth * (0.1 + Math.random() * 0.8);
            const y = window.innerHeight * (0.15 + Math.random() * 0.7);
            window.Magie.explosion(x, y, 28, ["cyan", "bleu", "blanc"], 7);
          }, 250 + k * 140);
        }
      }, 1400);
      setTimeout(() => racine.classList.remove("tremblement"), 2000);
      setTimeout(() => {
        scene.classList.add("sortie");
        setTimeout(() => { scene.remove(); surchargeEnCours = false; }, 600);
        notifier("Mana infini débloqué.");
      }, 2900);
    }

    document.addEventListener("keydown", (e) => {
      if (e.target instanceof Element && e.target.closest("input, textarea")) return;

      konami = konami.concat(e.key.length === 1 ? e.key.toLowerCase() : e.key).slice(-KONAMI.length);
      if (konami.join() === KONAMI.join()) { konami = []; surcharge(); return; }

      if (e.key.length !== 1) return;
      saisie = (saisie + e.key.toLowerCase()).slice(-6);
      if (saisie.endsWith("arise")) { saisie = ""; domaine(); }
      else if (saisie.endsWith("monika")) { saisie = ""; monika(); }
      else if (saisie.endsWith("ignis")) { saisie = ""; ignis(); }
    });

    window.EasterEggs = { domaine, monika, surcharge, ignis };

    // Un indice pour les curieux qui ouvrent la console
    console.log("%c✦ Ce site cache une Archive. La touche ² ouvre une porte.", "color:#4fd8ff;font-size:14px;font-weight:bold");
  })();

  // ------------------------------------------------------------------ au chargement
  const lignes = $$("[data-ecrire]");
  (async () => {
    for (const l of lignes) await ecrire(l);
  })();

  const titrePrincipal = $(".lueur");
  if (titrePrincipal && !reduit) {
    setTimeout(() => glitch(titrePrincipal), 1200);
    setInterval(() => glitch(titrePrincipal), 6500);
  }

})();
