/* ==========================================================================
   danmaku.js — Danmaku Mode : survivre 60 secondes aux quatre cartes de sort
   du Gardien de l'Archive. Déplacement aux flèches / ZQSD, Maj pour se
   concentrer, P pour la pause, R pour recommencer.
   ========================================================================== */
(function () {
  "use strict";
  const cv = document.getElementById("danmaku");
  const ctx = cv.getContext("2d");
  const W = cv.width, H = cv.height;
  const DUREE = 60;
  const $ = (s) => document.querySelector(s);
  // ?entrainement dans l'adresse : vies infinies (pas de succès)
  const entrainement = new URLSearchParams(location.search).has("entrainement");

  // Les quatre cartes de sort (15 s chacune)
  const CARTES = [
    { nom: "Signe de mana « Pluie de commits »", couleur: "cyan" },
    { nom: "Signe du Gluant « Glu en cloche »", couleur: "vert" },
    { nom: "Signe de Séraphel « Essaim spiralé »", couleur: "rose" },
    { nom: "Signe final « Absolute Danmaku »", couleur: "or" },
  ];
  const TEINTES = { cyan: [111, 227, 255], vert: [140, 255, 120], rose: [255, 111, 181], or: [255, 212, 94], blanc: [255, 255, 255] };

  // Sprites lumineux des projectiles
  const sprites = {};
  for (const n in TEINTES) {
    const [r, g, b] = TEINTES[n];
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const x = c.getContext("2d");
    const gr = x.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, "#fff"); gr.addColorStop(0.35, "#fff");
    gr.addColorStop(0.45, `rgb(${r},${g},${b})`); gr.addColorStop(0.7, `rgba(${r},${g},${b},0.35)`); gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = gr; x.fillRect(0, 0, 32, 32);
    sprites[n] = c;
  }

  // ------------------------------------------------------------------ état
  let etat = "titre"; // titre | jeu | pause | defaite | victoire
  let joueur, balles, gardien, temps, vies, frolements, invincible, tirSuivant, angle, etoiles, flash;
  const touches = {};
  let record = 0;
  try { record = +localStorage.getItem("danmaku-record") || 0; } catch (e) { /* rien */ }

  function initialiser() {
    joueur = { x: W / 2, y: H - 80, r: 3 };
    gardien = { x: W / 2, y: 120, phase: 0 };
    balles = [];
    temps = 0; vies = 3; frolements = 0; invincible = 0; tirSuivant = 0.8; angle = 0; flash = 0;
    etoiles = Array.from({ length: 70 }, () => ({ x: Math.random() * W, y: Math.random() * H, v: 20 + Math.random() * 80, a: 0.2 + Math.random() * 0.6 }));
  }
  initialiser();

  // ------------------------------------------------------------------ écrans
  function ecran(nom) {
    document.querySelectorAll(".dm-ecran").forEach((e) => { e.hidden = e.dataset.ecran !== nom; });
    const b = nom && document.querySelector(`.dm-ecran[data-ecran="${nom}"] .dm-bouton`);
    if (b) b.focus({ preventScroll: true });
  }
  function jouer() { initialiser(); etat = "jeu"; ecran(null); dernier = performance.now(); }
  function pause() {
    if (etat === "jeu") { etat = "pause"; ecran("pause"); }
    else if (etat === "pause") { etat = "jeu"; ecran(null); dernier = performance.now(); }
  }
  document.querySelectorAll(".dm-bouton").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.action === "reprendre") pause(); else jouer();
  }));

  // ------------------------------------------------------------------ commandes
  const DIRECTIONS = ["arrowup", "arrowdown", "arrowleft", "arrowright", "z", "q", "s", "d", "w", "a", "shift"];
  addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (DIRECTIONS.includes(k)) { touches[k] = true; if (etat === "jeu") e.preventDefault(); }
    if (k === "p" || (k === "escape" && etat !== "titre")) pause();
    if (k === "r" && etat !== "titre") jouer();
    if ((k === "enter" || k === " ") && (etat === "titre" || etat === "defaite" || etat === "victoire")) { e.preventDefault(); jouer(); }
  });
  addEventListener("keyup", (e) => { touches[e.key.toLowerCase()] = false; });
  addEventListener("blur", () => { for (const k in touches) touches[k] = false; if (etat === "jeu") pause(); });

  // Tactile / souris : le joueur suit le déplacement du doigt (en relatif)
  let doigt = null;
  cv.addEventListener("pointerdown", (e) => { doigt = { x: e.clientX, y: e.clientY }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove", (e) => {
    if (!doigt || etat !== "jeu") return;
    const echelle = W / cv.getBoundingClientRect().width;
    joueur.x += (e.clientX - doigt.x) * echelle;
    joueur.y += (e.clientY - doigt.y) * echelle;
    doigt = { x: e.clientX, y: e.clientY };
  });
  cv.addEventListener("pointerup", () => { doigt = null; });

  // ------------------------------------------------------------------ motifs de tir
  function balle(x, y, vitesse, dir, couleur, r = 5, gravite = 0) {
    balles.push({ x, y, vx: Math.cos(dir) * vitesse, vy: Math.sin(dir) * vitesse, r, couleur, gravite, frole: false });
  }
  const versJoueur = (x, y) => Math.atan2(joueur.y - y, joueur.x - x);

  function tirer(t) {
    const carte = Math.max(0, Math.min(3, Math.floor(t / 15)));
    const p = (t % 15) / 15; // progression dans la carte (0 → 1) : ça s'intensifie
    const gx = gardien.x, gy = gardien.y;
    if (carte === 0) {
      // pluie depuis le haut + rafales visées
      const n = 2 + Math.floor(p * 3);
      for (let i = 0; i < n; i++) balle(Math.random() * W, -10, 110 + Math.random() * 70, Math.PI / 2 + (Math.random() - 0.5) * 0.3, "cyan", 4);
      if (Math.random() < 0.28) { const a = versJoueur(gx, gy); for (let k = -1; k <= 1; k++) balle(gx, gy, 190, a + k * 0.16, "blanc", 5); }
      return 0.32 - p * 0.1;
    }
    if (carte === 1) {
      // éventails de glu qui retombent en cloche
      const n = 7 + Math.floor(p * 4), base = -Math.PI / 2;
      for (let i = 0; i < n; i++) balle(gx, gy, 170 + Math.random() * 40, base + (i / (n - 1) - 0.5) * 2.4, "vert", 6, 120);
      if (p > 0.4) { const a = versJoueur(gx, gy); balle(gx, gy, 220, a, "blanc", 5); }
      return 0.85 - p * 0.3;
    }
    if (carte === 2) {
      // spirale à plusieurs bras
      const bras = 3 + Math.floor(p * 2);
      for (let k = 0; k < bras; k++) balle(gx, gy, 130 + p * 40, angle + (k * Math.PI * 2) / bras, "rose", 5);
      angle += 0.21 + p * 0.06;
      return 0.07;
    }
    // carte finale : anneaux alternés + visée
    const n = 20 + Math.floor(p * 8), decal = (Math.floor(t * 2) % 2) * (Math.PI / n);
    for (let i = 0; i < n; i++) balle(gx, gy, 120 + p * 50, (i / n) * Math.PI * 2 + decal, "or", 5);
    const a = versJoueur(gx, gy);
    for (let k = -2; k <= 2; k++) balle(gx, gy, 230, a + k * 0.1, "blanc", 4);
    return 0.55 - p * 0.18;
  }

  // ------------------------------------------------------------------ mise à jour
  function maj(dt) {
    temps += dt;
    const concentre = touches.shift;
    const v = concentre ? 120 : 260;
    let dx = (touches.arrowright || touches.d ? 1 : 0) - (touches.arrowleft || touches.q || touches.a ? 1 : 0);
    let dy = (touches.arrowdown || touches.s ? 1 : 0) - (touches.arrowup || touches.z || touches.w ? 1 : 0);
    if (dx || dy) { const n = Math.hypot(dx, dy); joueur.x += (dx / n) * v * dt; joueur.y += (dy / n) * v * dt; }
    joueur.x = Math.max(10, Math.min(W - 10, joueur.x));
    joueur.y = Math.max(10, Math.min(H - 10, joueur.y));

    gardien.phase += dt;
    gardien.x = W / 2 + Math.sin(gardien.phase * 0.7) * 120;
    gardien.y = 120 + Math.sin(gardien.phase * 1.3) * 20;

    tirSuivant -= dt;
    if (tirSuivant <= 0 && temps < DUREE - 1) tirSuivant = tirer(temps);

    invincible = Math.max(0, invincible - dt);
    flash = Math.max(0, flash - dt * 2);
    for (const b of balles) {
      b.vy += b.gravite * dt;
      b.x += b.vx * dt; b.y += b.vy * dt;
      const d = Math.hypot(b.x - joueur.x, b.y - joueur.y);
      if (!invincible && d < b.r * 0.7 + joueur.r) touche();
      else if (!b.frole && d < b.r + 18) { b.frole = true; frolements++; }
    }
    balles = balles.filter((b) => b.x > -30 && b.x < W + 30 && b.y > -40 && b.y < H + 30);
    etoiles.forEach((s) => { s.y += s.v * dt; if (s.y > H) { s.y = 0; s.x = Math.random() * W; } });

    if (temps >= DUREE) finir(true);
  }

  function touche() {
    if (!entrainement) vies--;
    invincible = 2;
    flash = 1;
    // les projectiles proches disparaissent pour laisser respirer
    balles = balles.filter((b) => Math.hypot(b.x - joueur.x, b.y - joueur.y) > 140);
    cv.classList.remove("touche"); void cv.offsetWidth; cv.classList.add("touche");
    if (vies <= 0) finir(false);
  }

  function finir(victoire) {
    etat = victoire ? "victoire" : "defaite";
    const t = Math.min(temps, DUREE);
    if (t > record && !entrainement) {
      record = t;
      // meilleur temps gardé seulement si le visiteur a accepté la sauvegarde
      if (!window.Consentement || window.Consentement.accepte()) { try { localStorage.setItem("danmaku-record", String(record)); } catch (e) { /* rien */ } }
    }
    const txt = (victoire ? "60 secondes survécues" : "Survécu " + t.toFixed(1) + " s") + " · " + frolements + " frôlements";
    document.querySelector(`.dm-ecran[data-ecran="${etat}"] .dm-resultat`).textContent = txt;
    ecran(etat);
    if (victoire && !entrainement && window.Archive) window.Archive.debloquer("danmaku");
    hud();
  }

  // ------------------------------------------------------------------ dessin
  function dessiner() {
    ctx.fillStyle = "#05040f";
    ctx.fillRect(0, 0, W, H);
    // étoiles
    ctx.fillStyle = "#fff";
    etoiles.forEach((s) => { ctx.globalAlpha = s.a; ctx.fillRect(s.x, s.y, 1.5, 1.5); });
    ctx.globalAlpha = 1;

    // cercle magique du Gardien
    const carte = Math.max(0, Math.min(3, Math.floor(temps / 15)));
    const [r, g, b] = TEINTES[CARTES[carte].couleur];
    ctx.save();
    ctx.translate(gardien.x, gardien.y);
    ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`;
    ctx.lineWidth = 1.5;
    for (let k = 0; k < 2; k++) {
      ctx.rotate((k ? -1 : 1) * gardien.phase * 0.8);
      ctx.beginPath(); ctx.arc(0, 0, 46 - k * 14, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; ctx.lineTo(Math.cos(a * 2) * (46 - k * 14), Math.sin(a * 2) * (46 - k * 14)); }
      ctx.closePath(); ctx.stroke();
    }
    ctx.restore();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(sprites[CARTES[carte].couleur], gardien.x - 22, gardien.y - 22, 44, 44);

    // projectiles
    for (const bl of balles) { const s = bl.r * 3.2; ctx.drawImage(sprites[bl.couleur], bl.x - s / 2, bl.y - s / 2, s, s); }
    ctx.globalCompositeOperation = "source-over";

    // joueur
    if (etat !== "titre" && !(invincible && Math.floor(invincible * 12) % 2)) {
      ctx.fillStyle = "rgba(111,227,255,0.25)";
      ctx.beginPath(); ctx.arc(joueur.x, joueur.y, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#6fe3ff";
      ctx.beginPath(); ctx.moveTo(joueur.x, joueur.y - 13); ctx.lineTo(joueur.x + 9, joueur.y + 9); ctx.lineTo(joueur.x, joueur.y + 4); ctx.lineTo(joueur.x - 9, joueur.y + 9); ctx.closePath(); ctx.fill();
      if (touches.shift) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(joueur.x, joueur.y, 9, 0, Math.PI * 2); ctx.stroke(); }
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(joueur.x, joueur.y, joueur.r, 0, Math.PI * 2); ctx.fill();
    }

    // annonce de la carte de sort
    const debutCarte = carte * 15;
    if (etat === "jeu" && temps - debutCarte < 2.2) {
      const a = Math.min(1, (2.2 - (temps - debutCarte)) * 1.5);
      ctx.globalAlpha = a;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.font = "700 17px Rajdhani, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(CARTES[carte].nom, W - 14, 30);
      ctx.globalAlpha = 1;
    }
    if (flash) { ctx.fillStyle = `rgba(255,60,100,${flash * 0.35})`; ctx.fillRect(0, 0, W, H); }

    // barre de temps
    ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(0, 0, W, 4);
    ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.fillRect(0, 0, (Math.min(temps, DUREE) / DUREE) * W, 4);
  }

  function hud() {
    $(".hud-temps").textContent = Math.min(temps, DUREE).toFixed(1) + " / " + DUREE;
    $(".hud-vies").textContent = ("♥ ".repeat(Math.max(0, vies)) + "♡ ".repeat(3 - Math.max(0, vies))).trim();
    $(".hud-frolements").textContent = frolements;
    $(".hud-record").textContent = record ? record.toFixed(1) + " s" : "—";
    $(".hud-sort").textContent = etat === "titre" ? "—" : CARTES[Math.max(0, Math.min(3, Math.floor(temps / 15)))].nom;
  }

  // ------------------------------------------------------------------ boucle
  let dernier = performance.now();
  function boucle(t) {
    const dt = Math.max(0, Math.min((t - dernier) / 1000, 1 / 30)); // jamais négatif (horloges rAF / performance.now)
    dernier = t;
    if (etat === "jeu") maj(dt);
    else etoiles.forEach((s) => { s.y += s.v * dt * 0.3; if (s.y > H) s.y = 0; });
    if (etat !== "jeu") gardien.phase += dt; // le cercle du Gardien tourne aussi sur les écrans
    dessiner();
    hud();
    requestAnimationFrame(boucle);
  }
  ecran("titre");
  requestAnimationFrame(boucle);

  window.Danmaku = { jouer, etat: () => etat, temps: () => temps };
})();
