</main>

<footer class="pied">
  <div class="pied-cercle" aria-hidden="true"></div>
  <p>© <?= date('Y') ?> <?= e(SITE['nom']) ?> — <?= e(SITE['formation']) ?>, <?= e(SITE['ecole']) ?></p>
</footer>

<!-- Notifications (formulaire de contact) -->
<div class="notifications" aria-live="polite"></div>

<!-- Transition animée vers une page projet -->
<div class="page-transition" aria-hidden="true"></div>

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
