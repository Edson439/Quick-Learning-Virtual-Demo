  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navButtons = document.querySelector('.nav-buttons');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    navButtons.classList.toggle('show');
  });