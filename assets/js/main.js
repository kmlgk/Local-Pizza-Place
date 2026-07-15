/**
 * Entry point. Plain classic script (not type="module") so the whole site
 * works over file:// too — Chrome/Firefox block ES module imports under the
 * file: origin, which would otherwise silently break every interaction.
 * Must load after all assets/js/modules/*.js files (see each page's <script> order).
 */
document.documentElement.classList.remove("no-js");
requestAnimationFrame(() => document.body.classList.add("page-ready"));

(function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  const bar = preloader.querySelector("[data-preloader-bar]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const minVisible = reduceMotion ? 0 : 900;
  const startedAt = Date.now();

  if (bar) {
    if (window.gsap) {
      gsap.to(bar, { width: "100%", duration: minVisible / 1000 || 0.01, ease: "power1.out" });
    } else {
      bar.style.transition = `width ${minVisible}ms linear`;
      requestAnimationFrame(() => (bar.style.width = "100%"));
    }
  }

  const hide = () => {
    const elapsed = Date.now() - startedAt;
    const wait = Math.max(0, minVisible - elapsed);
    window.setTimeout(() => preloader.classList.add("is-hidden"), wait);
  };
  if (document.readyState === "complete") hide();
  else window.addEventListener("load", hide);
  window.setTimeout(hide, 4000);
})();

window.LPP.initTheme();
window.LPP.initNav();
window.LPP.initReveal();
window.LPP.initCounters();
window.LPP.initForms();
window.LPP.initComponents();
window.LPP.initMicroInteractions();
window.LPP.initFavorites();
window.LPP.initRipple();
window.LPP.initCarousels();
window.LPP.initCart?.();
window.LPP.initParticles?.();
window.LPP.initMotion?.();
window.LPP.initMenu?.();
window.lucide?.createIcons();
