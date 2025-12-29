// ✅ EDIT THESE
const HER_NAME = "princess";         // e.g. "Chloe"
const YOUR_NAME = "joshua";      // put your name
const START_DATE = "2025-12-01T00:00:00+08:00"; // when you became official (SGT)

// Optional secret message:
const SECRET_MESSAGE = "You make me feel safe, seen, and ridiculously happy. Happy one month 🤍";

document.getElementById("herName").textContent = HER_NAME;
document.getElementById("yourName").textContent = YOUR_NAME;
document.getElementById("secretText").textContent = SECRET_MESSAGE;

const img = document.getElementById("stinky");
const canvas = document.getElementById("stinkyCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let animId = null;
let disintegrated = false;

function resizeCanvasToImage() {
  // Match canvas internal resolution to the *rendered* image size
  const rect = img.getBoundingClientRect();
  canvas.width = Math.round(rect.width);
  canvas.height = Math.round(rect.height);
}

function makeParticles() {
  resizeCanvasToImage();

  // Draw the image onto the canvas so we can read pixels
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  particles = [];

  // Particle density: higher step = fewer particles (faster)
  const step = 4; // try 3 for denser, 6 for lighter
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const i = (y * canvas.width + x) * 4;
      const a = data[i + 3];

      // Only keep non-transparent pixels
      if (a > 20) {
        const r = data[i], g = data[i + 1], b = data[i + 2];

        // Random “push” direction and speed
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 2.2;

        particles.push({
          x, y,
          vx: Math.cos(angle) * speed + (Math.random() * 1.6), // slight right drift
          vy: Math.sin(angle) * speed - (Math.random() * 0.8), // slight up drift
          life: 1,
          decay: 0.008 + Math.random() * 0.02,
          size: step * (0.6 + Math.random() * 0.6),
          color: `rgba(${r},${g},${b},`
        });
      }
    }
  }

  // Clear canvas after sampling
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let alive = 0;

  for (const p of particles) {
    if (p.life <= 0) continue;

    alive++;

    // motion
    p.x += p.vx;
    p.y += p.vy;

    // gravity-ish + turbulence
    p.vy += 0.02;
    p.vx *= 0.995;

    // fade
    p.life -= p.decay;

    ctx.fillStyle = p.color + Math.max(p.life, 0) + ")";
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }

  if (alive > 0) {
    animId = requestAnimationFrame(animate);
  } else {
    cancelAnimationFrame(animId);
    animId = null;
  }
}

function disintegrate() {
  if (disintegrated) return;
  disintegrated = true;

  makeParticles();

  // Hide original image, show particles
  img.style.visibility = "hidden";

  if (animId) cancelAnimationFrame(animId);
  animate();
}

// Optional: click again to reset (nice for demo)
function reset() {
  disintegrated = false;
  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  img.style.visibility = "visible";
}

img.addEventListener("click", () => {
  if (!disintegrated) disintegrate();
  else reset(); // remove this line if you don't want reset on 2nd click
});

// Keep canvas aligned on resize
window.addEventListener("resize", () => {
  if (!disintegrated) resizeCanvasToImage();
});

// If image loads later, size correctly
img.addEventListener("load", resizeCanvasToImage);
if (img.complete) resizeCanvasToImage();


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

