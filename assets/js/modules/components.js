/**
 * Behavior for reusable UI components: Modal, Drawer, Dropdown, Tabs,
 * Accordion, Toast, Tooltip. All driven by data-attributes so any page
 * can opt in without extra JS.
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {

/* ---------- Modal ---------- */
function initModals() {
  document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modal = document.getElementById(trigger.dataset.modalOpen);
      openOverlay(modal);
    });
  });
  document.querySelectorAll("[data-modal]").forEach((modal) => {
    modal.querySelectorAll("[data-modal-close]").forEach((btn) =>
      btn.addEventListener("click", () => closeOverlay(modal))
    );
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeOverlay(modal);
    });
  });
}

function openOverlay(el) {
  if (!el) return;
  el.classList.remove("hidden");
  requestAnimationFrame(() => {
    el.classList.remove("opacity-0");
    el.querySelector(".modal-panel, .drawer-panel")?.classList.remove(
      "opacity-0", "scale-95", "translate-x-full", "-translate-x-full", "translate-y-full"
    );
  });
  document.body.classList.add("overflow-hidden");
  el.dataset.lastFocus = document.activeElement?.id || "";
  el.querySelector("[data-autofocus]")?.focus();
}

function closeOverlay(el) {
  if (!el) return;
  const panel = el.querySelector(".modal-panel, .drawer-panel");
  panel?.classList.add("opacity-0", "scale-95");
  el.classList.add("opacity-0");
  window.setTimeout(() => el.classList.add("hidden"), 250);
  document.body.classList.remove("overflow-hidden");
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.querySelectorAll("[data-modal]:not(.hidden), [data-drawer]:not(.hidden)").forEach(closeOverlay);
});

/* ---------- Drawer ---------- */
function initDrawers() {
  document.querySelectorAll("[data-drawer-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const drawer = document.getElementById(trigger.dataset.drawerOpen);
      openOverlay(drawer);
    });
  });
  document.querySelectorAll("[data-drawer]").forEach((drawer) => {
    drawer.querySelectorAll("[data-drawer-close]").forEach((btn) =>
      btn.addEventListener("click", () => closeOverlay(drawer))
    );
    drawer.addEventListener("click", (e) => {
      if (e.target === drawer) closeOverlay(drawer);
    });
  });
}

/* ---------- Dropdown ---------- */
function initDropdowns() {
  document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
    const trigger = dropdown.querySelector("[data-dropdown-trigger]");
    const panel = dropdown.querySelector("[data-dropdown-panel]");
    if (!trigger || !panel) return;

    const close = () => {
      panel.classList.add("opacity-0", "pointer-events-none", "scale-95");
      trigger.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      panel.classList.remove("opacity-0", "pointer-events-none", "scale-95");
      trigger.setAttribute("aria-expanded", "true");
    };

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      document.querySelectorAll("[data-dropdown-panel]").forEach((p) => p !== panel && p.classList.add("opacity-0", "pointer-events-none", "scale-95"));
      isOpen ? close() : open();
    });
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) close();
    });
  });
}

/* ---------- Tabs ---------- */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((tabGroup) => {
    const buttons = [...tabGroup.querySelectorAll("[data-tab-trigger]")];
    const panels = [...tabGroup.querySelectorAll("[data-tab-panel]")];

    function activate(name) {
      buttons.forEach((b) => {
        const active = b.dataset.tabTrigger === name;
        b.setAttribute("aria-selected", String(active));
        b.classList.toggle("bg-primary", active);
        b.classList.toggle("text-white", active);
        b.classList.toggle("text-muted", !active);
      });
      panels.forEach((p) => p.classList.toggle("hidden", p.dataset.tabPanel !== name));
    }

    buttons.forEach((btn) =>
      btn.addEventListener("click", () => {
        activate(btn.dataset.tabTrigger);
        if (tabGroup.dataset.tabsHashSync === "true") history.replaceState(null, "", `#${btn.dataset.tabTrigger}`);
      })
    );

    if (tabGroup.dataset.tabsHashSync === "true") {
      window.addEventListener("hashchange", () => {
        const name = location.hash.slice(1);
        if (buttons.find((b) => b.dataset.tabTrigger === name)) activate(name);
      });
    }

    const hashName = location.hash.slice(1);
    const initial = buttons.find((b) => b.dataset.tabTrigger === hashName) ? hashName : buttons[0]?.dataset.tabTrigger;
    if (initial) activate(initial);
  });
}

