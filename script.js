// ✅ EDIT THESE
const HER_NAME = "princess";         // e.g. "Chloe"
const YOUR_NAME = "joshua";      // put your name
const START_DATE = "2025-12-01T00:00:00+08:00"; // when you became official (SGT)

// Optional secret message:
const SECRET_MESSAGE = "You make me feel safe, seen, and ridiculously happy. Happy one month 🤍";

document.getElementById("herName").textContent = HER_NAME;
document.getElementById("yourName").textContent = YOUR_NAME;
document.getElementById("secretText").textContent = SECRET_MESSAGE;

function updateTimer(){
  const start = new Date(START_DATE);
  const now = new Date();
  const diff = Math.max(0, now - start);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("mins").textContent = mins;
}

updateTimer();
setInterval(updateTimer, 30 * 1000);

document.getElementById("today").textContent =
  new Date().toLocaleDateString(undefined, { year:"numeric", month:"long", day:"numeric" });

// Secret reveal
const btn = document.getElementById("secretBtn");
const secret = document.getElementById("secret");
btn.addEventListener("click", () => {
  secret.hidden = !secret.hidden;
  btn.textContent = secret.hidden ? "Open secret message" : "Hide secret message";
});

// Lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
document.getElementById("gallery").addEventListener("click", (e) => {
  const btn = e.target.closest(".photo");
  if(!btn) return;
  const src = btn.getAttribute("data-src");
  lightboxImg.src = src;
  lightbox.style.display = "grid";
  lightbox.setAttribute("aria-hidden", "false");
});
document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if(e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeLightbox(); });

function closeLightbox(){
  lightbox.style.display = "none";
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}
