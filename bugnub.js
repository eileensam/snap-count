const emailJsPublicKey = "aU6HI4JCxLg-8hB67"
const emailJsServiceId = "service_x6nle47"
const emailJsTemplateId = "template_78ttddv"

// Initialize EmailJS (replace with your public key)
emailjs.init(emailJsPublicKey);

// Grab elements after they exist in the DOM
const openBtn = document.getElementById("bugnubOpen");
const closeBtn = document.getElementById("bugnubClose");
const backdrop = document.getElementById("bugnubBackdrop");
const form = document.getElementById("bugnubForm");

// Open modal
openBtn.addEventListener("click", () => {
  backdrop.style.display = "flex";
});

// Close modal
closeBtn.addEventListener("click", () => {
  backdrop.style.display = "none";
});

// Close if clicking outside modal content
window.addEventListener("click", (e) => {
  if (e.target === backdrop) {
    backdrop.style.display = "none";
  }
});

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(form));

  emailjs.send(emailJsServiceId, emailJsTemplateId, formData)
    .then(() => {
      backdrop.style.display = "none";
      form.reset();
    })
    .catch((err) => {
      console.error("Failed to send feedback:", err);
    });
});
