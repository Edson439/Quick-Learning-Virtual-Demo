// Activa íconos de Lucide cuando esté disponible
window.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && lucide.createIcons) {
    lucide.createIcons();
  }

  // Utilidad para cambiar atributos leyendo data-*
  function swap(el, attr, a, b, active) {
    const srcA = el.dataset[a], srcB = el.dataset[b];
    if (!srcA || !srcB) return;
    el.setAttribute(attr, active ? srcB : srcA);
  }

  // Aplica estado "hover" o "normal" a una tarjeta
  function setCardState(card, idx, isHover){
    const hero       = card.querySelector('.qlp-hero');
    const badge      = card.querySelector('.qlp-card__badge');
    const heroD      = card.getAttribute('data-hero-default');
    const heroH      = card.getAttribute('data-hero-hover');
    const bgD        = card.getAttribute('data-bg-default');
    const bgH        = card.getAttribute('data-bg-hover');
    const badgeSrc   = card.getAttribute('data-badge');

    // Fondo
    const bg = isHover ? bgH : bgD;
    if (bg) card.style.backgroundImage = `url("${bg}")`;

    // Hero
    if (isHover && heroH)      hero.src = heroH;
    else if (!isHover && heroD) hero.src = heroD;

    // Badge solo en 0,1 y 3 (como ya lo tenías)
    const canBadge = (idx === 0 || idx === 1 || idx === 3) && badge && badgeSrc;
    if (canBadge) {
      badge.src = badgeSrc;
      badge.style.display = isHover ? 'block' : 'none';
    }

    // Colores de texto
    const ribbon = card.querySelector('.qlp-ribbon');
    const listItems = card.querySelectorAll('.qlp-list li');
    const colorOn  = '#fff';
    const colorOff = '#073d99';

    if (ribbon) ribbon.style.color = isHover ? colorOn : colorOff;
    listItems.forEach(li => li.style.color = isHover ? colorOn : colorOff);
  }

  // Inicialización de todas las tarjetas
  document.querySelectorAll('.qlp-card').forEach((card, idx) => {
    const hero = card.querySelector('.qlp-hero');
    const heroDefault = card.getAttribute('data-hero-default');
    if (heroDefault) hero.src = heroDefault;

    // ESTRELLA: la tarjeta 0 queda SIEMPRE "hover"
    if (idx === 0) {
      setCardState(card, idx, true);  // la dejamos en hover permanente
    } else {
      // el resto arranca normal
      setCardState(card, idx, false);
    }

    // HOVER de tarjeta (excepto la 0, que se queda siempre en hover)
    card.addEventListener('mouseenter', () => {
      setCardState(card, idx, true);
    });
    card.addEventListener('mouseleave', () => {
      if (idx === 0) {
        // si salimos de la primera, volvemos a forzar el hover
        setCardState(card, idx, true);
      } else {
        setCardState(card, idx, false);
      }
    });

    // HOVER del botón (cambia solo la imagen del botón)
    const btnImg = card.querySelector('.qlp-btn-img');
    if (btnImg) {
      btnImg.addEventListener('mouseenter', () => {
        swap(btnImg, 'src', 'btnDefault', 'btnHover', true);
      });
      btnImg.addEventListener('mouseleave', () => {
        swap(btnImg, 'src', 'btnDefault', 'btnHover', false);
      });
    }
  });
});






window.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && lucide.createIcons) {
    lucide.createIcons();
  }

  // Utilidad para cambiar atributos leyendo data-*
  function swap(el, attr, a, b, active) {
    const srcA = el.dataset[a], srcB = el.dataset[b];
    if (!srcA || !srcB) return;
    el.setAttribute(attr, active ? srcB : srcA);
  }

  // Aplica estado "hover" o "normal" a una tarjeta
  function setCardState(card, idx, isHover){
    const hero       = card.querySelector('.qlp-hero');
    const badge      = card.querySelector('.qlp-card__badge');
    const heroD      = card.getAttribute('data-hero-default');
    const heroH      = card.getAttribute('data-hero-hover');
    const bgD        = card.getAttribute('data-bg-default');
    const bgH        = card.getAttribute('data-bg-hover');
    const badgeSrc   = card.getAttribute('data-badge');

    // Fondo
    const bg = isHover ? bgH : bgD;
    if (bg) card.style.backgroundImage = `url("${bg}")`;

    // Hero
    if (isHover && heroH)      hero.src = heroH;
    else if (!isHover && heroD) hero.src = heroD;

    // Badge solo en 0,1 y 3
    const canBadge = (idx === 0 || idx === 1 || idx === 3) && badge && badgeSrc;
    if (canBadge) {
      badge.src = badgeSrc;
      badge.style.display = isHover ? 'block' : 'none';
    } else if (badge) {
      badge.style.display = 'none';
    }

    // Colores de texto
    const ribbon = card.querySelector('.qlp-ribbon');
    const listItems = card.querySelectorAll('.qlp-list li');
    const colorOn  = '#fff';
    const colorOff = '#073d99';
    if (ribbon) ribbon.style.color = isHover ? colorOn : colorOff;
    listItems.forEach(li => li.style.color = isHover ? colorOn : colorOff);
  }

  // ---------- INICIALIZACIÓN CON "ENCENDIDO INICIAL" SOLO HASTA LA 1ª INTERACCIÓN ----------
  const cards = Array.from(document.querySelectorAll('.qlp-card'));
  if (!cards.length) return;

  // Poner todas en estado normal
  cards.forEach((card, idx) => {
    const hero = card.querySelector('.qlp-hero');
    const heroDefault = card.getAttribute('data-hero-default');
    if (heroDefault) hero.src = heroDefault;
    setCardState(card, idx, false);
  });

  // 1) Encendido inicial de la primera tarjeta
  let primed = true;        // mientras sea true, la 1ª queda encendida
  let currentOn = 0;        // índice actualmente encendido (al inicio = 0)
  setCardState(cards[0], 0, true);

  // 2) Desde la primera interacción del mouse, desactivamos el "primed"
  cards.forEach((card, idx) => {
    // Al entrar el mouse: si seguíamos en primed, apagamos la 1ª y ya usamos hover normal
    card.addEventListener('mouseenter', () => {
      if (primed) {
        primed = false;
        // apaga la primera si no es la misma tarjeta
        if (currentOn !== null && currentOn !== idx) {
          setCardState(cards[currentOn], currentOn, false);
        }
      }
      // apaga todas y enciende solo la actual
      cards.forEach((c, i) => setCardState(c, i, false));
      setCardState(card, idx, true);
      currentOn = idx;
    });

    // Al salir el mouse de una tarjeta:
    // - si ya no estamos en primed, apágala (quedan todas apagadas si no entras a otra)
    // - si aún estuviéramos en primed (antes de cualquier hover), no tocamos la primera
    card.addEventListener('mouseleave', () => {
      if (!primed) {
        setCardState(card, idx, false);
        currentOn = null;
      }
    });

    // Hover del botón (cambia solo la imagen del botón)
    const btnImg = card.querySelector('.qlp-btn-img');
    if (btnImg) {
      btnImg.addEventListener('mouseenter', () => {
        swap(btnImg, 'src', 'btnDefault', 'btnHover', true);
      });
      btnImg.addEventListener('mouseleave', () => {
        swap(btnImg, 'src', 'btnDefault', 'btnHover', false);
      });
    }
  });
});
