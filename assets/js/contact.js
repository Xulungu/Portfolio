/* ==========================================================================
   contact.js — envoi du formulaire de contact (via Formspree) sans recharger
   la page, avec vérification des champs et effet visuel.
   ========================================================================== */
(function () {
  "use strict";

  const form = document.getElementById("formulaire-contact");
  if (!form) return;

  const zone = form.closest(".contact");
  const bouton = form.querySelector("button[type='submit']");
  const texteBouton = bouton.querySelector("span");
  const champs = {
    nom: form.querySelector("#nom"),
    email: form.querySelector("#email"),
    message: form.querySelector("#message"),
  };
  const dire = (msg, type) => (window.notifier ? window.notifier(msg, type) : alert(msg));

  // Le cercle magique s'anime quand on remplit le formulaire
  form.addEventListener("focusin", () => zone && zone.classList.add("actif"));
  form.addEventListener("focusout", () => {
    setTimeout(() => { if (zone && !form.contains(document.activeElement)) zone.classList.remove("actif"); }, 50);
  });
  Object.values(champs).forEach((c) => c.addEventListener("input", () => c.classList.remove("erreur")));

  function verifier() {
    let ok = true;
    const marquer = (champ, invalide) => { champ.classList.toggle("erreur", invalide); if (invalide) ok = false; };
    marquer(champs.nom, !champs.nom.value.trim());
    marquer(champs.email, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champs.email.value.trim()));
    marquer(champs.message, champs.message.value.trim().length < 5);
    return ok;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!verifier()) {
      dire("Merci de vérifier les champs en rouge.");
      return;
    }

    const original = texteBouton.textContent;
    bouton.disabled = true;
    texteBouton.textContent = "Envoi en cours…";

    try {
      const reponse = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (reponse.ok) {
        form.reset();
        dire("Message envoyé. Je vous réponds dès que possible.");
        if (zone) {
          zone.classList.remove("invoque");
          void zone.offsetWidth;
          zone.classList.add("invoque");
        }
        if (window.Magie) {
          const r = bouton.getBoundingClientRect();
          window.Magie.explosion(r.left + r.width / 2, r.top + r.height / 2, 50, ["cyan", "violet", "blanc"], 10);
          window.Magie.onde(r.left + r.width / 2, r.top + r.height / 2, "violet");
        }
      } else {
        const donnees = await reponse.json().catch(() => ({}));
        dire((donnees.errors && donnees.errors[0] && donnees.errors[0].message) || "Une erreur est survenue lors de l'envoi.");
      }
    } catch (err) {
      dire("Impossible d'envoyer le message. Vérifiez votre connexion.");
    } finally {
      bouton.disabled = false;
      texteBouton.textContent = original;
    }
  });
})();
