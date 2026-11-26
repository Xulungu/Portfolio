/* ==========================================================================
   archive/ignis.js — easter egg « ignis » : explosions de flammes en chaîne.
   Moteur de particules dédié (canvas plein écran) :
   - des langues de feu partent en rayons depuis un anneau autour du centre
     (cœur sombre, couronne éclatante, comme une fleur de flammes) ;
   - plusieurs explosions s'enchaînent, de plus en plus vite ;
   - l'écran zoome et tremble à chaque explosion ;
   - il reste un anneau de fumée sombre qui se dissipe.
   Utilisation : window.Ignis.lancer()
   ========================================================================== */
(function () {
  "use strict";
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ------------------------------------------------------------------ sprites de flamme (pré-dessinés)
  // Chaque particule change de sprite selon son âge : blanc-jaune → orange → rouge → fumée.
  function sprite(stops) {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d");
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    stops.forEach(([o, col]) => g.addColorStop(o, col));
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
    return c;
  }
  const SPRITES = [
    sprite([[0, "rgba(255,245,200,0.9)"], [0.2, "rgba(255,210,110,0.75)"], [0.5, "rgba(255,150,40,0.35)"], [1, "rgba(230,90,10,0)"]]),
    sprite([[0, "rgba(255,200,100,0.85)"], [0.3, "rgba(250,140,35,0.6)"], [0.6, "rgba(210,80,15,0.28)"], [1, "rgba(160,40,0,0)"]]),
    sprite([[0, "rgba(240,120,30,0.75)"], [0.35, "rgba(190,60,10,0.45)"], [0.7, "rgba(120,25,0,0.18)"], [1, "rgba(70,8,0,0)"]]),
    sprite([[0, "rgba(60,25,10,0.55)"], [0.5, "rgba(35,15,8,0.3)"], [1, "rgba(20,8,4,0)"]]),
  ];

  let cv, ctx, L, H, cx, cy, particules, enCours = false, t0, dernier, secousse = 0, zoom = 0, voile = 0, flash = 0;

  function preparer() {
    cv = document.createElement("canvas");
    cv.className = "ignis-canvas";
    cv.setAttribute("aria-hidden", "true");
    document.body.append(cv);
    ctx = cv.getContext("2d");
    const r = 1; // résolution normale : des flammes floues n'ont pas besoin de plus
    L = window.innerWidth; H = window.innerHeight;
    cv.width = L * r; cv.height = H * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
    cx = L / 2; cy = H / 2;
    particules = [];
  }

  // ------------------------------------------------------------------ une explosion
  // force : 0.4 (petite) à 1.3 (énorme) ; vitesse : multiplicateur de durée
  function explosion(force, vitesse) {
    const portee = Math.hypot(L, H) * 0.55 * force;     // jusqu'où montent les flammes
    const allege = window.Perf && window.Perf.legere() ? 0.45 : 1; // mode animations légères
    const n = Math.round(300 * force * allege);          // nombre de langues de feu
    const rotation = (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 0.8); // tourbillon
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const depart = 30 + Math.random() * 60 * force;    // part d'un anneau : le centre reste sombre
      const v = (portee / 0.9) * (0.45 + Math.random() * 0.75) * vitesse;
      particules.push({
        x: cx + Math.cos(a) * depart, y: cy + Math.sin(a) * depart,
        a, v, rot: rotation * (0.4 + Math.random()),
        age: 0, vie: (0.55 + Math.random() * 0.6) / vitesse,
        taille: (18 + Math.random() * 30) * (0.7 + force * 0.5),
        etirement: 2.6 + Math.random() * 3.2,            // longues langues de feu dans le sens du mouvement
        fumee: false,
      });
    }
    // couronne de fumée qui reste après le passage des flammes
    for (let i = 0; i < 45 * force * allege; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = portee * (0.55 + Math.random() * 0.5);
      particules.push({
        x: cx + Math.cos(a) * r * 0.2, y: cy + Math.sin(a) * r * 0.2,
        a, v: r * 1.1 * vitesse, rot: rotation * 0.3,
        age: 0, vie: (1.4 + Math.random()) / vitesse,
        taille: 90 + Math.random() * 120, etirement: 1.2, fumee: true,
      });
    }
    secousse = Math.max(secousse, 16 * force);
    zoom = Math.max(zoom, 0.09 * force);
    flash = Math.max(flash, 0.3 * force);
    voile = Math.min(1, voile + 0.35);
  }

  // ------------------------------------------------------------------ boucle
  function image(t) {
    const dt = Math.max(0, Math.min((t - dernier) / 1000, 1 / 30));
    dernier = t;
    const ecoule = (t - t0) / 1000;

    secousse *= Math.pow(0.02, dt);
    zoom *= Math.pow(0.05, dt);
    flash *= Math.pow(0.01, dt);
    if (ecoule > PROGRAMME_FIN) voile = Math.max(0, voile - dt * 0.9);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, cv.width, cv.height);
    const r = cv.width / L;
    // secousse + zoom de caméra autour du centre
    const sx = (Math.random() - 0.5) * secousse, sy = (Math.random() - 0.5) * secousse;
    const z = 1 + zoom;
    const A = r * z, E = r * (cx * (1 - z) + sx), F = r * (cy * (1 - z) + sy);
    ctx.setTransform(A, 0, 0, A, E, F);

    // fond brûlé
    ctx.fillStyle = `rgba(18, 5, 0, ${0.72 * voile})`;
    ctx.fillRect(-50, -50, L + 100, H + 100);

    // fumée (mélange normal), puis flammes (mélange additif)
    for (let pass = 0; pass < 2; pass++) {
      ctx.globalCompositeOperation = pass === 0 ? "source-over" : "lighter";
      for (const p of particules) {
        if ((pass === 0) !== p.fumee) continue;
        const k = p.age / p.vie;
        if (k >= 1) continue;
        let spr, alpha;
        if (p.fumee) { spr = SPRITES[3]; alpha = Math.sin(Math.PI * k) * 0.9; }
        else {
          spr = SPRITES[Math.min(2, Math.floor(k * 3.2))];
          alpha = k < 0.1 ? k / 0.1 : 1 - Math.pow((k - 0.1) / 0.9, 1.6);
        }
        const taille = p.taille * (0.5 + k * 1.1);
        const dir = p.a + p.rot * k;
        ctx.globalAlpha = Math.max(0, alpha);
        const c = Math.cos(dir), si = Math.sin(dir);
        ctx.setTransform(A * c, A * si, -A * si, A * c, A * p.x + E, A * p.y + F);
        ctx.drawImage(spr, -taille * p.etirement / 2, -taille / 2, taille * p.etirement, taille);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.setTransform(A, 0, 0, A, E, F);

    // flash chaud au moment de chaque explosion
    if (flash > 0.01) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(L, H) / 2);
      g.addColorStop(0, `rgba(255, 220, 150, ${flash})`);
      g.addColorStop(1, `rgba(255, 120, 30, ${flash * 0.3})`);
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = g;
      ctx.fillRect(-50, -50, L + 100, H + 100);
      ctx.globalCompositeOperation = "source-over";
    }

    // mouvement des particules : vers l'extérieur, en tourbillonnant, en ralentissant
    for (const p of particules) {
      p.age += dt;
      const k = p.age / p.vie;
      const v = p.v * Math.pow(1 - Math.min(k, 1), 1.4);
      const dir = p.a + p.rot * k;
      p.x += Math.cos(dir) * v * dt;
      p.y += Math.sin(dir) * v * dt - (p.fumee ? 0 : 18 * dt); // les flammes montent un peu
    }
    particules = particules.filter((p) => p.age < p.vie);

    if (ecoule < PROGRAMME_FIN || particules.length || voile > 0.01) requestAnimationFrame(image);
    else terminer();
  }

  // Enchaînement : deux grosses explosions, puis de plus en plus vite
  const PROGRAMME = [
    [0.0, 1.25, 1.0],
    [1.25, 1.15, 1.1],
    [2.3, 0.9, 1.35],
    [2.95, 0.75, 1.6],
    [3.45, 0.65, 1.9],
    [3.85, 0.6, 2.2],
    [4.2, 1.2, 2.4],   // bouquet final
  ];
  const PROGRAMME_FIN = 5.2;

  function terminer() {
    cv.remove();
    enCours = false;
  }

  function lancer() {
    if (enCours) return;
    enCours = true;
    preparer();
    if (reduit) {
      // version sobre : une seule explosion lente, sans secousse
      explosion(0.8, 0.8);
      secousse = 0; zoom = 0;
    } else {
      PROGRAMME.forEach(([quand, force, vitesse]) => setTimeout(() => explosion(force, vitesse), quand * 1000));
    }
    t0 = dernier = performance.now();
    requestAnimationFrame(image);
  }

  window.Ignis = { lancer };
})();
