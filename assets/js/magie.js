/* ==========================================================================
   magie.js — fond animé : particules de mana, traînée du curseur,
   et explosions de mana au clic.
   Tout est dessiné dans un seul <canvas id="mana">.
   ========================================================================== */
(function () {
  "use strict";

  const canvas = document.getElementById("mana");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Deuxième couche, au-dessus du contenu : quelques particules flottent devant les panneaux
  const avant = document.createElement("canvas");
  avant.id = "mana-avant";
  avant.setAttribute("aria-hidden", "true");
  document.body.append(avant);
  const ctxAvant = avant.getContext("2d");

  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointeurFin = window.matchMedia("(pointer: fine)").matches;

  const COULEURS = {
    cyan: [79, 216, 255],
    bleu: [60, 130, 255],
    violet: [150, 100, 255],
    blanc: [220, 240, 255],
    // couleurs des easter eggs
    violetFonce: [110, 50, 220],
    lavande: [205, 180, 255],
    rose: [255, 120, 185],
  };
  // Domaine du Monarque : toutes les lueurs passent au violet
  const TEINTE_MONARQUE = { cyan: "violet", bleu: "violetFonce", blanc: "lavande" };
  let teinte = null;

  // Sprites lumineux pré-dessinés (beaucoup plus rapide que shadowBlur à chaque image)
  const sprites = {};
  for (const nom in COULEURS) {
    const [r, g, b] = COULEURS[nom];
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d");
    const grad = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.12, `rgba(${r},${g},${b},1)`);
    grad.addColorStop(0.3, `rgba(${r},${g},${b},0.55)`);
    grad.addColorStop(0.6, `rgba(${r},${g},${b},0.15)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = grad;
    x.fillRect(0, 0, 64, 64);
    sprites[nom] = c;
  }

  let largeur = 0, hauteur = 0, ratio = 1;
  const souris = { x: -9999, y: -9999, active: false };
  let motes = [];      // particules de mana du fond
  let etincelles = []; // traînée du curseur, explosions, courants
  let anneaux = [];    // ondes de choc au clic

  function aleatoire(min, max) { return min + Math.random() * (max - min); }
  function choisir(liste) { return liste[(Math.random() * liste.length) | 0]; }

  function creerMote(partout) {
    return {
      x: Math.random() * largeur,
      y: partout ? Math.random() * hauteur : hauteur + 20,
      taille: aleatoire(10, 40),
      vy: aleatoire(-0.2, -0.75),
      phase: Math.random() * Math.PI * 2,
      amplitude: aleatoire(0.3, 1),
      couleur: choisir(["cyan", "cyan", "cyan", "bleu", "bleu", "blanc", "violet"]),
      scintille: aleatoire(0.002, 0.006),
      devant: Math.random() < 0.18,
    };
  }

  // Grandes nappes de mana, très douces, qui dérivent lentement
  let nappes = [];
  function creerNappe() {
    return {
      x: Math.random() * largeur, y: Math.random() * hauteur,
      taille: aleatoire(180, 420),
      vx: aleatoire(-0.15, 0.15), vy: aleatoire(-0.12, -0.03),
      phase: Math.random() * Math.PI * 2,
      couleur: choisir(["bleu", "cyan", "bleu"]),
    };
  }

  // Courant de mana : quelques particules qui montent ensemble depuis le bas de l'écran
  function courant() {
    const x = Math.random() * largeur;
    for (let i = 0; i < 10; i++) {
      etincelles.push({
        x: x + aleatoire(-25, 25), y: hauteur + aleatoire(0, 60),
        vx: aleatoire(-0.15, 0.15), vy: aleatoire(-1.2, -2.4),
        vie: 1, usure: aleatoire(0.004, 0.008),
        taille: aleatoire(10, 26), couleur: choisir(["cyan", "bleu", "blanc"]), gravite: 0,
      });
    }
  }

  function redimensionner() {
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    largeur = window.innerWidth;
    hauteur = window.innerHeight;
    for (const [c, x] of [[canvas, ctx], [avant, ctxAvant]]) {
      c.width = largeur * ratio;
      c.height = hauteur * ratio;
      x.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    const nombre = Math.min(190, Math.round((largeur * hauteur) / 8500));
    const nombreNappes = largeur < 700 ? 5 : 9;
    while (nappes.length < nombreNappes) nappes.push(creerNappe());
    nappes.length = nombreNappes;
    while (motes.length < nombre) motes.push(creerMote(true));
    motes.length = nombre;
  }

  function dessinerLumiere(nom, x, y, taille, alpha, cible = ctx) {
    cible.globalAlpha = alpha;
    if (teinte && teinte[nom]) nom = teinte[nom];
    cible.drawImage(sprites[nom], x - taille / 2, y - taille / 2, taille, taille);
  }

  // ------------------------------------------------------------------ effets publics
  function explosion(x, y, nombre, couleurs, vitesse) {
    for (let i = 0; i < nombre; i++) {
      const angle = (Math.PI * 2 * i) / nombre + aleatoire(-0.2, 0.2);
      const v = aleatoire(vitesse * 0.4, vitesse);
      etincelles.push({
        x, y,
        vx: Math.cos(angle) * v,
        vy: Math.sin(angle) * v,
        vie: 1, usure: aleatoire(0.015, 0.03),
        taille: aleatoire(10, 26),
        couleur: choisir(couleurs),
        gravite: -0.02,
      });
    }
  }

  function onde(x, y, couleur) {
    anneaux.push({ x, y, r: 4, vie: 1, couleur: COULEURS[couleur] });
  }


  // Des ombres s'élèvent du bas de l'écran (easter egg « arise »)
  function ombres() {
    let vagues = 0;
    const id = setInterval(() => {
      for (let i = 0; i < 26; i++) {
        etincelles.push({
          x: Math.random() * largeur, y: hauteur + 10,
          vx: aleatoire(-0.4, 0.4), vy: aleatoire(-3, -7),
          vie: 1, usure: aleatoire(0.006, 0.012),
          taille: aleatoire(14, 40), couleur: choisir(["violet", "violetFonce", "lavande"]), gravite: 0,
        });
      }
      if (++vagues > 22) clearInterval(id);
    }, 90);
  }

  function monarque(actif) { teinte = actif ? TEINTE_MONARQUE : null; }

  window.Magie = { explosion, onde, ombres, monarque };

  // ------------------------------------------------------------------ entrées
  if (pointeurFin && !reduit) {
    let dernier = 0;
    window.addEventListener("pointermove", (e) => {
      souris.x = e.clientX; souris.y = e.clientY; souris.active = true;
      const maintenant = performance.now();
      if (maintenant - dernier < 16) return;
      dernier = maintenant;
      for (let i = 0; i < 2; i++) {
        etincelles.push({
          x: e.clientX + aleatoire(-3, 3), y: e.clientY + aleatoire(-3, 3),
          vx: aleatoire(-0.4, 0.4), vy: aleatoire(-0.8, 0.1),
          vie: 1, usure: aleatoire(0.025, 0.045),
          taille: aleatoire(8, 16), couleur: choisir(["cyan", "violet", "blanc"]), gravite: -0.01,
        });
      }
    }, { passive: true });
    document.addEventListener("pointerleave", () => { souris.active = false; souris.x = souris.y = -9999; });
  }

  if (!reduit) {
    window.addEventListener("pointerdown", (e) => {
      explosion(e.clientX, e.clientY, 16, ["cyan", "bleu", "blanc"], 4);
      onde(e.clientX, e.clientY, "cyan");
    }, { passive: true });
  }

  // ------------------------------------------------------------------ boucle
  let tempsPrecedent = performance.now();
  function image(t) {
    const dt = Math.min((t - tempsPrecedent) / 16.67, 3);
    tempsPrecedent = t;

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, largeur, hauteur);
    ctx.globalCompositeOperation = "lighter";
    ctxAvant.globalCompositeOperation = "source-over";
    ctxAvant.globalAlpha = 1;
    ctxAvant.clearRect(0, 0, largeur, hauteur);
    ctxAvant.globalCompositeOperation = "lighter";

    // nappes de mana (lueurs diffuses)
    for (const n of nappes) {
      n.phase += 0.004 * dt;
      n.x += n.vx * dt; n.y += n.vy * dt;
      if (n.y < -n.taille) { n.y = hauteur + n.taille / 2; n.x = Math.random() * largeur; }
      if (n.x < -n.taille) n.x = largeur + n.taille / 2; else if (n.x > largeur + n.taille) n.x = -n.taille / 2;
      dessinerLumiere(n.couleur, n.x, n.y, n.taille, 0.12 + 0.05 * Math.sin(n.phase));
    }

    // un courant de mana de temps en temps
    if (Math.random() < 0.012 * dt) courant();

    // particules de mana : montent doucement, ondulent, fuient un peu le curseur
    for (const m of motes) {
      m.phase += 0.01 * dt;
      m.y += m.vy * dt;
      m.x += Math.sin(m.phase) * m.amplitude * 0.5 * dt;
      if (souris.active) {
        const dx = m.x - souris.x, dy = m.y - souris.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14000) {
          const f = (1 - d2 / 14000) * 2.2 * dt;
          const d = Math.sqrt(d2) || 1;
          m.x += (dx / d) * f; m.y += (dy / d) * f;
        }
      }
      if (m.y < -30) Object.assign(m, creerMote(false));
      if (m.x < -30) m.x = largeur + 20; else if (m.x > largeur + 30) m.x = -20;
      const alpha = 0.35 + 0.35 * Math.sin(t * m.scintille + m.phase);
      const a = Math.max(0.15, alpha + 0.15) * (m.devant ? 0.75 : 1);
      const cible = m.devant ? ctxAvant : ctx;
      dessinerLumiere(m.couleur, m.x, m.y, m.taille, a, cible);
      // petite traînée sous la particule : elle a l'air de s'élever
      dessinerLumiere(m.couleur, m.x - Math.sin(m.phase) * 2, m.y + m.taille * 0.45, m.taille * 0.6, a * 0.45, cible);
    }

    // étincelles
    for (let i = etincelles.length - 1; i >= 0; i--) {
      const s = etincelles[i];
      s.x += s.vx * dt; s.y += s.vy * dt;
      s.vx *= 0.97; s.vy = s.vy * 0.97 + s.gravite * dt;
      s.vie -= s.usure * dt;
      if (s.vie <= 0) { etincelles.splice(i, 1); continue; }
      dessinerLumiere(s.couleur, s.x, s.y, s.taille * (0.4 + s.vie * 0.6), s.vie);
    }
    if (etincelles.length > 900) etincelles.splice(0, etincelles.length - 900);

    // ondes de choc
    for (let i = anneaux.length - 1; i >= 0; i--) {
      const a = anneaux[i];
      a.r += 3.2 * dt; a.vie -= 0.035 * dt;
      if (a.vie <= 0) { anneaux.splice(i, 1); continue; }
      ctx.globalAlpha = a.vie;
      ctx.strokeStyle = `rgb(${a.couleur.join(",")})`;
      ctx.lineWidth = 2 * a.vie;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (!document.hidden) requestAnimationFrame(image);
  }

  redimensionner();
  window.addEventListener("resize", redimensionner);

  if (reduit) {
    // Fond fixe, sans animation
    ctx.globalCompositeOperation = "lighter";
    for (const m of motes) dessinerLumiere(m.couleur, m.x, m.y, m.taille, 0.4);
  } else {
    requestAnimationFrame(image);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) { tempsPrecedent = performance.now(); requestAnimationFrame(image); }
    });
  }
})();
