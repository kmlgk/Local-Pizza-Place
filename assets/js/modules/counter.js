/**
 * Animated number counters. Usage:
 * <span data-counter data-counter-to="2400" data-counter-suffix="+">0</span>
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animateCounter(el) {
  const to = Number(el.dataset.counterTo || 0);
  const duration = Number(el.dataset.counterDuration || 1800);
  const prefix = el.dataset.counterPrefix || "";
  const suffix = el.dataset.counterSuffix || "";
  const decimals = Number(el.dataset.counterDecimals || 0);
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = to * easeOutExpo(progress);
    el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = `${prefix}${to.toFixed(decimals)}${suffix}`;
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => io.observe(el));
}

window.LPP = window.LPP || {};
window.LPP.initCounters = initCounters;
})();
