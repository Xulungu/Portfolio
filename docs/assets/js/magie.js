/* ==========================================================================
   magie.js — fond animé : particules de mana, traînée du curseur,
   explosions de mana au clic et effet « Arise ».
   Tout est dessiné dans un seul <canvas id="mana">.
   ========================================================================== */
(function () {
  "use strict";

  const canvas = document.getElementById("mana");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointeurFin = window.matchMedia("(pointer: fine)").matches;

  const COULEURS = {
    cyan: [79, 216, 255],
    bleu: [60, 130, 255],
    violet: [150, 100, 255],
    blanc: [220, 240, 255],
  };

  // Sprites lumineux pré-dessinés (beaucoup plus rapide que shadowBlur à chaque image)
  const sprites = {};
  for (const nom in COULEURS) {
    const [r, g, b] = COULEURS[nom];
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d");
    const grad = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.15, `rgba(${r},${g},${b},0.9)`);
    grad.addColorStop(0.45, `rgba(${r},${g},${b},0.25)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = grad;
    x.fillRect(0, 0, 64, 64);
    sprites[nom] = c;
  }

  let largeur = 0, hauteur = 0, ratio = 1;
  const souris = { x: -9999, y: -9999, active: false };
  let motes = [];      // particules de mana du fond
  let etincelles = []; // traînée du curseur, explosions, arise
  let anneaux = [];    // ondes de choc au clic

  function aleatoire(min, max) { return min + Math.random() * (max - min); }
  function choisir(liste) { return liste[(Math.random() * liste.length) | 0]; }

  function creerMote(partout) {
    return {
      x: Math.random() * largeur,
      y: partout ? Math.random() * hauteur : hauteur + 20,
      taille: aleatoire(6, 22),
      vy: aleatoire(-0.15, -0.6),
      phase: Math.random() * Math.PI * 2,
      amplitude: aleatoire(0.2, 0.8),
      couleur: choisir(["cyan", "cyan", "bleu", "violet"]),
      scintille: aleatoire(0.002, 0.006),
    };
  }

  function redimensionner() {
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    largeur = window.innerWidth;
    hauteur = window.innerHeight;
    canvas.width = largeur * ratio;
    canvas.height = hauteur * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const nombre = Math.min(130, Math.round((largeur * hauteur) / 13000));
    while (motes.length < nombre) motes.push(creerMote(true));
    motes.length = nombre;
  }

  function dessinerLumiere(nom, x, y, taille, alpha) {
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprites[nom], x - taille / 2, y - taille / 2, taille, taille);
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

  function arise() {
    let vagues = 0;
    const id = setInterval(() => {
      for (let i = 0; i < 30; i++) {
        etincelles.push({
          x: Math.random() * largeur, y: hauteur + 10,
          vx: aleatoire(-0.4, 0.4), vy: aleatoire(-3, -7),
          vie: 1, usure: aleatoire(0.006, 0.012),
          taille: aleatoire(14, 40), couleur: choisir(["violet", "violet", "bleu"]), gravite: 0,
        });
      }
      if (++vagues > 25) clearInterval(id);
    }, 90);
  }

  window.Magie = { explosion, onde, arise };

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
      dessinerLumiere(m.couleur, m.x, m.y, m.taille, Math.max(0.08, alpha));
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
