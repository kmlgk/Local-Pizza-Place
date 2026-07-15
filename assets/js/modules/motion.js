/**
 * GSAP + ScrollTrigger + Lenis integration layer.
 * - Lenis drives buttery inertia scrolling and feeds GSAP's ticker so
 *   ScrollTrigger stays perfectly in sync with the virtual scroll position.
 * - [data-parallax="0.15"] elements get a scroll-scrubbed parallax (replaces
 *   the plain scroll-listener version for a smoother, frame-perfect result).
 * - .pizza-3d gets a bounded sway (rotateY -20..20, rotateX 8..14) instead of
 *   a full spin, so the flat product photo never goes edge-on and vanishes.
 * - [data-gsap-hero] wraps a choreographed entrance timeline for the
 *   elements marked data-hero-badge / -heading / -copy / -actions / -social
 *   / -image inside it.
 * All of this is skipped under prefers-reduced-motion, and skipped entirely
 * if the CDN libraries fail to load (site still works, just without it).
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {
function initMotion() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined";

  if (hasGsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (typeof window.Lenis !== "undefined" && !reduceMotion) {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    if (hasGsap) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
    window.__lenis = lenis;
  }

  if (!hasGsap || reduceMotion) return;

  document.querySelectorAll("[data-parallax]").forEach((el) => {
    const speed = Number(el.dataset.parallax) || 0.15;
    gsap.to(el, {
      yPercent: speed * -60,
      ease: "none",
      scrollTrigger: {
        trigger: el.closest("section") || el,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      },
    });
  });

  const pizza = document.querySelector(".pizza-3d");
  if (pizza) {
    // Bounded sway, never a full rotation — a flat photo going edge-on at
    // 90/270deg would flicker/vanish, so we ping-pong within a safe arc instead.
    gsap.fromTo(
      pizza,
      { rotateY: -28, rotateX: 6 },
      { rotateY: 28, rotateX: 18, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1 }
    );
    gsap.to(pizza.closest(".pizza-3d-wrap"), {
      y: -18,
      scale: 1.05,
      duration: 2.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  const hero = document.querySelector("[data-gsap-hero]");
  if (hero) {
    const order = ["[data-hero-badge]", "[data-hero-heading]", "[data-hero-copy]", "[data-hero-actions]", "[data-hero-social]"];
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });
    order.forEach((sel, i) => {
      const el = hero.querySelector(sel);
      if (el) tl.from(el, { y: 24, opacity: 0 }, i === 0 ? undefined : "-=0.55");
    });
    const image = hero.querySelector("[data-hero-image]");
    if (image) tl.from(image, { x: 40, opacity: 0 }, "-=0.9");
  }
}

window.LPP = window.LPP || {};
window.LPP.initMotion = initMotion;
})();
