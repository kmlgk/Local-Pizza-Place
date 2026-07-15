/**
 * Scroll-reveal engine (AOS-like). Works on any element with [data-reveal],
 * optional [data-reveal-delay] (ms) and [data-reveal-once="false"] to replay.
 * Falls back to fully visible content if IntersectionObserver is unsupported.
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {
function initReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          const delay = Number(el.dataset.revealDelay || 0);
          window.setTimeout(() => el.classList.add("is-revealed"), delay);
          if (el.dataset.revealOnce !== "false") io.unobserve(el);
        } else if (el.dataset.revealOnce === "false") {
          el.classList.remove("is-revealed");
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el) => io.observe(el));
}

window.LPP = window.LPP || {};
window.LPP.initReveal = initReveal;
})();
