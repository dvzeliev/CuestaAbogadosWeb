/* funciones.js */
(() => {
  'use strict';

  // --- NAV: menú hamburguesa + barra al hacer scroll ---
  document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu   = document.querySelector('.nav-menu');
    const navbar    = document.querySelector('.navbar');

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
      // cerrar menú al pulsar un enlace
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('active'));
      });
    }

    // color/altura al hacer scroll
    if (navbar) {
      const onScroll = () => {
        if (window.scrollY > 100) {
          navbar.style.backgroundColor = 'rgba(60, 60, 60, 0.95)';
          navbar.style.padding = '0.7rem 0';
        } else {
          navbar.style.backgroundColor = 'var(--primary-color)';
          navbar.style.padding = '1rem 0';
        }
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  });

  // --- TARJETAS: flip + botón Volver + indicadores + hint táctil ---
  document.addEventListener('DOMContentLoaded', () => {
    const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
    const cards   = document.querySelectorAll('.service-card.flip');
    if (!cards.length) return;

    // 1) Inyectar botón Volver + ARIA
    cards.forEach((card, idx) => {
      const back = card.querySelector('.card-back');
      if (!back) return;

      const scroller = back.querySelector('.card-back-content') || back;

      if (!scroller.id) scroller.id = 'card-back-content-' + (idx + 1);
      card.setAttribute('role', 'button');
      card.setAttribute('aria-controls', scroller.id);
      card.setAttribute('aria-expanded', 'false');

      if (!back.querySelector('.flip-close')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'flip-close';
        btn.setAttribute('aria-label', 'Volver');
        // Flecha (SVG). Si prefieres FA: btn.innerHTML = '<i class="fa fa-arrow-left" aria-hidden="true"></i>';
        btn.innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
          '<path d="M12.5 5a7.5 7.5 0 1 1-7.06 9.96 1 1 0 1 1 1.9-.62A5.5 5.5 0 1 0 12.5 7H8.41l1.3 1.3a1 1 0 0 1-1.42 1.4l-3-3a1 1 0 0 1 0-1.4l3-3a1 1 0 1 1 1.42 1.4L8.41 5H12.5z"/></svg>';

        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          card.classList.remove('is-flipped');
          card.setAttribute('aria-expanded', 'false');
          card.focus({ preventScroll: true });
        });

        back.appendChild(btn);
      }

      // Hint táctil inicial (si tu CSS lo usa)
      if (isTouch) card.classList.add('show-hint');
    });

    // 2) Giro por tap en móvil + accesibilidad teclado
    let moved = false;

    cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (!isTouch) return;                          // desktop usa :hover
        if (e.target.closest('a,button')) return;      // no girar sobre botones/enlaces
        if (moved) { moved = false; return; }          // si venía scrolleando

        card.classList.add('hint-hidden');             // ocultar hint tras primer tap
        const flipped = card.classList.toggle('is-flipped');
        card.setAttribute('aria-expanded', flipped ? 'true' : 'false');

        const backContent = card.querySelector('.card-back-content') || card.querySelector('.card-back');
        backContent && backContent.focus && flipped && backContent.focus();
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const flipped = card.classList.toggle('is-flipped');
          card.setAttribute('aria-expanded', flipped ? 'true' : 'false');
        }
      });

      // Evitar que el scroll interno dispare el click de giro
      const scroller = card.querySelector('.card-back-content');
      if (scroller) {
        scroller.setAttribute('tabindex', '-1');
        scroller.addEventListener('click',      (e) => e.stopPropagation());
        scroller.addEventListener('touchstart', ()  => { moved = false; }, { passive: true });
        scroller.addEventListener('touchmove',  ()  => { moved = true;  }, { passive: true });
        scroller.addEventListener('touchend',   (e) => { if (moved) e.stopPropagation(); }, { passive: true });
      }
    });

    // 3) Cerrar al tocar fuera (móvil)
    document.addEventListener('click', (e) => {
      if (!isTouch) return;
      cards.forEach((card) => {
        if (!card.contains(e.target)) {
          card.classList.remove('is-flipped');
          card.setAttribute('aria-expanded', 'false');
        }
      });
    }, { passive: true });

    // 4) Indicadores “hay más” (solo Civil si tiene .card-back-content)
    const civilContent = document.querySelector('.service-card.flip--civil .card-back-content');
    function markOverflow(el){
      if (!el) return;
      const has = el.scrollHeight > el.clientHeight + 1;
      el.classList.toggle('has-overflow', has);
      markBottom(el);
    }
    function markBottom(el){
      if (!el) return;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
      el.classList.toggle('at-bottom', atBottom);
    }
    if (civilContent){
      markOverflow(civilContent);
      civilContent.addEventListener('scroll', () => markBottom(civilContent), { passive:true });
      window.addEventListener('resize',          () => markOverflow(civilContent));
      window.addEventListener('orientationchange',() => markOverflow(civilContent));
      setTimeout(() => markOverflow(civilContent), 250);
    }
  });

  // --- AVISO SUPERIOR: idiomas + cierre ---
    document.addEventListener('DOMContentLoaded', () => {
      const bar = document.querySelector('.notice-bar');
      const closeBtn = bar?.querySelector('.notice-close');

      if (bar && closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          bar.remove();
          document.body.classList.remove('has-notice');
        });
      }
  });

})();