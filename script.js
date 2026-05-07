/* ═══════════════════════════════════════════
   ZUR KOGGE · Full Interactions v2
   Maritime Restaurant Website
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initMobileNav();
  initStickyBar();
  initOpenStatus();
  initMenuTabs();
  initReviewsCarousel();
  initFAQ();
  initReservationForm();
  initScrollAnimations();
  initSmoothScroll();
  initFloatingCTA();
  initParallax();
  initCounters();
  // Welcome toast after slight delay
  setTimeout(() => showToast('⚓', 'Willkommen bei Zur Kogge — Rostocks ältestem maritimen Restaurant!', 5000), 2200);
});

/* ═══════════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = Math.min(100, pct) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
}

/* ═══════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ═══════════════════════════════════════════
   MOBILE NAV TOGGLE
═══════════════════════════════════════════ */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  const closeNav = () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  };

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

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) closeNav();
  });
}

/* ═══════════════════════════════════════════
   STICKY BAR
═══════════════════════════════════════════ */
function initStickyBar() {
  const bar = document.getElementById('stickyBar');
  const hero = document.getElementById('hero');
  if (!bar || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      const visible = !entry.isIntersecting;
      bar.classList.toggle('visible', visible);
      bar.setAttribute('aria-hidden', String(!visible));
    },
    { threshold: 0.05 }
  );
  observer.observe(hero);
}

/* ═══════════════════════════════════════════
   OPEN / CLOSED STATUS
   Opens: 11:30, Closes: 22:00 (Mon–Sun)
═══════════════════════════════════════════ */
function initOpenStatus() {
  const heroStatus = document.getElementById('heroLiveStatus');
  const stickyBadge = document.getElementById('stickyOpenBadge');
  const liveStatusDot = document.getElementById('liveStatusDot');
  const liveStatusText = document.getElementById('liveStatusText');
  const liveHoursText = document.getElementById('liveHoursText');

  const update = () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const totalMins = h * 60 + m;
    const openMins = 11 * 60 + 30;   // 11:30
    const closeMins = 22 * 60;         // 22:00
    const lastEntry = 21 * 60;         // 21:00 letzter Einlass

    const isOpen = totalMins >= openMins && totalMins < closeMins;
    const soonOpen = !isOpen && totalMins < openMins && (openMins - totalMins) <= 60;
    const soonClose = isOpen && (closeMins - totalMins) <= 60;

    let label, stickyLabel, dotClass, hint;
    if (isOpen) {
      if (soonClose) {
        label = '⚠ Schließt bald'; stickyLabel = 'Schließt bald'; dotClass = 'open';
        hint = `Letzter Einlass 21:00 Uhr`;
      } else {
        label = '● Jetzt geöffnet'; stickyLabel = 'Geöffnet'; dotClass = 'open';
        hint = `Offen bis 22:00 Uhr`;
      }
    } else if (soonOpen) {
      const diff = openMins - totalMins;
      label = `Öffnet in ${diff} Min`; stickyLabel = 'Öffnet bald'; dotClass = 'closed';
      hint = 'Öffnet um 11:30 Uhr';
    } else {
      label = '✕ Derzeit geschlossen'; stickyLabel = 'Geschlossen'; dotClass = 'closed';
      hint = 'Öffnet täglich um 11:30 Uhr';
    }

    // Hero badge
    if (heroStatus) {
      heroStatus.innerHTML = `<span class="live-badge ${dotClass}"><span class="live-dot"></span>${label}</span>`;
    }
    // Sticky bar
    if (stickyBadge) {
      stickyBadge.textContent = stickyLabel;
      stickyBadge.className = `sticky-open-badge ${dotClass}`;
    }
    // Reservation section
    if (liveStatusDot) liveStatusDot.className = `live-status-dot ${dotClass}`;
    if (liveStatusText) liveStatusText.textContent = isOpen ? 'Wir sind jetzt geöffnet!' : 'Aktuell geschlossen';
    if (liveHoursText) liveHoursText.textContent = hint;
  };

  update();
  setInterval(update, 60000); // refresh every minute
}

