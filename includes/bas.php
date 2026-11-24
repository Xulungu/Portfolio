</main>

<footer class="pied">
  <div class="pied-cercle" aria-hidden="true"></div>
  <p>© <?= date('Y') ?> <?= e(SITE['nom']) ?> — <?= e(SITE['formation']) ?>, <?= e(SITE['ecole']) ?></p>
  <p class="pied-astuce">Astuce du Système : tape <kbd>arise</kbd> au clavier…</p>
</footer>

<!-- Notifications du « Système » -->
<div class="notifications" aria-live="polite"></div>

<!-- Transition d'ouverture de portail (en entrant dans un donjon) -->
<div class="portail-transition" aria-hidden="true"><div class="portail-cercle"></div></div>

<!-- Agrandissement des images -->
<div class="visionneuse" hidden>
  <button class="visionneuse-fermer" aria-label="Fermer">✕</button>
  <img src="" alt="">
</div>

<script src="<?= e(ressource('assets/js/magie.js')) ?>" defer></script>
<script src="<?= e(ressource('assets/js/interface.js')) ?>" defer></script>
<script src="<?= e(ressource('assets/js/contact.js')) ?>" defer></script>
</body>
</html>
