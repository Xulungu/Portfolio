/* ==========================================================================
   performance.js — mode « animations légères » pour les ordinateurs modestes.
   Chargé dans le <head> (avant l'affichage) : pose la classe html.anim-legeres
   si le visiteur l'a choisi, ou si l'appareil semble peu puissant.
   magie.js peut aussi l'activer en cours de route si le site rame.
   window.Perf = { legere(), choisir("legeres" | "completes"), basculerAuto() }
   ========================================================================== */
(function () {
  "use strict";
  const CLE = "animations";
  const racine = document.documentElement;

  function choixEnregistre() {
    try { return localStorage.getItem(CLE); } catch (e) { return null; }
  }

  // Appareil probablement modeste : peu de cœurs, peu de mémoire, ou économie de données activée
  function appareilModeste() {
    const n = navigator;
    return (n.hardwareConcurrency && n.hardwareConcurrency <= 4) ||
      (n.deviceMemory && n.deviceMemory <= 4) ||
      (n.connection && n.connection.saveData) || false;
  }

  const choix = choixEnregistre();
  if (choix === "legeres" || (choix !== "completes" && appareilModeste())) racine.classList.add("anim-legeres");

  function appliquer(legere) {
    racine.classList.toggle("anim-legeres", legere);
    document.dispatchEvent(new CustomEvent("mode-animations", { detail: legere ? "legeres" : "completes" }));
    majBoutons();
  }

  // Choix explicite du visiteur (bouton du pied de page) : gardé pour les prochaines visites
  function choisir(mode) {
    try { localStorage.setItem(CLE, mode); } catch (e) { /* le choix vaut pour cette visite */ }
    appliquer(mode === "legeres");
  }

  // Appelé par magie.js quand les images par seconde s'effondrent (sans choix explicite du visiteur)
  function basculerAuto() {
    if (choixEnregistre() || racine.classList.contains("anim-legeres")) return false;
    appliquer(true);
    return true;
  }

  function majBoutons() {
    const legere = racine.classList.contains("anim-legeres");
    document.querySelectorAll(".bouton-animations").forEach((b) => {
      b.textContent = "Animations : " + (legere ? "légères" : "complètes");
      b.setAttribute("aria-pressed", String(legere));
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    majBoutons();
    document.querySelectorAll(".bouton-animations").forEach((b) => b.addEventListener("click", () => {
      choisir(racine.classList.contains("anim-legeres") ? "completes" : "legeres");
    }));
  });

  window.Perf = {
    legere: () => racine.classList.contains("anim-legeres"),
    choisir,
    basculerAuto,
    choixManuel: () => Boolean(choixEnregistre()),
  };
})();