/* ═══════════════════════════════════════════
   MENU TABS
═══════════════════════════════════════════ */
function initMenuTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const grids = document.querySelectorAll('.menu-grid');
  if (!buttons.length) return;

  const style = document.createElement('style');
  style.textContent = `@keyframes fadeInTab{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`;
  document.head.appendChild(style);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      grids.forEach(grid => {
        const isTarget = grid.id === `tab-${target}`;
        grid.classList.toggle('hidden', !isTarget);
        if (isTarget) {
          // Re-trigger animations
          grid.querySelectorAll('.fade-up').forEach(el => el.classList.remove('visible'));
          grid.style.animation = 'none';
          grid.offsetHeight;
          grid.style.animation = 'fadeInTab 0.35s ease';
          setTimeout(() => {
            grid.querySelectorAll('.fade-up').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 60);
            });
          }, 50);
        }
      });
    });
  });
}

/* ═══════════════════════════════════════════
   REVIEWS CAROUSEL
═══════════════════════════════════════════ */
function initReviewsCarousel() {
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.review-card'));
  let current = 0;
  let autoTimer;
  let isAnimating = false;

  const getVisible = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  const maxIndex = () => Math.max(0, cards.length - getVisible());

  const buildDots = () => {
    dotsContainer.innerHTML = '';
    const total = maxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Bewertung ${i + 1} von ${total}`);
      dot.setAttribute('role', 'listitem');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const goTo = (idx) => {
    if (isAnimating) return;
    isAnimating = true;
    current = Math.max(0, Math.min(idx, maxIndex()));
    // Width = card width + gap
    const cardW = cards[0].getBoundingClientRect().width;
    const gap = 20;
    track.style.transform = `translateX(-${current * (cardW + gap)}px)`;
    updateDots();
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIndex();
    resetAuto();
    setTimeout(() => { isAnimating = false; }, 500);
  };

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? goTo(current + 1) : goTo(current - 1);
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (document.getElementById('reviewsCarousel')?.matches(':hover')) {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    }
  });

  const resetAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      goTo(current >= maxIndex() ? 0 : current + 1);
    }, 5500);
  };

  const carousel = document.getElementById('reviewsCarousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
    carousel.addEventListener('mouseleave', resetAuto);
  }

  const init = () => {
    current = Math.min(current, maxIndex());
    buildDots();
    goTo(current);
  };

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 180);
  });

  init();
  resetAuto();
}

/* ═══════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════ */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;

      // Close all others
      document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.hidden = true;
        }
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.hidden = isOpen;
    });
  });
}

/* ═══════════════════════════════════════════
   MULTI-STEP RESERVATION FORM
═══════════════════════════════════════════ */
function initReservationForm() {
  const form = document.getElementById('reservationForm');
  if (!form) return;

  // Set min date
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    const def = new Date();
    def.setDate(def.getDate() + 4);
    dateInput.value = def.toISOString().split('T')[0];
  }

  // Prefill from localStorage
  const savedName = localStorage.getItem('kogge_name');
  const savedPhone = localStorage.getItem('kogge_phone');
  if (savedName) document.getElementById('name').value = savedName;
  if (savedPhone) document.getElementById('phone').value = savedPhone;

  const pages = { 1: document.getElementById('formPage1'), 2: document.getElementById('formPage2'), 3: document.getElementById('formPage3') };
  const steps = document.querySelectorAll('.form-step');

  const setStep = (n) => {
    Object.values(pages).forEach(p => p.classList.remove('active'));
    pages[n].classList.add('active');
    steps.forEach((s, i) => {
      s.classList.toggle('active', i + 1 === n);
      s.classList.toggle('done', i + 1 < n);
    });
  };

  // Step 1 → 2
  document.getElementById('nextStep1')?.addEventListener('click', () => {
    if (!validateFields(['name', 'phone', 'guests'])) return;
    // Save for prefill
    localStorage.setItem('kogge_name', document.getElementById('name').value);
    localStorage.setItem('kogge_phone', document.getElementById('phone').value);
    setStep(2);
  });

  // Step 2 → 1 (back)
  document.getElementById('prevStep2')?.addEventListener('click', () => setStep(1));

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateFields(['date', 'time'])) return;

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Wird gesendet…`;

    // In production: send to backend / email service here
    setTimeout(() => {
      setStep(3);
      showToast('✅', 'Reservierungsanfrage erfolgreich gesendet! Wir melden uns bald.', 6000);
      // Clear saved data
      localStorage.removeItem('kogge_name');
      localStorage.removeItem('kogge_phone');
    }, 1400);
  });
}

