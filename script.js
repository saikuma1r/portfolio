// --- 1. Mobile Menu & Scroll Reveal ---
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
      setTimeout(() => entry.target.classList.add("visible"), index * 40);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach(item => observer.observe(item));

// Stars Rating
document.querySelectorAll(".stars").forEach(stars => {
  const rating = Number(stars.dataset.rating || 0);
  const full = "★".repeat(Math.max(0, Math.min(5, rating)));
  const empty = "☆".repeat(5 - Math.max(0, Math.min(5, rating)));
  stars.textContent = full + empty;
});

document.getElementById("year").textContent = new Date().getFullYear();

// --- 2. Interactive 3D Parallax Tilt for Cards ---
const tiltCards = document.querySelectorAll(".tilt-card");

tiltCards.forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-12deg to +12deg)
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  });
});

// --- 3. Three.js Background 3D Engine ---
const canvas = document.querySelector("#bg-canvas");
if (canvas && typeof THREE !== "undefined") {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.position.z = 25;

  // Floating Backend Node (Wireframe Icosahedron)
  const icoGeometry = new THREE.IcosahedronGeometry(7, 1);
  const icoMaterial = new THREE.MeshBasicMaterial({
    color: 0x72e0b2,
    wireframe: true,
    transparent: true,
    opacity: 0.22
  });
  const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
  icosahedron.position.set(12, 0, -5);
  scene.add(icosahedron);

  // Background Particles Constellation
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 70;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x72e0b2,
    size: 0.14,
    transparent: true,
    opacity: 0.65
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Mouse move listener for 3D Camera Depth
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Scroll reaction
  let scrollY = 0;
  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
  });

  // Animation Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Constant slow rotation
    icosahedron.rotation.x = elapsedTime * 0.15;
    icosahedron.rotation.y = elapsedTime * 0.2;

    // React to scroll
    icosahedron.position.y = (scrollY * 0.008);
    icosahedron.rotation.z = scrollY * 0.001;

    // Gentle camera tracking
    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    particles.rotation.y = elapsedTime * 0.03;

    renderer.render(scene, camera);
  }
  animate();

  // Responsive resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
