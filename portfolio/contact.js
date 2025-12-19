// contact.js
(function () {
  const form = document.getElementById("contact-form");
  const endpoint = form.getAttribute("action");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Récupération des champs
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Validation basique
    if (!name || !email || !message) {
      return toast("Veuillez remplir tous les champs.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast("Email invalide.");
    }

    // Construction des données (FormData pour compatibilité)
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("message", message);

    // UI: désactiver le bouton
    const submitBtn = form.querySelector("button[type='submit']");
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi...";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (res.ok) {
        toast("Message envoyé avec succès !");
        form.reset();
      } else {
        const payload = await res.json().catch(() => ({}));
        const msg =
          payload?.errors?.[0]?.message ||
          "Une erreur est survenue lors de l'envoi.";
        toast(msg);
      }
    } catch (err) {
      toast("Impossible d'envoyer le message. Vérifie ta connexion.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  // Petit helper de feedback (toast minimaliste)
  function toast(message) {
    let el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.style.position = "fixed";
      el.style.bottom = "24px";
      el.style.left = "50%";
      el.style.transform = "translateX(-50%)";
      el.style.background = "#111";
      el.style.color = "#fff";
      el.style.padding = "10px 16px";
      el.style.borderRadius = "8px";
      el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
      el.style.fontSize = "14px";
      el.style.zIndex = "9999";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.style.opacity = "1";
    setTimeout(() => (el.style.opacity = "0"), 3000);
  }
})();
