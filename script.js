/* ═══════════════════════════════════════════
   ZUR KOGGE · Interactions & Enhancements
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initMenuTabs();
  initReviewsCarousel();
  initReservationForm();
  initScrollAnimations();
  initSmoothScrollOffset();
});

/* ── Navbar: scroll shadow + active state ── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const update = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── Mobile Nav Toggle ── */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      const spans = toggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Menu Tabs ── */
function initMenuTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const grids = document.querySelectorAll('.menu-grid');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      grids.forEach(grid => {
        const isTarget = grid.id === `tab-${target}`;
        grid.classList.toggle('hidden', !isTarget);
        if (isTarget) {
          grid.style.animation = 'none';
          grid.offsetHeight; // reflow
          grid.style.animation = 'fadeInTab 0.35s ease forwards';
        }
      });
    });
  });

  // Inject tab animation
  const style = document.createElement('style');
  style.textContent = `@keyframes fadeInTab { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`;
  document.head.appendChild(style);
}

/* ── Reviews Carousel ── */
function initReviewsCarousel() {
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.review-card'));
  let current = 0;
  let autoTimer;

  const getVisible = () => {
    const w = window.innerWidth;
    if (w <= 768) return 1;
    if (w <= 1024) return 2;
    return 3;
  };

  const maxIndex = () => Math.max(0, cards.length - getVisible());

  // Build dots
  const rebuildDots = () => {
    dotsContainer.innerHTML = '';
    const total = maxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Bewertung ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  };

  const goTo = (index) => {
    current = Math.max(0, Math.min(index, maxIndex()));
    const cardWidth = cards[0].offsetWidth + 24; // card width + gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIndex();
    resetAuto();
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Touch/swipe support
  let startX = 0;
  let dragging = false;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; dragging = true; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (!dragging) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    dragging = false;
  });

  const resetAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (current >= maxIndex()) goTo(0);
      else next();
    }, 5000);
  };

  // Pause auto on hover
  const carousel = document.getElementById('reviewsCarousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
  carousel.addEventListener('mouseleave', resetAuto);

  const init = () => {
    current = Math.min(current, maxIndex());
    rebuildDots();
    goTo(current);
  };

  window.addEventListener('resize', () => {
    clearTimeout(window._carouselResizeTimer);
    window._carouselResizeTimer = setTimeout(init, 150);
  });

  init();
  resetAuto();
}

/* ── Reservation Form ── */
function initReservationForm() {
  const form = document.getElementById('reservationForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  // Set min date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    dateInput.value = defaultDate.toISOString().split('T')[0];
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Wird gesendet…`;

    // Simulate send (replace with real backend integration)
    setTimeout(() => {
      form.querySelectorAll('input, select, textarea, button').forEach(el => el.classList.add('hidden'));
      success.classList.remove('hidden');
    }, 1200);
  });
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = '#e05252';
      field.style.boxShadow = '0 0 0 3px rgba(224,82,82,0.12)';
      valid = false;
      if (valid === false && !form.querySelector('[required]:invalid + .field-error')) {
        field.focus();
      }
    }
  });
  return valid;
}

/* ── Scroll Reveal Animations ── */
function initScrollAnimations() {
  const targets = document.querySelectorAll([
    '.menu-card',
    '.vibe-card',
    '.review-card',
    '.geschichte-text',
    '.geschichte-visual',
    '.stat',
    '.info-row',
    '.reservation-form-wrap',
    '.section-header',
    '.badge',
  ].join(','));

  targets.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.delay || 0));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Stagger children within grids
  document.querySelectorAll('.menu-grid, .vibes-grid, .geschichte-stats, .hero-badges').forEach(grid => {
    grid.querySelectorAll('.fade-up').forEach((child, i) => {
      child.dataset.delay = i * 80;
    });
  });

  targets.forEach(el => observer.observe(el));
}

/* ── Smooth scroll accounting for fixed nav ── */
function initSmoothScrollOffset() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}
