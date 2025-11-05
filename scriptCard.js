
(() => {
  // ---------- Animación de entrada ----------
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in');});
  },{threshold:.25});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // ---------- Setup carrusel ----------
  const viewport = document.querySelector('.tst-viewport');
  const track    = document.getElementById('tstTrack');

  let cards = Array.from(track.children);
  const N = cards.length;

  // Clonar extremos para loop infinito
  const firstClone = cards[0].cloneNode(true);   // clone de Mariana
  const lastClone  = cards[N-1].cloneNode(true); // clone de Fernanda
  track.insertBefore(lastClone, cards[0]);       // [cloneFernanda, Mariana, Carlos, Fernanda]
  track.appendChild(firstClone);                 // [cloneFernanda, Mariana, Carlos, Fernanda, cloneMariana]
  cards = Array.from(track.children);

  // Estado: queremos que Carlos (índice 2 real) esté en el centro => index=2 en el nuevo arreglo
  // [0]=cloneFernanda, [1]=Mariana, [2]=Carlos, [3]=Fernanda, [4]=cloneMariana
  let index = 2;
  let isAnimating = false;

  // --- utilidades ---
  const clamp = v => Math.max(0, Math.min(v, cards.length - 1));
  const setActive = () => {
    cards.forEach((c,i)=>c.classList.toggle('is-active', i === index));
  };

  function offsetFor(i){
    const cardW = cards[0].getBoundingClientRect().width;
    const gap   = parseFloat(getComputedStyle(track).gap) || 0;
    const vpW   = viewport.getBoundingClientRect().width;
    return (vpW - cardW)/2 - (cardW + gap)*i;
  }

  function goTo(i, animate = true){
    index = clamp(i);
    if (!animate) track.style.transition = 'none';
    track.style.transform = `translateX(${offsetFor(index)}px)`;
    if (!animate){
      void track.offsetWidth; // reflow
      track.style.transition = 'transform .45s ease-in-out';
    }
    setActive();
  }

  // --- navegación infinita ---
  track.addEventListener('transitionend', () => {
    if (index === 0){             // si pasamos antes del primer real
      track.style.transition = 'none';
      index = N;                  // salta a la última real (Fernanda)
      track.style.transform = `translateX(${offsetFor(index)}px)`;
      setActive();
      requestAnimationFrame(()=> track.style.transition = 'transform .45s ease-in-out');
    }
    if (index === cards.length - 1){  // si pasamos al final (cloneMariana)
      track.style.transition = 'none';
      index = 1;                      // salta a Mariana
      track.style.transform = `translateX(${offsetFor(index)}px)`;
      setActive();
      requestAnimationFrame(()=> track.style.transition = 'transform .45s ease-in-out');
    }
    isAnimating = false;
  });

  // --- botones ---
  document.querySelector('.tst-prev')?.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;
    goTo(index - 1, true);
  });
  document.querySelector('.tst-next')?.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;
    goTo(index + 1, true);
  });
  /* ====== AUTOPLAY cada 3s ====== */
  const AUTOPLAY_MS = 3000;
  let autoTimer = null;

  function stopAuto(){
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }
  function startAuto(){
    stopAuto();
    autoTimer = setInterval(() => {
      if (isAnimating) return;
      isAnimating = true;
      goTo(index + 1, true);   // avanza 1 slide
    }, AUTOPLAY_MS);
  }

  // Pausar al pasar el mouse/tocar (desktop)
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);

  // Reiniciar después de usar flechas
  const restartAfterClick = () => { stopAuto(); startAuto(); };
  document.querySelector('.tst-prev')?.addEventListener('click', restartAfterClick);
  document.querySelector('.tst-next')?.addEventListener('click', restartAfterClick);

  // Pausar si la pestaña no está activa
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto(); else startAuto();
  });

  // Pausar si la sección no está en viewport (ahorra CPU)
  const section = document.querySelector('.tst');
  const viewObs = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting ? startAuto() : stopAuto());
  }, { threshold: 0.5 });
  if (section) viewObs.observe(section);

  // --- init ---
  window.addEventListener('load', () => {
    goTo(index, false); // Carlos centrado al iniciar
  });
  window.addEventListener('resize', () => requestAnimationFrame(() => goTo(index, false)));
})();
