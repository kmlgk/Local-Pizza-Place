/**
 * Lightweight "add to order" feedback: bumps the header cart badge, flashes
 * the clicked button to a success state, and fires a toast. No real cart
 * state/persistence — purely the interaction feedback layer.
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {
function initCart() {
  const buttons = document.querySelectorAll("[data-add-to-cart]");
  if (!buttons.length) return;

  const badges = document.querySelectorAll("[data-cart-count]");
  let count = Number(badges[0]?.textContent || 0);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      count += 1;
      badges.forEach((badge) => {
        badge.textContent = String(count);
        if (!reduceMotion) {
          badge.animate(
            [{ transform: "scale(1)" }, { transform: "scale(1.6)" }, { transform: "scale(1)" }],
            { duration: 380, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
          );
        }
      });

      const card = btn.closest("article");
      const name = card?.querySelector("h3")?.textContent?.trim() || "Item";

      if (!reduceMotion) {
        btn.animate(
          [{ transform: "scale(1)" }, { transform: "scale(0.94)" }, { transform: "scale(1)" }],
          { duration: 220, easing: "ease-out" }
        );
      }

      if (!btn.dataset.busy) {
        btn.dataset.busy = "true";
        const original = btn.innerHTML;
        btn.style.backgroundImage = "none";
        btn.style.backgroundColor = "rgb(var(--color-success))";
        btn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i> Added';
        window.lucide?.createIcons();
        window.setTimeout(() => {
          btn.style.backgroundImage = "";
          btn.style.backgroundColor = "";
          btn.innerHTML = original;
          window.lucide?.createIcons();
          delete btn.dataset.busy;
        }, 1100);
      }

      window.dispatchEvent(
        new CustomEvent("stackly:toast", { detail: { type: "success", message: `${name} added to your order.` } })
      );
    });
  });
}

window.LPP = window.LPP || {};
window.LPP.initCart = initCart;
})();
