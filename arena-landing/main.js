(() => {
  'use strict';

  // ── Scroll-based nav style ──
  const nav = document.getElementById('nav');
  const handleNavScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ── Mobile menu ──
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('active');
    burger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      burger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ── Scroll reveal via IntersectionObserver ──
  const revealElements = document.querySelectorAll('[data-reveal]');
  let revealIndex = 0;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const stagger = el.dataset.revealDelay || 0;
          setTimeout(() => el.classList.add('revealed'), stagger);
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => {
    el.dataset.revealDelay = revealIndex * 80;
    revealIndex++;
    revealObserver.observe(el);
  });

  // ── Smooth anchor scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Hero video: native reverse (playbackRate -1), then forward again ──
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    let nativeReverse = false;

    const detectNativeReverse = () => {
      const prev = heroVideo.playbackRate;
      heroVideo.playbackRate = -1;
      nativeReverse = heroVideo.playbackRate < 0;
      heroVideo.playbackRate = prev;
    };

    heroVideo.addEventListener('loadedmetadata', detectNativeReverse);
    heroVideo.addEventListener('canplay', detectNativeReverse);

    heroVideo.addEventListener('ended', () => {
      if (!nativeReverse) {
        heroVideo.currentTime = 0;
        heroVideo.play().catch(() => {});
        return;
      }
      const d = heroVideo.duration;
      if (Number.isFinite(d) && d > 0) {
        heroVideo.currentTime = Math.min(d, Math.max(0, d - 1 / 30));
      }
      heroVideo.playbackRate = -1;
      heroVideo.play().catch(() => {});
    });

    heroVideo.addEventListener('timeupdate', () => {
      if (heroVideo.playbackRate >= 0) return;
      if (heroVideo.currentTime > 0.06) return;
      heroVideo.playbackRate = 1;
      heroVideo.currentTime = 0;
      heroVideo.play().catch(() => {});
    });
  }

  // ── Hero title letter-by-letter reveal ──
  const heroTitle = document.querySelector('.hero__title-line');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';

    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(100%)';
      span.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`;
      heroTitle.appendChild(span);
    });

    requestAnimationFrame(() => {
      setTimeout(() => {
        heroTitle.querySelectorAll('span').forEach(s => {
          s.style.opacity = '1';
          s.style.transform = 'translateY(0)';
        });
      }, 300);
    });
  }

  // ── Contact form basic handler ──
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Отправлено';
      btn.style.background = '#2a6e3f';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

})();
