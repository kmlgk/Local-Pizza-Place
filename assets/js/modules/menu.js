/**
 * Full Menu — data-driven render engine (glassmorphism cards, sliding tab
 * indicator, skeleton loading, in-memory pagination). Reads window.LPP_MENU
 * (see assets/js/menu-data.js) and mounts everything into #menu-app, so the
 * 29 menu items live in one place instead of duplicated markup per category.
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {
const PER_PAGE = 6;

function star(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function cardHTML(item, index) {
  return `
    <article data-reveal="fade-up" data-reveal-delay="${(index % 3) * 60}" class="group relative rounded-2xl overflow-hidden border border-border bg-surface/70 backdrop-blur-md card-elevate">
      <div class="relative overflow-hidden">
        <img src="${item.img}" alt="${item.alt}" class="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" width="450" height="280" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span class="absolute top-2.5 start-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${item.badgeClass} shadow-soft">${item.badge}</span>
        <button type="button" data-favorite-toggle="${item.name}" aria-label="Add ${item.name} to favorites" aria-pressed="false" class="absolute top-2.5 end-2.5 w-8 h-8 rounded-full glass text-muted flex items-center justify-center transition-all duration-300 hover:scale-110">
          <i data-lucide="heart" class="w-3.5 h-3.5"></i>
        </button>
      </div>
      <div class="p-4">
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-heading font-semibold text-sm">${item.name}</h3>
          <span class="font-heading font-bold text-primary text-sm shrink-0">$${item.price.toFixed(2)}</span>
        </div>
        <div class="flex items-center gap-1 mt-1"><span class="text-warning text-xs leading-none">${star(item.rating)}</span><span class="text-[11px] font-semibold text-muted">${item.rating}</span></div>
        <p class="text-xs text-muted mt-1.5 line-clamp-2">${item.desc}</p>
        <button type="button" data-add-to-cart data-ripple class="w-full mt-3 py-2 rounded-md bg-gradient-brand text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95">
          <i data-lucide="plus" class="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90"></i> Add to Order
        </button>
      </div>
    </article>`;
}

function skeletonCardHTML() {
  return `
    <div class="rounded-2xl overflow-hidden border border-border bg-surface">
      <div class="skeleton h-44 w-full"></div>
      <div class="p-4 space-y-2.5">
        <div class="skeleton h-4 w-2/3 rounded"></div>
        <div class="skeleton h-3 w-1/3 rounded"></div>
        <div class="skeleton h-3 w-full rounded"></div>
        <div class="skeleton h-8 w-full rounded-md mt-2"></div>
      </div>
    </div>`;
}

function pageButtonHTML({ label, target, active, disabled, icon }) {
  const activeClasses = "w-9 h-9 rounded-md bg-gradient-brand text-white flex items-center justify-center font-semibold text-xs shadow-glow";
  const idleClasses = "w-9 h-9 rounded-md border border-border flex items-center justify-center hover:bg-surface-2 font-semibold text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed";
  const inner = icon ? `<i data-lucide="${icon}" class="w-4 h-4 rtl:rotate-180"></i>` : label;
  return `<button type="button" data-page="${target}" ${disabled ? "disabled" : ""} class="${active ? activeClasses : idleClasses}">${inner}</button>`;
}

function initMenu() {
  const root = document.getElementById("menu-app");
  const data = window.LPP_MENU;
  if (!root || !data) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeCategory = data.categories[0].id;
  let page = 1;

  root.innerHTML = `
    <div data-tabs-wrap class="relative flex flex-wrap justify-center gap-1 p-1.5 rounded-full glass max-w-max mx-auto" role="tablist" aria-label="Menu categories">
      <span data-tab-indicator class="absolute inset-y-1.5 rounded-full bg-gradient-brand shadow-glow transition-all duration-300" style="left:6px; width:0;" aria-hidden="true"></span>
      ${data.categories
        .map(
          (c) =>
            `<button type="button" data-cat="${c.id}" role="tab" class="relative z-10 px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-colors duration-300">
              <i data-lucide="${c.icon}" class="w-4 h-4"></i>${c.label}
            </button>`
        )
        .join("")}
    </div>
    <div data-grid class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"></div>
    <nav data-pagination aria-label="Menu pagination" class="flex items-center justify-center gap-2 mt-10"></nav>
  `;

  const grid = root.querySelector("[data-grid]");
  const pagination = root.querySelector("[data-pagination]");
  const indicator = root.querySelector("[data-tab-indicator]");
  const tabButtons = [...root.querySelectorAll("[data-cat]")];

  // Tab icons must exist before the indicator is measured — Lucide swaps
  // <i data-lucide> placeholders for inline SVGs, which changes button width.
  window.lucide?.createIcons();

  function moveIndicator(btn) {
    indicator.style.left = btn.offsetLeft + "px";
    indicator.style.width = btn.offsetWidth + "px";
  }

  function syncIndicator() {
    const active = tabButtons.find((b) => b.dataset.cat === activeCategory);
    if (active) moveIndicator(active);
  }

  function rehydrate() {
    window.lucide?.createIcons();
    window.LPP.initFavorites?.();
    window.LPP.initRipple?.();
    window.LPP.initCart?.();
    window.LPP.initReveal?.();
    syncIndicator();
  }

  function setActiveTabStyles() {
    tabButtons.forEach((b) => {
      const active = b.dataset.cat === activeCategory;
      b.classList.toggle("text-white", active);
      b.classList.toggle("text-muted", !active);
      b.setAttribute("aria-selected", String(active));
    });
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }
    let html = pageButtonHTML({ target: page - 1, disabled: page === 1, icon: "chevron-left" });
    for (let p = 1; p <= totalPages; p++) {
      html += pageButtonHTML({ label: String(p), target: p, active: p === page });
    }
    html += pageButtonHTML({ target: page + 1, disabled: page === totalPages, icon: "chevron-right" });
    pagination.innerHTML = html;
    pagination.querySelectorAll("[data-page]").forEach((btn) => {
      btn.addEventListener("click", () => {
        page = Number(btn.dataset.page);
        renderGrid(false);
        root.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      });
    });
  }

  function renderGrid(showSkeletonFirst) {
    const items = data.items.filter((it) => it.category === activeCategory);
    const totalPages = Math.max(Math.ceil(items.length / PER_PAGE), 1);
    page = Math.min(page, totalPages);
    const pageItems = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const paint = () => {
      grid.innerHTML = pageItems.map(cardHTML).join("");
      renderPagination(totalPages);
      rehydrate();
    };

    if (showSkeletonFirst && !reduceMotion) {
      grid.innerHTML = Array.from({ length: Math.min(pageItems.length, PER_PAGE) }).map(skeletonCardHTML).join("");
      window.setTimeout(paint, 380);
    } else {
      paint();
    }
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.cat === activeCategory) return;
      activeCategory = btn.dataset.cat;
      page = 1;
      setActiveTabStyles();
      moveIndicator(btn);
      renderGrid(true);
    });
  });

  setActiveTabStyles();
  moveIndicator(tabButtons[0]);
  renderGrid(true);

  window.addEventListener("resize", syncIndicator);
}

window.LPP = window.LPP || {};
window.LPP.initMenu = initMenu;
})();
