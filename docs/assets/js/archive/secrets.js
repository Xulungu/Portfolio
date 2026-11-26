/* ==========================================================================
   archive/secrets.js — les secrets éparpillés dans les pages :
   - fragments du dossier CLASSIFIED (accueil, Latice, Motrilem) ;
   - Absolute Cinema (maintenir le logo appuyé) ;
   - l'âme rouge (apparaît après un moment d'inactivité).
   ========================================================================== */
(function () {
  "use strict";
  const A = window.Archive;
  if (!A) return;
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);

  document.addEventListener("DOMContentLoaded", () => {
    fragments();
    cinemaLogo();
    ameRouge();
  });

  // ================================================================== fragments
  function fragments() {
    // I — accueil : cliquer 3 fois sur le « i » de la fiche de profil
    const info = $(".statut .fenetre-titre span");
    if (info) {
      let clics = [], t;
      info.addEventListener("click", () => {
        const maintenant = Date.now();
        clics = clics.filter((x) => maintenant - x < 1500).concat(maintenant);
        info.classList.remove("pulse-secret"); void info.offsetWidth; info.classList.add("pulse-secret");
        if (clics.length >= 3) { clics = []; A.trouverFragment(1); }
        clearTimeout(t);
      });
    }

    // II — page Latice : l'étoile presque invisible
    document.querySelectorAll(".fragment-cache[data-fragment]").forEach((b) => {
      b.addEventListener("click", () => A.trouverFragment(+b.dataset.fragment));
    });

    // III — page Motrilem : frapper trois fois l'urne dans sa fiche
    let coups = 0;
    document.addEventListener("click", (e) => {
      const img = e.target.closest(".fiche-visuel img");
      if (!img || !/urne/.test(img.getAttribute("src") || "")) return;
      coups++;
      img.classList.remove("urne-coup"); void img.offsetWidth; img.classList.add("urne-coup");
      if (coups >= 3) {
        coups = 0;
        img.classList.add("urne-cassee");
        if (window.Magie) {
          const r = img.getBoundingClientRect();
          window.Magie.explosion(r.left + r.width / 2, r.top + r.height / 2, 24, ["blanc", "cyan"], 5);
        }
        setTimeout(() => A.trouverFragment(3), 350);
      }
    });
  }

  // ================================================================== Absolute Cinema
  function cinemaLogo() {
    const logo = $(".logo");
    if (!logo) return;
    let minuteur = null, declenche = false;
    const annuler = () => { clearTimeout(minuteur); logo.classList.remove("logo-charge"); };
    logo.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      declenche = false;
      logo.classList.add("logo-charge");
      minuteur = setTimeout(() => { declenche = true; logo.classList.remove("logo-charge"); cinema(); }, 1300);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => logo.addEventListener(ev, annuler));
    logo.addEventListener("click", (e) => { if (declenche) { e.preventDefault(); declenche = false; } });
    logo.addEventListener("contextmenu", (e) => { if (logo.classList.contains("logo-charge") || declenche) e.preventDefault(); });
  }

  let cinemaEnCours = false;
  function cinema() {
    if (cinemaEnCours) return;
    cinemaEnCours = true;
    const scene = document.createElement("div");
    scene.className = "cinema" + (reduit ? " cinema-sobre" : "");
    scene.setAttribute("aria-hidden", "true");
    scene.innerHTML =
      '<div class="cinema-voile"></div><div class="cinema-projecteur"></div><div class="cinema-grain"></div>' +
      '<div class="cinema-bande haut"></div><div class="cinema-bande bas"></div>' +
      '<p class="cinema-titre"><span>ABSOLUTE</span><span>CINEMA</span></p>';
    document.body.append(scene);
    son();
    A.debloquer("cinema");
    setTimeout(() => scene.classList.add("fin"), 4200);
    setTimeout(() => { scene.remove(); cinemaEnCours = false; }, 5200);
  }

  // Petit effet sonore synthétisé (aucun fichier) : impact grave + accord qui monte
  function son() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ac = new Ctx();
      const t = ac.currentTime;
      const sortie = ac.createGain();
      sortie.gain.value = 0.18;
      sortie.connect(ac.destination);

      const boum = ac.createOscillator(), gB = ac.createGain();
      boum.type = "sine";
      boum.frequency.setValueAtTime(90, t);
      boum.frequency.exponentialRampToValueAtTime(35, t + 1.2);
      gB.gain.setValueAtTime(1, t);
      gB.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
      boum.connect(gB).connect(sortie);
      boum.start(t); boum.stop(t + 1.7);

      const filtre = ac.createBiquadFilter();
      filtre.type = "lowpass";
      filtre.frequency.setValueAtTime(300, t + 0.3);
      filtre.frequency.linearRampToValueAtTime(2200, t + 2.2);
      filtre.connect(sortie);
      [110, 164.8, 220, 261.6].forEach((f) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = "sawtooth";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + 0.3);
        g.gain.exponentialRampToValueAtTime(0.12, t + 1.4);
        g.gain.setValueAtTime(0.12, t + 3.2);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 4.6);
        o.connect(g).connect(filtre);
        o.start(t + 0.3); o.stop(t + 4.7);
      });
      setTimeout(() => ac.close(), 5000);
    } catch (e) { /* son indisponible : tant pis, l'image suffit */ }
  }

  // ================================================================== l'âme rouge
  const INACTIVITE = 40000; // ms sans bouger avant l'apparition
  function ameRouge() {
    if (document.body.classList.contains("page-danmaku")) return;
    let minuteur = null, ame = null, depart = null, combat = null;

    const COEUR = '<svg viewBox="0 0 16 14" aria-hidden="true"><path d="M2 0h4v2h4V0h4v2h2v6h-2v2h-2v2h-2v2H6v-2H4v-2H2V8H0V2h2z"/></svg>';

    function relancer() {
      clearTimeout(minuteur);
      if (combat) return;
      minuteur = setTimeout(apparaitre, INACTIVITE);
    }
    ["pointermove", "pointerdown", "keydown", "scroll", "wheel", "touchstart"].forEach((ev) =>
      window.addEventListener(ev, relancer, { passive: true }));
    relancer();

    function apparaitre() {
      if (ame || combat || document.hidden || document.querySelector(".fiche, .terminal.ouvert, .dossier, .succes-fenetre, .cinema")) { relancer(); return; }
      ame = document.createElement("button");
      ame.className = "ame-rouge";
      ame.setAttribute("aria-label", "Une âme rouge");
      ame.innerHTML = COEUR + '<span class="ame-bulle">* …</span>';
      document.body.append(ame);
      ame.addEventListener("click", () => { retirer(); ouvrirCombat(); });
      depart = setTimeout(() => retirer(true), 25000);
    }
    function retirer(enDouceur) {
      clearTimeout(depart);
      if (!ame) return;
      const el = ame; ame = null;
      if (enDouceur) { el.classList.add("sortie"); setTimeout(() => el.remove(), 800); } else el.remove();
    }

    // ---------------------------------------------------------------- mini-combat façon Undertale
    function ouvrirCombat() {
      clearTimeout(minuteur);
      const boite = document.createElement("div");
      boite.className = "combat";
      boite.setAttribute("role", "dialog");
      boite.setAttribute("aria-label", "Rencontre");
      boite.innerHTML =
        '<div class="combat-cadre"><p class="combat-texte"></p><canvas width="260" height="200" hidden></canvas></div>' +
        '<div class="combat-hud"><span class="combat-pv"></span><span class="combat-temps"></span></div>' +
        '<div class="combat-choix"></div>';
      document.body.append(boite);
      combat = { boite, fini: false };
      const texte = $(".combat-texte", boite), choix = $(".combat-choix", boite);

      function dire(t, ensuite) {
        texte.textContent = "";
        let i = 0;
        const id = setInterval(() => { texte.textContent = t.slice(0, ++i); if (i >= t.length) { clearInterval(id); if (ensuite) ensuite(); } }, reduit ? 1 : 28);
      }
      function boutons(liste) {
        choix.textContent = "";
        liste.forEach(([nom, f]) => {
          const b = document.createElement("button");
          b.innerHTML = '<span class="combat-mini" aria-hidden="true">' + COEUR + "</span>" + nom;
          b.addEventListener("click", f);
          choix.append(b);
        });
        const premier = choix.querySelector("button");
        if (premier) premier.focus({ preventScroll: true });
      }
      function fermer() {
        if (combat && combat.arret) combat.arret();
        boite.classList.add("sortie");
        setTimeout(() => boite.remove(), 400);
        combat = null;
        relancer();
      }

      dire("* Une âme rouge te barre la route.\n* Elle semble attirée par ton inactivité.", () =>
        boutons([["AGIR", agir], ["ÉPARGNER", epargner], ["FUIR", fermer]]));

      function epargner() {
        choix.textContent = "";
        dire("* Tu as épargné l'âme.\n* Elle tourne une fois autour de toi, puis s'envole.", () => {
          A.debloquer("misericorde");
          boutons([["CONTINUER", fermer]]);
        });
      }
      function agir() {
        choix.textContent = "";
        dire("* Tu décides de prouver ta DÉTERMINATION.\n* Tiens bon 12 secondes. (Flèches ou ZQSD)", () => setTimeout(esquive, 600));
      }

      function esquive() {
        texte.hidden = true;
        const cv = $("canvas", boite);
        cv.hidden = false;
        const ctx = cv.getContext("2d");
        const W = cv.width, H = cv.height, DUREE = 12;
        const joueur = { x: W / 2, y: H / 2, r: 5, pv: 3, invincible: 0 };
        let balles = [], t0 = performance.now(), dernier = t0, prochain = 0, enCours = true;
        const touches = {};
        const bas = (e) => {
          const k = e.key.toLowerCase();
          if (["arrowup", "arrowdown", "arrowleft", "arrowright", "z", "q", "s", "d", "w", "a"].includes(k)) { touches[k] = true; e.preventDefault(); }
        };
        const haut = (e) => { touches[e.key.toLowerCase()] = false; };
        window.addEventListener("keydown", bas);
        window.addEventListener("keyup", haut);
        // souris / doigt : l'âme suit le pointeur dans la boîte
        let cible = null;
        cv.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); cible = { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) }; });
        cv.addEventListener("pointerleave", () => { cible = null; });
        combat.arret = () => { enCours = false; window.removeEventListener("keydown", bas); window.removeEventListener("keyup", haut); };

        function tirer(t) {
          const phase = t < 4 ? 0 : t < 8 ? 1 : 2;
          if (phase === 0) { // pluie
            balles.push({ x: 10 + Math.random() * (W - 20), y: -6, vx: 0, vy: 70 + Math.random() * 40, r: 4 });
            prochain = t + 0.22;
          } else if (phase === 1) { // « os » horizontaux avec un trou
            const trou = 30 + Math.random() * (H - 90);
            const g = Math.random() < 0.5;
            for (let y = 8; y < H; y += 14) if (y < trou || y > trou + 44) balles.push({ x: g ? -6 : W + 6, y, vx: g ? 110 : -110, vy: 0, r: 4 });
            prochain = t + 1.1;
          } else { // anneau depuis un bord
            const cx = Math.random() * W, cy = Math.random() < 0.5 ? 0 : H;
            const a0 = Math.atan2(joueur.y - cy, joueur.x - cx);
            for (let k = -3; k <= 3; k++) balles.push({ x: cx, y: cy, vx: Math.cos(a0 + k * 0.22) * 95, vy: Math.sin(a0 + k * 0.22) * 95, r: 4 });
            prochain = t + 0.55;
          }
        }

        function image(maintenant) {
          if (!enCours) return;
          const dt = Math.min((maintenant - dernier) / 1000, 0.05);
          dernier = maintenant;
          const t = (maintenant - t0) / 1000;

          const v = 110;
          let dx = (touches.arrowright || touches.d ? 1 : 0) - (touches.arrowleft || touches.q || touches.a ? 1 : 0);
          let dy = (touches.arrowdown || touches.s ? 1 : 0) - (touches.arrowup || touches.z || touches.w ? 1 : 0);
          if (dx || dy) { const n = Math.hypot(dx, dy); joueur.x += (dx / n) * v * dt; joueur.y += (dy / n) * v * dt; }
          else if (cible) { const ex = cible.x - joueur.x, ey = cible.y - joueur.y, d = Math.hypot(ex, ey); if (d > 1) { const p = Math.min(d, v * 1.3 * dt); joueur.x += (ex / d) * p; joueur.y += (ey / d) * p; } }
          joueur.x = Math.max(joueur.r + 2, Math.min(W - joueur.r - 2, joueur.x));
          joueur.y = Math.max(joueur.r + 2, Math.min(H - joueur.r - 2, joueur.y));
          joueur.invincible = Math.max(0, joueur.invincible - dt);

          if (t >= prochain && t < DUREE - 0.4) tirer(t);
          balles.forEach((b) => { b.x += b.vx * dt; b.y += b.vy * dt; });
          balles = balles.filter((b) => b.x > -20 && b.x < W + 20 && b.y > -20 && b.y < H + 20);
          if (!joueur.invincible) {
            for (const b of balles) {
              if (Math.hypot(b.x - joueur.x, b.y - joueur.y) < b.r + joueur.r - 1) {
                joueur.pv--; joueur.invincible = 1;
                boite.classList.remove("touche"); void boite.offsetWidth; boite.classList.add("touche");
                break;
              }
            }
          }

          ctx.clearRect(0, 0, W, H);
          ctx.fillStyle = "#fff";
          balles.forEach((b) => { ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill(); });
          if (!(joueur.invincible && Math.floor(joueur.invincible * 10) % 2)) dessinerCoeur(ctx, joueur.x, joueur.y);
          $(".combat-pv", boite).textContent = "PV " + "♥".repeat(Math.max(0, joueur.pv)) + "♡".repeat(3 - Math.max(0, joueur.pv));
          $(".combat-temps", boite).textContent = Math.max(0, DUREE - t).toFixed(1) + " s";

          if (joueur.pv <= 0) return finir(false);
          if (t >= DUREE) return finir(true);
          requestAnimationFrame(image);
        }
        requestAnimationFrame(image);

        function finir(victoire) {
          combat.arret();
          cv.hidden = true;
          texte.hidden = false;
          $(".combat-temps", boite).textContent = "";
          if (victoire) {
            dire("* Tu as tenu bon.\n* Le sang bat encore dans ta carotide. Tu es rempli de DÉTERMINATION.", () => {
              A.debloquer("carotide");
              boutons([["CONTINUER", fermer]]);
            });
          } else {
            dire("* Tu es mort.\n* Heureusement, ce n'était qu'un portfolio.", () =>
              boutons([["RÉESSAYER", () => { choix.textContent = ""; esquive(); }], ["PARTIR", fermer]]));
          }
        }
      }
    }

    function dessinerCoeur(ctx, x, y) {
      // cœur pixelisé de 16 × 14 dessiné à l'échelle 0.75
      const motif = ["0011100000111000", "0111110001111100", "1111111011111110", "1111111111111110", "1111111111111110", "1111111111111110", "0111111111111100", "0011111111111000", "0001111111110000", "0000111111100000", "0000011111000000", "0000001110000000", "0000000100000000"];
      const p = 0.75;
      ctx.fillStyle = "#ff0000";
      motif.forEach((ligne, j) => {
        for (let i = 0; i < ligne.length; i++) if (ligne[i] === "1") ctx.fillRect(x - 6 + i * p, y - 5 + j * p, p + 0.05, p + 0.05);
      });
    }
  }

  window.Secrets = { cinema };
})();
