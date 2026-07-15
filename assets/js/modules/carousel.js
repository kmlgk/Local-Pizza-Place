/**
 * Lightweight auto-advancing carousel.
 * Markup contract:
 * <div data-carousel data-carousel-autoplay="5000">
 *   <div class="overflow-hidden">
 *     <div data-carousel-track class="flex">
 *       <div data-carousel-slide>...</div>  (one per item)
 *     </div>
 *   </div>
 *   <button data-carousel-prev></button>
 *   <button data-carousel-next></button>
 *   <div data-carousel-dots></div>
 * </div>
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {
function initCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const track = root.querySelector("[data-carousel-track]");
    const slides = [...root.querySelectorAll("[data-carousel-slide]")];
    const dotsWrap = root.querySelector("[data-carousel-dots]");
    const prevBtn = root.querySelector("[data-carousel-prev]");
    const nextBtn = root.querySelector("[data-carousel-next]");
    if (!track || !slides.length) return;

    let index = 0;
    let timer = null;
    const autoplayMs = Number(root.dataset.carouselAutoplay || 0);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.className = "w-2.5 h-2.5 rounded-full transition-colors bg-border";
      dot.addEventListener("click", () => goTo(i, true));
      dotsWrap?.appendChild(dot);
      return dot;
    });

    function slidesPerView() {
      const w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 640) return 2;
      return 1;
    }

    function update() {
      const perView = slidesPerView();
      const maxIndex = Math.max(slides.length - perView, 0);
      index = Math.min(index, maxIndex);
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap || "0");
      track.style.transform = `translateX(-${index * (slideWidth + gap)}px)`;
      dots.forEach((d, i) => d.classList.toggle("bg-primary", i === index));
      dots.forEach((d, i) => d.classList.toggle("bg-border", i !== index));
      prevBtn && (prevBtn.disabled = index === 0);
      nextBtn && (nextBtn.disabled = index >= maxIndex);
    }

    function goTo(i, userInitiated) {
      const perView = slidesPerView();
      const maxIndex = Math.max(slides.length - perView, 0);
      index = ((i % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);
      update();
      if (userInitiated) restartAutoplay();
    }

    function next() {
      const perView = slidesPerView();
      const maxIndex = Math.max(slides.length - perView, 0);
      goTo(index >= maxIndex ? 0 : index + 1);
    }

    function startAutoplay() {
      if (!autoplayMs || reduceMotion) return;
      timer = window.setInterval(next, autoplayMs);
    }
    function stopAutoplay() {
      if (timer) window.clearInterval(timer);
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    prevBtn?.addEventListener("click", () => goTo(index - 1, true));
    nextBtn?.addEventListener("click", () => goTo(index + 1, true));
    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);

    window.addEventListener("resize", update);
    update();
    startAutoplay();
  });
}

window.LPP = window.LPP || {};
window.LPP.initCarousels = initCarousels;
})();
