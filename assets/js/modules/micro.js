/**
 * Micro-interactions: magnetic buttons + parallax hero blobs.
 * Skips itself on touch devices and prefers-reduced-motion.
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {
function initMicroInteractions() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;
  if (reduceMotion || isTouch) return;

  document.querySelectorAll("[data-magnetic]").forEach((btn) => {
    const strength = Number(btn.dataset.magnetic) || 18;
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });

  const parallaxEls = [...document.querySelectorAll("[data-parallax]")].map((el) => ({
    el,
    speed: Number(el.dataset.parallax) || 0.15,
    active: false,
  }));
  if (parallaxEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = parallaxEls.find((p) => p.el === entry.target);
          if (item) item.active = entry.isIntersecting;
        });
      },
      { rootMargin: "20% 0px 20% 0px" }
    );
    parallaxEls.forEach((p) => io.observe(p.el));

    let ticking = false;
    const applyParallax = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach(({ el, speed, active }) => {
        if (!active) return;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(applyParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
    applyParallax();
  }
}

window.LPP = window.LPP || {};
window.LPP.initMicroInteractions = initMicroInteractions;
})();
