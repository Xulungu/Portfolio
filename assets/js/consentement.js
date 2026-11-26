/* ==========================================================================
   consentement.js — information et choix sur les données enregistrées.
   Le site ne dépose aucun cookie. Il peut enregistrer dans le navigateur
   (localStorage) la progression des secrets et le meilleur score du mini-jeu,
   mais seulement si le visiteur l'accepte.
   Chargé en premier sur toutes les pages : window.Consentement.
   ========================================================================== */
(function () {
  "use strict";

  const CLE = "consentement-stockage";
  const DONNEES = ["archive-evan", "danmaku-record"]; // ce qui n'est gardé qu'avec l'accord du visiteur

  function lire() {
    try { return localStorage.getItem(CLE); } catch (e) { return null; }
  }
  const accepte = () => lire() === "oui";
  const decide = () => lire() === "oui" || lire() === "non";

  function effacerDonnees() {
    DONNEES.forEach((c) => { try { localStorage.removeItem(c); } catch (e) { /* rien */ } });
  }

  function choisir(valeur) {
    try { localStorage.setItem(CLE, valeur); } catch (e) { /* stockage bloqué : le choix vaut pour cette visite */ }
    if (valeur === "non") effacerDonnees();
    fermerBandeau();
    document.dispatchEvent(new CustomEvent("consentement", { detail: valeur }));
  }

  // ------------------------------------------------------------------ bandeau (première visite)
  let bandeau = null;
  function afficherBandeau() {
    if (bandeau || decide()) return;
    bandeau = document.createElement("section");
    bandeau.className = "consentement-bandeau";
    bandeau.setAttribute("role", "region");
    bandeau.setAttribute("aria-label", "Données enregistrées");
    bandeau.innerHTML = `
      <p class="consentement-titre">Vos données sur ce site</p>
      <p>Aucun cookie publicitaire ni statistique de visite. Si vous l'acceptez, votre navigateur garde
      votre progression dans les secrets du site et votre meilleur score au mini-jeu. Rien n'est envoyé à un serveur.</p>
      <div class="consentement-boutons">
        <button type="button" data-choix="oui">Accepter</button>
        <button type="button" data-choix="non">Refuser</button>
        <button type="button" class="consentement-lien" data-choix="details">En savoir plus</button>
      </div>`;
    bandeau.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.choix === "details") ouvrirPanneau();
      else choisir(b.dataset.choix);
    });
    document.body.append(bandeau);
  }
  function fermerBandeau() {
    if (!bandeau) return;
    const b = bandeau;
    bandeau = null;
    b.classList.add("sortie");
    setTimeout(() => b.remove(), 350);
  }

  // ------------------------------------------------------------------ panneau détaillé
  function ouvrirPanneau() {
    if (document.querySelector(".consentement-panneau")) return;
    const etat = lire();
    const fond = document.createElement("div");
    fond.className = "consentement-fond";
    const p = document.createElement("div");
    p.className = "consentement-panneau";
    p.setAttribute("role", "dialog");
    p.setAttribute("aria-modal", "true");
    p.setAttribute("aria-labelledby", "consentement-titre");
    p.innerHTML = `
      <button type="button" class="consentement-fermer" aria-label="Fermer">✕</button>
      <h2 id="consentement-titre">Données et cookies</h2>
      <p class="consentement-etat">Votre choix actuel :
        <strong>${etat === "oui" ? "sauvegarde acceptée" : etat === "non" ? "sauvegarde refusée" : "pas encore choisi"}</strong></p>

      <h3>Ce que ce site enregistre dans votre navigateur</h3>
      <table>
        <thead><tr><th>Donnée</th><th>Contenu</th><th>Durée</th><th>Condition</th></tr></thead>
        <tbody>
          <tr><td>Progression des secrets</td><td>Succès débloqués, fragments trouvés, salle secrète</td><td>Jusqu'à ce que vous l'effaciez</td><td>Si vous acceptez</td></tr>
          <tr><td>Meilleur score</td><td>Meilleur temps au Danmaku Mode</td><td>Jusqu'à ce que vous l'effaciez</td><td>Si vous acceptez</td></tr>
          <tr><td>Votre choix</td><td>« Accepter » ou « Refuser »</td><td>Jusqu'à ce que vous l'effaciez</td><td>Toujours (pour ne pas vous redemander)</td></tr>
          <tr><td>Préférences de navigation</td><td>Thème de couleur, transition entre les pages</td><td>Fermeture de l'onglet</td><td>Toujours (nécessaire au fonctionnement)</td></tr>
        </tbody>
      </table>
      <p>Ces données restent sur votre appareil : elles ne sont ni envoyées, ni partagées. Le site ne dépose aucun cookie.</p>

      <h3>Services externes</h3>
      <ul>
        <li><strong>Google Fonts</strong> : les polices sont chargées depuis les serveurs de Google, qui reçoivent votre adresse IP.</li>
        <li><strong>Formspree</strong> : uniquement si vous envoyez le formulaire de contact (nom, e-mail, message).</li>
        <li><strong>Netlify</strong> : l'hébergeur du site, qui garde des journaux techniques de connexion.</li>
      </ul>

      <div class="consentement-boutons">
        <button type="button" data-choix="oui">Accepter la sauvegarde</button>
        <button type="button" data-choix="non">Refuser et effacer mes données</button>
      </div>`;
    document.body.append(fond, p);
    const fermer = () => { fond.remove(); p.remove(); document.removeEventListener("keydown", echap); };
    const echap = (e) => { if (e.key === "Escape") fermer(); };
    fond.addEventListener("click", fermer);
    p.querySelector(".consentement-fermer").addEventListener("click", fermer);
    p.querySelectorAll("[data-choix]").forEach((b) => b.addEventListener("click", () => { choisir(b.dataset.choix); fermer(); }));
    document.addEventListener("keydown", echap);
    p.querySelector(".consentement-fermer").focus({ preventScroll: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    afficherBandeau();
    document.querySelectorAll(".lien-donnees").forEach((b) => b.addEventListener("click", ouvrirPanneau));
  });

  window.Consentement = { accepte, decide, ouvrirPanneau, choisir };
})();
