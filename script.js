// Section reveal animation
document.querySelectorAll(".section").forEach(section => {
    section.style.opacity = 0;
    section.style.transform = "translateY(40px)";
    section.style.transition = "0.6s ease-out";
});

window.addEventListener("scroll", () => {
    document.querySelectorAll(".section").forEach(section => {
        const top = section.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            section.style.opacity = 1;
            section.style.transform = "translateY(0)";
        }
    });
});

// Subtle parallax background
document.addEventListener("mousemove", e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    document.querySelector(".grid-layer").style.transform =
        `translate(${x}px, ${y}px)`;
});
