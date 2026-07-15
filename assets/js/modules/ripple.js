/**
 * Material-style click ripple for buttons/links marked [data-ripple].
 * Respects prefers-reduced-motion (skips entirely).
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {
function initRipple() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll("[data-ripple]").forEach((el) => {
    el.style.position = el.style.position || "relative";
    el.style.overflow = "hidden";

    el.addEventListener("click", (e) => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const span = document.createElement("span");
      span.setAttribute("aria-hidden", "true");
      span.style.cssText = `
        position: absolute;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 9999px;
        background: currentColor;
        opacity: 0.35;
        pointer-events: none;
        transform: scale(0);
        transition: transform 550ms cubic-bezier(0.16, 1, 0.3, 1), opacity 550ms ease-out;
      `;
      el.appendChild(span);
      requestAnimationFrame(() => {
        span.style.transform = "scale(1)";
        span.style.opacity = "0";
      });
      window.setTimeout(() => span.remove(), 600);
    });
  });
}

window.LPP = window.LPP || {};
window.LPP.initRipple = initRipple;
})();
