const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("visible"), index * 35);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach(item => observer.observe(item));

document.querySelectorAll(".stars").forEach(stars => {
  const rating = Number(stars.dataset.rating || 0);
  const full = "★".repeat(Math.max(0, Math.min(5, rating)));
  const empty = "☆".repeat(5 - Math.max(0, Math.min(5, rating)));
  stars.textContent = full + empty;
});

document.getElementById("year").textContent = new Date().getFullYear();
