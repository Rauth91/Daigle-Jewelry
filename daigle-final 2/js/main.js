/* ============================================================
   DAIGLE JEWELRY — JAVASCRIPT
   js/main.js

   1. Loader & Spark Particles
   2. Rotating Wireframe Diamond
   3. Hero Staggered Reveal
   4. Scroll Reveal
   5. Parallax Scroll
   6. Sticky Navigation
   7. Mobile Menu
   8. Testimonial Rotator
   9. Form Submission
============================================================ */

document.addEventListener('DOMContentLoaded', () => {


  /* ============================================================
     1. LOADER & SPARK PARTICLES
  ============================================================ */
  const sparkCanvas = document.getElementById('spark-canvas');
  const sparkCtx    = sparkCanvas.getContext('2d');
  sparkCanvas.width  = window.innerWidth;
  sparkCanvas.height = window.innerHeight;
  let particles = [];

  class Particle {
    constructor(x, y, direction) {
      this.x       = x;
      this.y       = y;
      this.size    = Math.random() * 1.5;
      this.speedX  = Math.random() * 4 * direction;
      this.speedY  = (Math.random() - 0.5) * 3;
      this.gravity = 0.05;
      this.life    = 1.0;
      this.color   = `rgba(212, 195, 163, ${0.5 + Math.random() * 0.5})`;
    }
    update() { this.x += this.speedX; this.y += this.speedY; this.speedY += this.gravity; this.life -= 0.015; }
    draw() { sparkCtx.globalAlpha = this.life; sparkCtx.fillStyle = this.color; sparkCtx.beginPath(); sparkCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); sparkCtx.fill(); }
  }

  function animateSparks() {
    const lineEl    = document.getElementById('loader-line');
    const rect      = lineEl.getBoundingClientRect();
    const isGrowing = rect.width > 2 && rect.width < window.innerWidth - 10;
    if (isGrowing) {
      for (let i = 0; i < 3; i++) {
        particles.push(new Particle(rect.left,  rect.top, -1));
        particles.push(new Particle(rect.right, rect.top,  1));
      }
    }
    sparkCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateSparks);
  }

  setTimeout(() => { document.getElementById('loader-line').style.width = '100vw'; }, 400);
  animateSparks();
  setTimeout(() => { document.body.classList.add('loaded'); triggerHeroReveals(); }, 3200);


  /* ============================================================
     2. ROTATING WIREFRAME DIAMOND
     Crown edges brightest — mimics real diamond light behavior
  ============================================================ */
  const diamondCanvas = document.getElementById('diamond-canvas');
  const diamondCtx    = diamondCanvas.getContext('2d');
  let rotation = 0;

  function drawDiamond() {
    diamondCtx.clearRect(0, 0, 600, 600);
    rotation += 0.003;
    const cx = 300, cy = 300;
    const points = [];

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + rotation;
      points.push({
        topX:    Math.cos(angle) * 90  + cx,
        topY:    Math.sin(angle) * 28  + cy - 100,
        bottomX: Math.cos(angle) * 180 + cx,
        bottomY: Math.sin(angle) * 50  + cy + 10
      });
    }

    points.forEach((point, i) => {
      const next = points[(i + 1) % 8];

      // Upper facets
      diamondCtx.strokeStyle = 'rgba(212, 195, 163, 0.2)';
      diamondCtx.lineWidth   = 1;
      diamondCtx.beginPath();
      diamondCtx.moveTo(point.topX,    point.topY);
      diamondCtx.lineTo(next.topX,     next.topY);
      diamondCtx.lineTo(next.bottomX,  next.bottomY);
      diamondCtx.lineTo(point.bottomX, point.bottomY);
      diamondCtx.closePath();
      diamondCtx.stroke();

      // Lower facets → culet
      diamondCtx.strokeStyle = 'rgba(212, 195, 163, 0.1)';
      diamondCtx.beginPath();
      diamondCtx.moveTo(point.bottomX, point.bottomY);
      diamondCtx.lineTo(next.bottomX,  next.bottomY);
      diamondCtx.lineTo(cx, cy + 220);
      diamondCtx.closePath();
      diamondCtx.stroke();

      // Crown edges — brightest, catches the eye
      diamondCtx.strokeStyle = 'rgba(212, 195, 163, 0.4)';
      diamondCtx.lineWidth   = 0.8;
      diamondCtx.beginPath();
      diamondCtx.moveTo(point.topX, point.topY);
      diamondCtx.lineTo(next.topX,  next.topY);
      diamondCtx.stroke();
    });

    requestAnimationFrame(drawDiamond);
  }

  drawDiamond();


  /* ============================================================
     3. HERO STAGGERED REVEAL
     Elements animate in sequentially after loader disappears
  ============================================================ */
  function triggerHeroReveals() {
    document.querySelectorAll('.hero-reveal').forEach(el => {
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('in'), delay);
    });
  }


  /* ============================================================
     4. SCROLL REVEAL
     .rv elements fade + slide up on entering viewport
  ============================================================ */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.rv').forEach(el => revealObserver.observe(el));


  /* ============================================================
     5. PARALLAX SCROLL
     Diamond moves at 25% of scroll speed — depth effect
  ============================================================ */
  const diamond = document.getElementById('diamond-canvas');
  let ticking   = false;

  function updateParallax() {
    diamond.style.transform = `translateY(calc(-50% + ${window.scrollY * 0.25}px))`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
  }, { passive: true });


  /* ============================================================
     6. STICKY NAVIGATION
  ============================================================ */
  const nav      = document.getElementById('nav');
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:80px;height:1px;width:1px;pointer-events:none;';
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => nav.classList.toggle('stuck', !e.isIntersecting)).observe(sentinel);


  /* ============================================================
     7. MOBILE MENU
  ============================================================ */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  const openMenu = () => {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });


  /* ============================================================
     8. TESTIMONIAL ROTATOR
     Silently fades between testimonials every 5 seconds.
     No arrows, no loud UI — just the words.
     Clicking a dot jumps to that testimonial.
  ============================================================ */
  const testimonials = document.querySelectorAll('.testimonial');
  const dots         = document.querySelectorAll('.testimonial-dot');
  let currentIndex   = 0;
  let autoplayTimer;

  function showTestimonial(index) {
    // Remove active from all
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    // Activate the target
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentIndex = index;
  }

  function nextTestimonial() {
    const next = (currentIndex + 1) % testimonials.length;
    showTestimonial(next);
  }

  function startAutoplay() {
    // Rotate every 5 seconds
    autoplayTimer = setInterval(nextTestimonial, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // Dot click — jump to specific testimonial
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index, 10);
      showTestimonial(index);
      resetAutoplay(); // restart timer so it doesn't jump immediately
    });
  });

  // Start rotation
  if (testimonials.length > 0) startAutoplay();


  /* ============================================================
     9. FORM SUBMISSION
     Submits to Netlify, shows success state, redirects to
     thank-you page after a short delay
  ============================================================ */
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn      = form.querySelector('.form-submit');
      const original = btn.textContent;

      btn.textContent = 'Sending...';
      btn.disabled    = true;

      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString(),
        });

        btn.textContent      = 'Inquiry Sent';
        btn.style.background = 'transparent';
        btn.style.color      = 'var(--gold)';
        btn.style.border     = '1px solid rgba(212,195,163,0.3)';
        form.reset();

        // Redirect to thank you page after 1.5 seconds
        setTimeout(() => { window.location.href = '/thank-you.html'; }, 1500);

      } catch {
        btn.textContent = 'Please try again';
        btn.disabled    = false;
        setTimeout(() => {
          btn.textContent      = original;
          btn.style.background = '';
          btn.style.color      = '';
          btn.style.border     = '';
        }, 3000);
      }
    });
  }


});
