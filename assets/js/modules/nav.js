/**
 * Sticky header shrink-on-scroll, mobile drawer menu, and RTL direction toggle.
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {
function initNav() {
  const header = document.querySelector("[data-site-header]");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const menuToggles = document.querySelectorAll("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const menuBackdrop = document.querySelector("[data-menu-backdrop]");

  function setMenu(open) {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle("menu-open", open);
    menuToggles.forEach((btn) => {
      btn.setAttribute("aria-expanded", String(open));
      btn.querySelector(".icon-menu-open")?.classList.toggle("hidden", open);
      btn.querySelector(".icon-menu-close")?.classList.toggle("hidden", !open);
    });
    menuBackdrop?.classList.toggle("menu-open", open);
    menuBackdrop?.classList.toggle("opacity-0", !open);
    menuBackdrop?.classList.toggle("pointer-events-none", !open);
    document.documentElement.classList.toggle("menu-locked", open);
    document.body.classList.toggle("overflow-hidden", open);
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
  }

  menuToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isOpen = mobileMenu?.classList.contains("menu-open");
      setMenu(!isOpen);
    });
  });
  menuBackdrop?.addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
  mobileMenu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // Accordion submenus inside the mobile menu — independent (not exclusive),
  // so opening one group doesn't collapse the others.
  mobileMenu?.querySelectorAll("[data-submenu-toggle]").forEach((btn) => {
    const panel = btn.nextElementSibling;
    btn.addEventListener("click", () => {
      const isOpen = panel.classList.contains("submenu-open");
      panel.classList.toggle("submenu-open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  // RTL demo toggle
  document.querySelectorAll("[data-dir-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
      document.documentElement.dir = next;
      localStorage.setItem("stackly-dir", next);
      btn.setAttribute("aria-pressed", String(next === "rtl"));
    });
  });
  const savedDir = localStorage.getItem("stackly-dir");
  if (savedDir) document.documentElement.dir = savedDir;

  // Active nav link — also highlights the parent dropdown trigger, if any,
  // so e.g. visiting login.html shows both "Login" and its "Pages" trigger active.
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("text-primary", "font-semibold");
      link.setAttribute("aria-current", "page");
      const trigger = link.closest("[data-dropdown]")?.querySelector("[data-dropdown-trigger]");
      trigger?.classList.add("text-primary");

      // Mobile accordion equivalent — also auto-expand the group so the
      // current page's link is visible without an extra tap.
      const submenuGroup = link.closest("[data-submenu-group]");
      if (submenuGroup) {
        const toggle = submenuGroup.querySelector("[data-submenu-toggle]");
        const panel = submenuGroup.querySelector("[data-submenu-panel]");
        toggle?.classList.add("text-primary");
        panel?.classList.add("submenu-open");
        toggle?.setAttribute("aria-expanded", "true");
      }
    }
  });

  // Smooth page-leave transition for internal navigation links
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      const isInternalPage = href && !href.startsWith("#") && !href.startsWith("http") && !href.startsWith("tel:") && !href.startsWith("mailto:");
      const isSpecialTrigger = link.hasAttribute("data-modal-open") || link.hasAttribute("data-drawer-open") || link.target === "_blank";
      if (!isInternalPage || isSpecialTrigger) return;

      link.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        document.body.classList.add("page-leaving");
        window.setTimeout(() => {
          window.location.href = href;
        }, 200);
      });
    });
  }
}

window.LPP = window.LPP || {};
window.LPP.initNav = initNav;
})();