/* ---------- Accordion ---------- */
function initAccordions() {
  document.querySelectorAll("[data-accordion]").forEach((accordion) => {
    const items = [...accordion.querySelectorAll("[data-accordion-item]")];
    items.forEach((item) => {
      const trigger = item.querySelector("[data-accordion-trigger]");
      const panel = item.querySelector("[data-accordion-panel]");
      const icon = item.querySelector("[data-accordion-icon]");
      trigger?.addEventListener("click", () => {
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        if (accordion.dataset.accordionMulti !== "true") {
          items.forEach((other) => {
            if (other === item) return;
            other.querySelector("[data-accordion-trigger]")?.setAttribute("aria-expanded", "false");
            const otherPanel = other.querySelector("[data-accordion-panel]");
            if (otherPanel) otherPanel.style.maxHeight = null;
            other.querySelector("[data-accordion-icon]")?.classList.remove("rotate-180");
          });
        }
        trigger.setAttribute("aria-expanded", String(!isOpen));
        icon?.classList.toggle("rotate-180", !isOpen);
        if (panel) panel.style.maxHeight = isOpen ? null : `${panel.scrollHeight}px`;
      });
    });
  });
}

/* ---------- Toast ---------- */
function ensureToastContainer() {
  let container = document.querySelector("[data-toast-container]");
  if (!container) {
    container = document.createElement("div");
    container.setAttribute("data-toast-container", "");
    container.setAttribute("aria-live", "polite");
    container.className = "fixed top-4 end-4 z-[100] flex flex-col gap-3 w-[calc(100%-2rem)] max-w-sm";
    document.body.appendChild(container);
  }
  return container;
}

const toastStyles = {
  success: { icon: "check-circle", classes: "border-success/30 text-success" },
  error: { icon: "alert-circle", classes: "border-danger/30 text-danger" },
  warning: { icon: "alert-triangle", classes: "border-warning/30 text-warning" },
  info: { icon: "info", classes: "border-primary/30 text-primary" },
};

function showToast(message, type = "success") {
  const container = ensureToastContainer();
  const style = toastStyles[type] || toastStyles.info;
  const toast = document.createElement("div");
  toast.className = `toast glass shadow-elevated rounded-lg p-4 flex items-start gap-3 border opacity-0 translate-y-2 ${style.classes}`;
  toast.innerHTML = `
    <i data-lucide="${style.icon}" class="w-5 h-5 shrink-0 mt-0.5"></i>
    <p class="text-sm font-medium text-ink flex-1">${message}</p>
    <button type="button" aria-label="Dismiss notification" class="shrink-0 text-muted hover:text-ink">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>`;
  container.appendChild(toast);
  window.lucide?.createIcons();

  requestAnimationFrame(() => toast.classList.remove("opacity-0", "translate-y-2"));

  const dismiss = () => {
    toast.classList.add("opacity-0", "translate-y-2");
    window.setTimeout(() => toast.remove(), 300);
  };
  toast.querySelector("button")?.addEventListener("click", dismiss);
  window.setTimeout(dismiss, 5000);
}

function initToastBridge() {
  window.addEventListener("stackly:toast", (e) => showToast(e.detail?.message, e.detail?.type));
  document.querySelectorAll("[data-toast-trigger]").forEach((btn) => {
    btn.addEventListener("click", () => showToast(btn.dataset.toastMessage || "Notification", btn.dataset.toastType || "info"));
  });
}

function initComponents() {
  initModals();
  initDrawers();
  initDropdowns();
  initTabs();
  initAccordions();
  initToastBridge();
}

window.LPP = window.LPP || {};
window.LPP.initComponents = initComponents;
window.LPP.showToast = showToast;
})();