function validateFields(ids) {
  let ok = true;
  let firstError = null;
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('error');
    if (!el.value.trim()) {
      el.classList.add('error');
      ok = false;
      if (!firstError) firstError = el;
    }
  });
  if (firstError) {
    firstError.focus();
    showToast('⚠️', 'Bitte alle Pflichtfelder ausfüllen.', 3500);
  }
  return ok;
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL ANIMATIONS
═══════════════════════════════════════════ */
function initScrollAnimations() {
  const allTargets = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  // Stagger siblings in grids
  const staggerContainers = [
    '.menu-grid .menu-card',
    '.vibes-grid .vibe-card',
    '.geschichte-stats .stat',
    '.hero-badges .badge',
    '.trust-bar-inner .trust-item',
    '.faq-col .faq-item',
    '.gallery-mosaic .gallery-tile',
  ];

  staggerContainers.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (el.classList.contains('fade-up')) {
        el.dataset.delay = i * 70;
      }
    });
  });

  allTargets.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════
   SMOOTH SCROLL (respects sticky nav offset)
═══════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });
}

/* ═══════════════════════════════════════════
   FLOATING CTA (mobile)
═══════════════════════════════════════════ */
function initFloatingCTA() {
  const cta = document.getElementById('floatingCta');
  const hero = document.getElementById('hero');
  if (!cta || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      const show = !entry.isIntersecting;
      cta.classList.toggle('visible', show);
      cta.setAttribute('aria-hidden', String(!show));
    },
    { threshold: 0.1 }
  );
  observer.observe(hero);
}

/* ═══════════════════════════════════════════
   PARALLAX (hero only, GPU-accelerated)
═══════════════════════════════════════════ */
function initParallax() {
  const content = document.getElementById('heroContent');
  if (!content || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          content.style.transform = `translateY(${y * 0.25}px)`;
          content.style.opacity = String(1 - (y / (window.innerHeight * 0.75)));
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════════
   ANIMATED COUNTERS
═══════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(easeOut(progress) * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════
   TOAST NOTIFICATIONS
═══════════════════════════════════════════ */
function showToast(icon, message, duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  // Limit to 3 toasts
  if (container.children.length >= 3) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${icon}</span>
    <span>${message}</span>
    <button class="toast-close" aria-label="Schließen">✕</button>
  `;

  const remove = () => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector('.toast-close').addEventListener('click', remove);
  container.appendChild(toast);
  setTimeout(remove, duration);
}

/* ═══════════════════════════════════════════
   PHONE CLICK TRACKING (CRO analytics hook)
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', () => {
    // In production: replace with GA4 / GTM event
    if (typeof gtag === 'function') {
      gtag('event', 'phone_click', { event_category: 'CTA', event_label: link.href });
    }
    // Visual feedback
    showToast('📞', 'Verbinden…', 2000);
  });
});

/* ═══════════════════════════════════════════
   RESERVATION CTA TRACKING
═══════════════════════════════════════════ */
document.querySelectorAll('a[href="#reservierung"], .sticky-reserve, .float-reserve').forEach(btn => {
  btn.addEventListener('click', () => {
    if (typeof gtag === 'function') {
      gtag('event', 'reservation_cta_click', { event_category: 'CTA', event_label: btn.textContent.trim() });
    }
  });
});
