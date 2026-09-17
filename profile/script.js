// --- 1. Mobile Menu Navigation ---
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// --- 2. Scroll Reveal Animations ---
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

// --- 3. Star Ratings ---
document.querySelectorAll(".stars").forEach(stars => {
  const rating = Number(stars.dataset.rating || 0);
  const full = "★".repeat(Math.max(0, Math.min(5, rating)));
  const empty = "☆".repeat(5 - Math.max(0, Math.min(5, rating)));
  stars.textContent = full + empty;
});

document.getElementById("year").textContent = new Date().getFullYear();

// --- 4. Interactive 3D Card Parallax Tilt ---
const tiltCards = document.querySelectorAll(".tilt-card");

tiltCards.forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  });
});

// --- 5. Three.js Microservices Network Background ---
const canvas = document.querySelector("#bg-canvas");
if (canvas && typeof THREE !== "undefined") {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.position.z = 24;

  // Group to hold the interconnected architecture cluster
  const networkGroup = new THREE.Group();
  scene.add(networkGroup);

  // Distributed Microservice Nodes
  const nodePositions = [
    { x: 9, y: 3, z: -2 },
    { x: 13, y: -2, z: -1 },
    { x: 7, y: -4, z: 2 },
    { x: 14, y: 4, z: -4 },
    { x: 11, y: 0, z: 4 }
  ];

  const nodeMeshList = [];
  const nodeGeometry = new THREE.IcosahedronGeometry(1.3, 0);
  const nodeMaterial = new THREE.MeshBasicMaterial({
    color: 0x72e0b2,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });

  nodePositions.forEach(pos => {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set(pos.x, pos.y, pos.z);
    networkGroup.add(node);
    nodeMeshList.push(node);
  });

  // Connecting Data Pipeline Lines
  const linePoints = [];
  for (let i = 0; i < nodeMeshList.length; i++) {
    for (let j = i + 1; j < nodeMeshList.length; j++) {
      linePoints.push(
        nodeMeshList[i].position.x, nodeMeshList[i].position.y, nodeMeshList[i].position.z,
        nodeMeshList[j].position.x, nodeMeshList[j].position.y, nodeMeshList[j].position.z
      );
    }
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePoints, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x72e0b2,
    transparent: true,
    opacity: 0.2
  });
  const networkLines = new THREE.LineSegments(lineGeometry, lineMaterial);
  networkGroup.add(networkLines);

  // Background Data Stream Constellation
  const particleCount = 180;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 65;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x72e0b2,
    size: 0.12,
    transparent: true,
    opacity: 0.5
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Smooth Mouse & Scroll Interactions
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let scrollY = 0;
  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
  });

  // Render Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Constant slow rotation of microservice system
    networkGroup.rotation.y = elapsedTime * 0.12;
    networkGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

    // React cleanly to user scroll
    networkGroup.position.y = (scrollY * 0.007);

    // Subtle camera parallax tracking cursor
    camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 1.2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    particles.rotation.y = elapsedTime * 0.02;

    renderer.render(scene, camera);
  }
  animate();

  // Responsive Resizing
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
