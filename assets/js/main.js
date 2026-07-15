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
  const hide = () => preloader.classList.add("is-hidden");
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
window.LPP.initPaginate?.();
window.LPP.initCart?.();
window.lucide?.createIcons();
