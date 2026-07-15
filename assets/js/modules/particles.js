/**
 * Ambient background particles: small drifting dots inside any
 * [data-particles="N"] container (N = particle count). Purely decorative
 * (aria-hidden), skipped entirely under prefers-reduced-motion.
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {
function initParticles() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll("[data-particles]").forEach((container) => {
    if (container.dataset.particlesBound) return;
    container.dataset.particlesBound = "true";

    const count = Number(container.dataset.particles) || 16;
    const field = document.createElement("div");
    field.className = "particle-field";
    field.setAttribute("aria-hidden", "true");

    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      dot.className = "particle";
      const size = 5 + Math.random() * 7;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.bottom = `${Math.random() * 25}%`;
      dot.style.animationDuration = `${7 + Math.random() * 8}s`;
      dot.style.animationDelay = `${Math.random() * 8}s`;
      field.appendChild(dot);
    }

    container.prepend(field);
  });
}

window.LPP = window.LPP || {};
window.LPP.initParticles = initParticles;
})();
