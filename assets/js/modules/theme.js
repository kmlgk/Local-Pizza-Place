/**
 * Dark / light theme toggle. Persists to localStorage, respects system
 * preference on first visit, and updates every [data-theme-toggle] button.
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {
  const STORAGE_KEY = "stackly-theme";

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
    document
      .querySelectorAll("[data-theme-toggle]")
      .forEach((btn) => btn.setAttribute("aria-pressed", String(theme === "dark")));
  }

  function initTheme() {
    applyTheme(getPreferredTheme());

    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
      });
    });

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? "dark" : "light");
    });
  }

  window.LPP = window.LPP || {};
  window.LPP.initTheme = initTheme;
})();
