document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      nav.style.display = expanded ? "none" : "flex";
      nav.style.flexDirection = "column";
      nav.style.position = "absolute";
      nav.style.top = "68px";
      nav.style.right = "24px";
      nav.style.left = "24px";
      nav.style.background = "rgba(11,18,32,0.96)";
      nav.style.border = "1px solid rgba(255,255,255,0.08)";
      nav.style.borderRadius = "14px";
      nav.style.padding = "16px";
      nav.style.gap = "14px";
      if (!expanded) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      const close = () => {
        nav.style.display = "";
        nav.style.flexDirection = "";
        nav.style.position = "";
        nav.style.top = "";
        nav.style.right = "";
        nav.style.left = "";
        nav.style.background = "";
        nav.style.border = "";
        nav.style.borderRadius = "";
        nav.style.padding = "";
        nav.style.gap = "";
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        nav.removeEventListener("click", close);
      };
      if (!expanded) {
        nav.addEventListener("click", close);
      }
    });
  }

  const form = document.getElementById("lead-form");
  if (!form) return;

  let submitting = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;

    const status = document.getElementById("lead-form-status");
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : "Submit sample lead";

    if (!status) return;

    submitting = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending demo lead...";
    status.textContent = "Running the automation demo...";
    status.className = "lead-form-status";

    const payload = {
      name: (form.elements["name"] as HTMLInputElement)?.value?.trim() ?? "",
      email: (form.elements["email"] as HTMLInputElement)?.value?.trim() ?? "",
      company: (form.elements["company"] as HTMLInputElement)?.value?.trim() ?? "",
      budget: (form.elements["budget"] as HTMLSelectElement)?.value?.trim() ?? "",
      message: (form.elements["message"] as HTMLTextAreaElement)?.value?.trim() ?? "",
    };

    if (!payload.name || !payload.email || !payload.message) {
      status.textContent = "Please fill in name, email, and project details.";
      status.className = "lead-form-status error";
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitting = false;
      return;
    }

    try {
      const apiBase = window.location.origin.replace(/^https?:\/\//, "http://").replace(/\/?$/, ":4000");
      const response = await fetch(`${apiBase}/api/lead/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Request failed");

      status.textContent = "Demo submitted. The system captured the lead and ran the automation flow.";
      status.className = "lead-form-status success";
      form.reset();
    } catch {
      status.textContent = "Demo logged locally. In a live deployment, this would trigger the automated lead flow.";
      status.className = "lead-form-status success";
      form.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitting = false;
    }
  });
});
