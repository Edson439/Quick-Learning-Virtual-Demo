// ===== LÓGICA DEL BANNER (cerrar con la X) =====
const promoBanner = document.getElementById('promoBanner');
const promoClose = document.getElementById('promoClose');

if (promoBanner && promoClose){
  promoClose.addEventListener('click', () => {
    promoBanner.style.display = 'none';
  });

  /* Si quieres recordar que ya lo cerraron, descomenta:
  promoClose.addEventListener('click', () => {
    localStorage.setItem('promoClosed', '1');
    promoBanner.style.display = 'none';
  });
  if (localStorage.getItem('promoClosed') === '1') {
    promoBanner.style.display = 'none';
  }
  */
}

// ===== Mantener el header fijo debajo del banner =====
function updatePromoHeight(){
  const h = (promoBanner && promoBanner.style.display !== 'none')
    ? promoBanner.offsetHeight
    : 0;
  document.documentElement.style.setProperty('--promo-height', h + 'px');
}

window.addEventListener('load', updatePromoHeight);
window.addEventListener('resize', updatePromoHeight);

// Si cierras el banner, actualizamos la altura para que el header suba
if (promoClose){
  promoClose.addEventListener('click', () => {
    promoBanner.style.display = 'none';
    updateFixedTop(); // esta es la línea clave
  });
}


// Inicializa los íconos Lucide
lucide.createIcons();

// Toggle del menú móvil
// ----- Toggle del menú móvil (abre/cierra y cambia el ícono) -----
const menuBtn = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');
const mobileNav = document.getElementById('mobileNav');

if (menuBtn && header && mobileNav){
  // función que cambia el ícono
  const setIcon = (open) => {
    menuBtn.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    lucide.createIcons(); // actualiza el ícono
  };

  // estado inicial
  menuBtn.setAttribute('aria-expanded', 'false');
  setIcon(false);

  // al hacer clic, abre o cierra
  menuBtn.addEventListener('click', () => {
    const isOpen = header.classList.toggle('is-open');
    mobileNav.hidden = !isOpen;
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    setIcon(isOpen);
  });

  // si haces clic en un link, se cierra el menú
  mobileNav.addEventListener('click', (e) => {
    if (e.target.matches('a')){
      header.classList.remove('is-open');
      mobileNav.hidden = true;
      menuBtn.setAttribute('aria-expanded', 'false');
      setIcon(false);
    }
  });
}

function updateFixedTop(){
  const promo = document.getElementById('promoBanner');
  const headerEl = document.querySelector('.site-header');
  const hBanner = (promo && promo.style.display !== 'none') ? promo.offsetHeight : 0;
  const hHeader = headerEl ? headerEl.offsetHeight : 0;
  const total = hBanner + hHeader;
  document.documentElement.style.setProperty('--promo-height', hBanner + 'px');
  document.documentElement.style.setProperty('--fixed-top', total + 'px');
}

// recalcular en estos momentos
window.addEventListener('load', updateFixedTop);
window.addEventListener('resize', updateFixedTop);

// si cierras el banner morado, recalcula
const promoCloseBtn = document.getElementById('promoClose');
if (promoCloseBtn){
  promoCloseBtn.addEventListener('click', updateFixedTop);
}

// ---- Autoplay por visibilidad para los videos de los bloques ----
const vids = document.querySelectorAll('.bloque-video');
if ('IntersectionObserver' in window && vids.length){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const v = entry.target;
      if (entry.isIntersecting){
        v.play().catch(()=>{});
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.25 });

  vids.forEach(v => io.observe(v));
}

