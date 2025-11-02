// Minimal EmailJS integration for the contact form
(function () {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("send-button");

  if (!form) return;

  // TODO: replace with your actual EmailJS keys
  const EMAILJS_PUBLIC_KEY = "Le2a6272rG99gqXc3_RxL";
  const EMAILJS_SERVICE_ID = "service_1hwjpb4";
  const EMAILJS_TEMPLATE_ID = "template_s6wwn6l";

  // Lazy guard if SDK not loaded
  if (window.emailjs && typeof window.emailjs.init === "function") {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.style.opacity = isSubmitting ? "0.8" : "1";
    const span = submitBtn.querySelector("span");
    if (span)
      span.textContent = isSubmitting ? "Отправка…" : "Отправить сообщение";
  }

  function showAlert(message, type) {
    let alertEl = document.querySelector(".form-alert");
    if (!alertEl) {
      alertEl = document.createElement("div");
      alertEl.className = "form-alert";
      form.appendChild(alertEl);
    }
    alertEl.className =
      "form-alert " + (type === "success" ? "success" : "error");
    alertEl.textContent = message;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name") || "",
      email: formData.get("email") || "",
      subject: formData.get("subject") || "",
      message: formData.get("message") || "",
    };

    if (!payload.name || !payload.email || !payload.message) {
      showAlert("Пожалуйста, заполните имя, email и сообщение.", "error");
      return;
    }

    if (
      !window.emailjs ||
      !EMAILJS_PUBLIC_KEY ||
      !EMAILJS_SERVICE_ID ||
      !EMAILJS_TEMPLATE_ID
    ) {
      showAlert("EmailJS не настроен. Замените ключи в script.js.", "error");
      return;
    }

    try {
      setSubmitting(true);
      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        payload
      );
      showAlert("Спасибо! Сообщение отправлено.", "success");
      form.reset();
    } catch (err) {
      showAlert("Не удалось отправить. Попробуйте позже.", "error");
    } finally {
      setSubmitting(false);
    }
  });
})();
