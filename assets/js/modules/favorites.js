/**
 * Favorites: heart-toggle buttons persisted to localStorage, shared across
 * pages (index.html menu cards <-> dashboard.html Favorites tab).
 * Usage: <button data-favorite-toggle="Classic Margherita"><i data-lucide="heart"></i></button>
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {
const STORAGE_KEY = "lpp-favorites";
const DEFAULT_FAVORITES = ["Classic Margherita", "Spicy Pepperoni"];

function getFavorites() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return DEFAULT_FAVORITES;
  try {
    return JSON.parse(raw) || [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function paintButton(btn, isFav, animate) {
  const icon = btn.querySelector("[data-lucide]");
  btn.setAttribute("aria-pressed", String(isFav));
  btn.classList.toggle("text-danger", isFav);
  btn.classList.toggle("bg-danger/10", isFav);
  btn.classList.toggle("text-muted", !isFav);
  if (icon) icon.setAttribute("fill", isFav ? "currentColor" : "none");
  if (animate && isFav && !reduceMotion) {
    btn.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.5)" },
        { transform: "scale(0.9)" },
        { transform: "scale(1)" },
      ],
      { duration: 420, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
    );
  }
}

function initFavorites() {
  const favorites = getFavorites();

  document.querySelectorAll("[data-favorite-toggle]").forEach((btn) => {
    const name = btn.dataset.favoriteToggle;
    paintButton(btn, favorites.includes(name));

    btn.addEventListener("click", () => {
      const current = getFavorites();
      const idx = current.indexOf(name);
      const nowFav = idx === -1;
      if (nowFav) current.push(name);
      else current.splice(idx, 1);
      saveFavorites(current);
      paintButton(btn, nowFav, true);
      window.dispatchEvent(
        new CustomEvent("stackly:toast", {
          detail: { type: nowFav ? "success" : "info", message: nowFav ? `${name} added to favorites.` : `${name} removed from favorites.` },
        })
      );
    });
  });
}

window.LPP = window.LPP || {};
window.LPP.initFavorites = initFavorites;
})();
