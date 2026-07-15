/**
 * Lightweight, dependency-free form validation.
 * Mark a <form data-validate> and give inputs [data-field="name|email|phone|password"]
 * (or rely on required/type/pattern/minlength attributes). Renders inline
 * success/error messaging in the sibling [data-field-message] element.
 * Plain classic script (not a module) so it also works over file:// — see main.js.
 */
(function () {
const patterns = {
  name: /^[a-zA-Z؀-ۿ\s'-]{2,60}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[\d\s()-]{7,20}$/,
  password: /^.{8,}$/,
};

const messages = {
  valueMissing: "This field is required.",
  name: "Please enter a valid name (letters only, 2+ characters).",
  email: "Please enter a valid email address.",
  phone: "Please enter a valid phone number.",
  password: "Password must be at least 8 characters.",
};

function validateField(field) {
  const wrapper = field.closest("[data-field-wrapper]") || field.parentElement;
  const messageEl = wrapper?.querySelector("[data-field-message]");
  const type = field.dataset.field;
  let valid = true;
  let message = "";

  if (field.required && !field.value.trim()) {
    valid = false;
    message = messages.valueMissing;
  } else if (type && field.value.trim() && patterns[type] && !patterns[type].test(field.value.trim())) {
    valid = false;
    message = messages[type];
  }

  field.setAttribute("aria-invalid", String(!valid));
  wrapper?.classList.toggle("border-danger", !valid);
  wrapper?.classList.toggle("border-success", valid && field.value.trim() !== "");

  if (messageEl) {
    messageEl.textContent = valid ? "" : message;
    messageEl.classList.toggle("hidden", valid);
  }
  return valid;
}

function initForms() {
  document.querySelectorAll("form[data-validate]").forEach((form) => {
    form.setAttribute("novalidate", "");

    form.querySelectorAll("input, textarea, select").forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fields = [...form.querySelectorAll("input, textarea, select")];
      const allValid = fields.map(validateField).every(Boolean);
      const statusEl = form.querySelector("[data-form-status]");

      if (!allValid) {
        statusEl?.classList.remove("hidden");
        if (statusEl) {
          statusEl.textContent = "Please fix the highlighted fields and try again.";
          statusEl.className = "block mt-4 text-sm font-medium text-danger";
        }
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }

      if (statusEl) {
        statusEl.textContent = "Success! Your message has been sent.";
        statusEl.className = "block mt-4 text-sm font-medium text-success";
        statusEl.classList.remove("hidden");
      }
      window.dispatchEvent(new CustomEvent("stackly:toast", {
        detail: { type: "success", message: "Form submitted successfully." },
      }));
      form.reset();
      fields.forEach((f) => f.removeAttribute("aria-invalid"));
    });
  });
}

window.LPP = window.LPP || {};
window.LPP.initForms = initForms;
})();
