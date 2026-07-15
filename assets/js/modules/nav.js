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

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const menuBackdrop = document.querySelector("[data-menu-backdrop]");

  function setMenu(open) {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle("translate-x-0", open);
    mobileMenu.classList.toggle(document.dir === "rtl" ? "translate-x-full" : "-translate-x-full", !open);
    menuToggle?.setAttribute("aria-expanded", String(open));
    menuBackdrop?.classList.toggle("opacity-0", !open);
    menuBackdrop?.classList.toggle("pointer-events-none", !open);
    document.body.classList.toggle("overflow-hidden", open);
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
  });
  menuBackdrop?.addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
  mobileMenu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

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

  // Active nav link
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("text-primary", "font-semibold");
      link.setAttribute("aria-current", "page");
    }
  });
}

window.LPP = window.LPP || {};
window.LPP.initNav = initNav;
})();
