/* ==========================================================================
   salle.js — Les Abysses : poussière qui tombe, lanternes à rallumer,
   stèle qui raconte l'histoire, vestiges des projets, banc et porte scellée.
   ========================================================================== */
(function () {
  "use strict";
  const A = window.Archive;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Accès réservé à ceux qui ont ouvert le dossier CLASSIFIED
  if (!A || !A.drapeau("dossier")) {
    $(".salle-scellee").hidden = false;
    return;
  }
  $(".salle").hidden = false;
  setTimeout(() => A.debloquer("abysses"), 1500);

  // ------------------------------------------------------------------ textes
  const HISTOIRE = [
    {
      titre: "I — Avant le premier commit",
      texte: [
        "Il y avait un royaume fait de lignes de code que personne n'avait encore écrites.",
        "Un jeune mage y descendit avec une seule lanterne et une promesse : ne jamais oublier ce qu'il apprendrait.",
      ],
    },
    {
      titre: "II — Les trois épreuves",
      texte: [
        "Il affronta un plateau de tuiles où brillaient des soleils, puis des allumettes qu'il ne fallait jamais prendre en dernier.",
        "Enfin, il traversa un marécage d'acide gardé par un moustique qui se croyait dieu. À chaque épreuve, il laissa une page derrière lui.",
      ],
    },
    {
      titre: "III — Le sceau",
      texte: [
        "Craignant que ses souvenirs ne s'effacent, comme ceux du héros de son propre jeu, il scella ses pages ici, sous le portfolio.",
        "Il confia la clé à ceux qui savent lire entre les lignes. Toi, par exemple.",
        "Au-delà de la porte, une arène attend ceux qui savent danser entre les projectiles.",
      ],
    },
  ];
  const VESTIGES = {
    tuile: ["Tuile au soleil", "Une tuile du plateau de Latice. Poser une pièce sur un soleil rapportait deux points. Le mage en garde un souvenir… et une interface JavaFX."],
    allumette: ["Allumette", "Vestige des Mini-Jeux. Règle d'or : ne jamais prendre la dernière. Le bot, lui, ne l'a jamais compris."],
    page: ["Page du livre", "Une page arrachée au livre de Motrilem. On y devine deux frères mages, et une phrase à moitié effacée : « …ne jamais oublier… »."],
  };

  // ------------------------------------------------------------------ boîte de texte
  const boite = $(".salle-dialogue");
  function dire(titre, paragraphes, html) {
    $(".salle-dialogue-titre", boite).textContent = titre;
    const zone = $(".salle-dialogue-texte", boite);
    zone.textContent = "";
    paragraphes.forEach((t) => { const p = document.createElement("p"); p.textContent = t; zone.append(p); });
    if (html) zone.insertAdjacentHTML("beforeend", html);
    boite.hidden = false;
    boite.style.animation = "none"; void boite.offsetWidth; boite.style.animation = "";
  }
  boite.addEventListener("click", (e) => { if (!e.target.closest("a")) boite.hidden = true; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") boite.hidden = true; });

  // ------------------------------------------------------------------ lanternes
  const lanternes = $$(".lanterne");
  const allumees = new Set(A.drapeau("lanternes") || []);
  function majLanternes() {
    lanternes.forEach((l) => {
      const on = allumees.has(+l.dataset.lanterne);
      l.classList.toggle("allumee", on);
      l.setAttribute("aria-label", on ? "Lanterne allumée" : "Lanterne éteinte");
    });
    $(".objet-porte").classList.toggle("ouverte", allumees.size === lanternes.length);
  }
  lanternes.forEach((l) => l.addEventListener("click", () => {
    const n = +l.dataset.lanterne;
    if (allumees.has(n)) return;
    allumees.add(n);
    A.drapeau("lanternes", [...allumees]);
    majLanternes();
    const r = l.getBoundingClientRect();
    eclats(r.left + r.width / 2, r.top + r.height * 0.55);
    if (allumees.size === lanternes.length) {
      A.debloquer("lumieres");
      setTimeout(() => dire("Le sceau se brise", ["Toutes les lanternes brillent. Quelque part, une porte cède dans un souffle de poussière."]), 700);
    }
  }));
  majLanternes();

  // ------------------------------------------------------------------ objets
  $$(".objet").forEach((o) => o.addEventListener("click", () => {
    const quoi = o.dataset.objet;
    if (quoi === "stele") {
      // la stèle révèle un chapitre de plus à chaque paire de lanternes allumées
      const chapitres = 1 + Math.floor(allumees.size / 2);
      const visibles = HISTOIRE.slice(0, chapitres);
      const dernier = visibles[visibles.length - 1];
      const suite = chapitres < HISTOIRE.length ? ["(Le reste de l'inscription se perd dans l'obscurité.)"] : [];
      dire(dernier.titre, dernier.texte.concat(suite));
    } else if (VESTIGES[quoi]) {
      dire(VESTIGES[quoi][0], [VESTIGES[quoi][1]]);
    } else if (quoi === "banc") {
      dire("Un banc", ["Tu t'assois un instant. Ta progression est gravée dans l'Archive."], '<p><a href="#" class="voir-succes">Consulter les succès</a></p>');
      $(".voir-succes", boite).addEventListener("click", (e) => { e.preventDefault(); boite.hidden = true; A.ouvrirSucces(); });
    } else if (quoi === "porte") {
      if (allumees.size < lanternes.length) {
        dire("Porte scellée", ["Un sceau de lumière ferme le passage. Il semble se nourrir de l'obscurité de la salle.", "Lanternes allumées : " + allumees.size + " / " + lanternes.length]);
      } else {
        dire("L'Arène des projectiles", ["Derrière la porte, des milliers d'éclats de mana tournoient en silence.", "Il faudra les esquiver tous."],
          '<p><a href="' + (window.LIEN_DANMAKU || "danmaku.php") + '">Entrer dans l\'arène →</a></p>');
      }
    }
  }));

  // ------------------------------------------------------------------ parallaxe douce
  if (!reduit) {
    const loin = $(".decor-loin"), proche = $(".decor-proche");
    window.addEventListener("pointermove", (e) => {
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      loin.style.transform = `translate(${x * -10}px, ${y * -6}px)`;
      proche.style.transform = `translate(${x * -26}px, ${y * -14}px)`;
    }, { passive: true });
  }

  // ------------------------------------------------------------------ poussière qui tombe + éclats
  const cv = $("#poussiere"), ctx = cv.getContext("2d");
  let L, H, grains = [], etincelles = [];
  function taille() {
    const r = Math.min(devicePixelRatio || 1, 2);
    L = innerWidth; H = innerHeight;
    cv.width = L * r; cv.height = H * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
    const n = Math.round((L * H) / 9000);
    grains = Array.from({ length: n }, () => grain(true));
  }
  function grain(partout) {
    return { x: Math.random() * L, y: partout ? Math.random() * H : -5, v: 0.15 + Math.random() * 0.45, r: 0.6 + Math.random() * 1.6, p: Math.random() * 6.28, a: 0.15 + Math.random() * 0.45 };
  }
  function eclats(x, y) {
    for (let i = 0; i < 26; i++) {
      const ang = Math.random() * 6.28, v = 0.6 + Math.random() * 2.2;
      etincelles.push({ x, y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - 0.6, vie: 1 });
    }
  }
  function image() {
    ctx.clearRect(0, 0, L, H);
    for (const g of grains) {
      g.y += g.v; g.p += 0.01; g.x += Math.sin(g.p) * 0.2;
      if (g.y > H + 5) Object.assign(g, grain(false));
      ctx.globalAlpha = g.a;
      ctx.fillStyle = "#cfe0e8";
      ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, 6.28); ctx.fill();
    }
    for (let i = etincelles.length - 1; i >= 0; i--) {
      const s = etincelles[i];
      s.x += s.vx; s.y += s.vy; s.vy += 0.02; s.vx *= 0.98; s.vie -= 0.018;
      if (s.vie <= 0) { etincelles.splice(i, 1); continue; }
      ctx.globalAlpha = s.vie;
      ctx.fillStyle = "#bdf0ff";
      ctx.beginPath(); ctx.arc(s.x, s.y, 1.8, 0, 6.28); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduit) requestAnimationFrame(image);
  }
  taille();
  addEventListener("resize", taille);
  image();
})();
