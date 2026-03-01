/* ============================================================
   MOHD ANAS PORTFOLIO — script.js
   Features:
   - Typed text animation (hero role)
   - Scroll-triggered reveal animations
   - Nav scroll behavior + active link highlight
   - Hamburger menu toggle
   - Skill bar fill animation
   - Contact form validation + mailto submission
   - Back to top button
   ============================================================ */

'use strict';

// ===== CONFIGURATION =====
// CUSTOMIZATION: Change YOUR_EMAIL to receive form submissions
const CONFIG = {
  email: 'mohdanas9595@gmail.com',

  // Typed role strings — CUSTOMIZE these to change the hero text rotation
  typedStrings: [
    'Backend Engineer',
    'AI Automation Engineer',
    'LLM Systems Builder',
    'RAG Pipeline Architect',
  ],

  // OPTIONAL: EmailJS config — fill these in to use EmailJS instead of mailto
  // 1. Create account at https://emailjs.com
  // 2. Uncomment the EmailJS script in index.html
  // 3. Fill in the values below
  emailjs: {
    serviceId:  'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey:  'YOUR_PUBLIC_KEY',
    enabled:    false, // Set to true after configuring EmailJS
  }
};

// ===== DOM REFERENCES =====
const nav        = document.querySelector('.nav');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.nav__mobile-link');
const backToTop  = document.getElementById('back-to-top');
const typedEl    = document.getElementById('typed-role');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const submitBtn  = document.getElementById('submit-btn');

/* ─────────────────────────────────────────────
   1. TYPED TEXT ANIMATION
   Cycles through CONFIG.typedStrings in the hero
───────────────────────────────────────────── */
(function initTyped() {
  if (!typedEl) return;

  let stringIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  const SPEED_TYPE   = 75;   // ms per character typed
  const SPEED_DELETE = 40;   // ms per character deleted
  const PAUSE_END    = 2000; // pause at end of string
  const PAUSE_START  = 400;  // pause before typing next

  function type() {
    const current = CONFIG.typedStrings[stringIndex];

    if (!isDeleting) {
      // Add next character
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        // Finished typing — pause before deleting
        isDeleting = true;
        setTimeout(type, PAUSE_END);
        return;
      }
    } else {
      // Remove last character
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        // Move to next string
        isDeleting = false;
        stringIndex = (stringIndex + 1) % CONFIG.typedStrings.length;
        setTimeout(type, PAUSE_START);
        return;
      }
    }

    setTimeout(type, isDeleting ? SPEED_DELETE : SPEED_TYPE);
  }

  // Start with a small delay
  setTimeout(type, 800);
})();

/* ─────────────────────────────────────────────
   2. NAVIGATION: Scroll state + active section
───────────────────────────────────────────── */
(function initNav() {
  // Toggle scrolled class for glass-morphism nav
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Highlight active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateActive() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 150) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
})();

/* ─────────────────────────────────────────────
   3. HAMBURGER MENU
───────────────────────────────────────────── */
(function initHamburger() {
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ─────────────────────────────────────────────
   4. SCROLL REVEAL ANIMATIONS
   Uses IntersectionObserver for performance
───────────────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal-up');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animation to free memory
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ─────────────────────────────────────────────
   5. SKILL BAR ANIMATIONS
   Triggers when skill bars scroll into view
───────────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-item__fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetWidth = fill.getAttribute('data-width');
          // Slight delay for visual polish
          setTimeout(() => {
            fill.style.width = `${targetWidth}%`;
          }, 200);
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.5 }
  );

  fills.forEach(fill => observer.observe(fill));
})();

/* ─────────────────────────────────────────────
   6. CONTACT FORM
   Validation + mailto fallback (or EmailJS if configured)
───────────────────────────────────────────── */
(function initContactForm() {
  if (!contactForm) return;

  // Helper: show/clear error
  function setError(fieldId, msg) {
    const errEl = document.getElementById(`${fieldId}-error`);
    const input = document.getElementById(fieldId);
    if (!errEl || !input) return;
    errEl.textContent = msg;
    input.classList.toggle('error', !!msg);
  }

  function clearErrors() {
    ['name', 'email', 'message'].forEach(id => setError(id, ''));
  }

  // Validate a single email address format
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Validate all form fields; returns true if valid
  function validateForm(name, email, message) {
    let valid = true;
    clearErrors();

    if (!name.trim()) {
      setError('name', '↑ Name is required');
      valid = false;
    }
    if (!email.trim()) {
      setError('email', '↑ Email is required');
      valid = false;
    } else if (!isValidEmail(email)) {
      setError('email', '↑ Please enter a valid email address');
      valid = false;
    }
    if (!message.trim()) {
      setError('message', '↑ Message is required');
      valid = false;
    } else if (message.trim().length < 10) {
      setError('message', '↑ Message must be at least 10 characters');
      valid = false;
    }

    return valid;
  }

  // Submit via EmailJS (if configured)
  async function sendWithEmailJS(name, email, message) {
    const { serviceId, templateId, publicKey } = CONFIG.emailjs;
    await window.emailjs.init(publicKey);
    return window.emailjs.send(serviceId, templateId, {
      from_name: name,
      from_email: email,
      message: message,
      to_email: CONFIG.email,
    });
  }

  // Fallback: open user's default mail client
  function sendWithMailto(name, email, message) {
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
  }

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name    = document.getElementById('name').value;
    const email   = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!validateForm(name, email, message)) return;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    formSuccess.textContent = '';

    try {
      if (CONFIG.emailjs.enabled && window.emailjs) {
        // EmailJS path
        await sendWithEmailJS(name, email, message);
        formSuccess.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        contactForm.reset();
      } else {
        // Mailto fallback
        sendWithMailto(name, email, message);
        formSuccess.textContent = '✓ Your mail client should open. If not, email me directly at ' + CONFIG.email;
      }
    } catch (err) {
      console.error('Form submission error:', err);
      formSuccess.style.color = 'var(--error)';
      formSuccess.textContent = '✕ Something went wrong. Please email me directly at ' + CONFIG.email;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    }
  });

  // Real-time validation: clear error on input
  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => setError(id, ''));
  });
})();

/* ─────────────────────────────────────────────
   7. BACK TO TOP BUTTON
───────────────────────────────────────────── */
(function initBackToTop() {
  if (!backToTop) return;
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─────────────────────────────────────────────
   8. SMOOTH ANCHOR SCROLL
   Ensures smooth scroll for all in-page links
───────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ─────────────────────────────────────────────
   9. ACTIVE NAV LINK STYLING
   CSS class for the active state
───────────────────────────────────────────── */
// Inject CSS for active nav link dynamically
(function injectActiveStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .nav__link.active {
      color: var(--accent) !important;
    }
    .nav__link.active::after {
      transform: scaleX(1) !important;
    }
  `;
  document.head.appendChild(style);
})();
