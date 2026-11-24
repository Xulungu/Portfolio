/* ==========================================================================
   interface.js — comportements de l'interface :
   apparitions au défilement, notifications du Système, machine à écrire,
   compteurs, barre de mana, menu mobile, compétences dépliables,
   transition de portail, visionneuse d'images et easter egg « arise ».
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

  // ------------------------------------------------------------------ notifications du Système
  const zoneNotifs = $(".notifications");
  function notifier(texte, type = "", duree = 4200) {
    if (!zoneNotifs) return;
    const n = document.createElement("div");
    n.className = "notif " + type;
    n.innerHTML = '<span class="notif-icone">!</span><div><small>SYSTÈME</small></div>';
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

  // ------------------------------------------------------------------ notifications par section
  const sectionsVues = new Set();
  const observateurSections = new IntersectionObserver((entrees) => {
    for (const entree of entrees) {
      const s = entree.target;
      if (entree.isIntersecting && !sectionsVues.has(s.id)) {
        sectionsVues.add(s.id);
        notifier(s.dataset.notification);
      }
    }
  }, { threshold: 0.25 });
  $$("[data-notification]").forEach((s) => observateurSections.observe(s));

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

  // ------------------------------------------------------------------ transition de portail
  const transition = $(".portail-transition");
  if (transition && memoire.lire("portail")) {
    memoire.effacer("portail");
    transition.classList.add("arrivee");
    setTimeout(() => transition.classList.remove("arrivee"), 800);
  }
  $$("[data-portail]").forEach((lien) => {
    lien.addEventListener("click", (e) => {
      if (reduit || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0 || !transition) return;
      e.preventDefault();
      const cercle = $(".portail-cercle", transition);
      transition.style.placeItems = "start";
      cercle.style.marginLeft = e.clientX - 20 + "px";
      cercle.style.marginTop = e.clientY - 20 + "px";
      transition.classList.add("actif");
      if (window.Magie) window.Magie.explosion(e.clientX, e.clientY, 40, ["cyan", "violet", "blanc"], 9);
      memoire.ecrire("portail", "1");
      setTimeout(() => { window.location.href = lien.href; }, 650);
    });
  });
  // retour arrière du navigateur : on enlève l'écran de transition resté affiché
  window.addEventListener("pageshow", (e) => { if (e.persisted && transition) transition.classList.remove("actif"); });

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

  // ------------------------------------------------------------------ easter egg : « arise »
  let saisie = "";
  document.addEventListener("keydown", (e) => {
    if (e.target instanceof Element && e.target.closest("input, textarea")) return;
    if (e.key.length !== 1) return;
    saisie = (saisie + e.key.toLowerCase()).slice(-5);
    if (saisie !== "arise") return;
    saisie = "";
    const ecran = document.createElement("div");
    ecran.className = "arise";
    ecran.innerHTML = "<span>ARISE</span>";
    document.body.append(ecran);
    if (window.Magie) window.Magie.arise();
    notifier("Les ombres répondent à votre appel.", "ombre");
    setTimeout(() => ecran.remove(), 3300);
  });

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

  if ($(".eveil") && !memoire.lire("bienvenue")) {
    memoire.ecrire("bienvenue", "1");
    setTimeout(() => notifier("Bienvenue, Joueur. Votre exploration commence."), 1800);
  }
})();
