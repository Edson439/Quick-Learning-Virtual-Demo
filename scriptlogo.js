document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.ql-logo-carousel-track');
  if (!track) return;

  const logos = Array.from(track.children);
  logos.forEach(logo => {
    const clone = logo.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true'); // opcional
    track.appendChild(clone);
  });

  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
});
