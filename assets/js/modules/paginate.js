/**
 * Lightweight client-side pagination for card grids.
 * Markup contract:
 * <div data-paginate data-per-page="6">
 *   <div data-paginate-items class="grid ...">
 *     <article data-paginate-item>...</article>  (repeat)
 *   </div>
 *   <nav data-paginate-controls></nav>
 * </div>
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {
function initPaginate() {
  document.querySelectorAll("[data-paginate]").forEach((root) => {
    const perPage = Number(root.dataset.perPage || 6);
    const items = [...root.querySelectorAll("[data-paginate-item]")];
    const controls = root.querySelector("[data-paginate-controls]");
    if (!items.length || !controls) return;

    const totalPages = Math.max(Math.ceil(items.length / perPage), 1);
    let page = 1;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function render(animate) {
      items.forEach((item, i) => {
        const itemPage = Math.floor(i / perPage) + 1;
        const show = itemPage === page;
        item.classList.toggle("hidden", !show);
        if (show && animate && !reduceMotion) {
          item.animate(
            [
              { opacity: 0, transform: "translateY(10px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 350, easing: "cubic-bezier(0.16, 1, 0.3, 1)", delay: (i % perPage) * 30 }
          );
        }
      });
      buildControls();
    }

    function goTo(p) {
      page = Math.min(Math.max(p, 1), totalPages);
      render(true);
      root.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    }

    function buildControls() {
      controls.innerHTML = "";
      if (totalPages <= 1) return;

      const makeNavBtn = (label, iconName, disabled, onClick) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("aria-label", label);
        btn.className =
          "w-9 h-9 rounded-md border border-border flex items-center justify-center hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors";
        btn.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4 rtl:rotate-180"></i>`;
        btn.disabled = disabled;
        btn.addEventListener("click", onClick);
        return btn;
      };

      controls.appendChild(makeNavBtn("Previous page", "chevron-left", page === 1, () => goTo(page - 1)));

      for (let p = 1; p <= totalPages; p++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = String(p);
        btn.setAttribute("aria-current", p === page ? "page" : "false");
        btn.className =
          p === page
            ? "w-9 h-9 rounded-md bg-gradient-brand text-white flex items-center justify-center font-semibold text-xs shadow-glow"
            : "w-9 h-9 rounded-md border border-border flex items-center justify-center hover:bg-surface-2 font-semibold text-xs transition-colors";
        btn.addEventListener("click", () => goTo(p));
        controls.appendChild(btn);
      }

      controls.appendChild(makeNavBtn("Next page", "chevron-right", page === totalPages, () => goTo(page + 1)));

      window.lucide?.createIcons();
    }

    render(false);
  });
}

window.LPP = window.LPP || {};
window.LPP.initPaginate = initPaginate;
})();
