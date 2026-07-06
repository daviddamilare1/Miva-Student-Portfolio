    // Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });


  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}



// Highlight active nav link based on current page
function setActiveNav() {
  const currentPath = window.location.pathname;

  document.querySelectorAll(".nav-links a").forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname;

    link.classList.toggle("active", linkPath === currentPath);
  });
}

document.addEventListener("DOMContentLoaded", setActiveNav);

// function setActiveNav() {
//   const page = location.pathname.split('/').pop() || 'index.html';
//   document.querySelectorAll('.nav-links a').forEach(a => {
//     const href = a.getAttribute('href');
//     a.classList.toggle('active', href === page);
//   });
// }
// setActiveNav();



      // Scroll Reveal
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}
document.addEventListener('DOMContentLoaded', initReveal);



      // Contact form
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: {
      el: form.querySelector('#name'),
      err: form.querySelector('#nameError'),
      validate: v => v.trim().length >= 2,
      msg: 'Please enter your full name (at least 2 characters).'
    },
    email: {
      el: form.querySelector('#email'),
      err: form.querySelector('#emailError'),
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      msg: 'Please enter a valid email address.'
    },
    phone: {
      el: form.querySelector('#phone'),
      err: form.querySelector('#phoneError'),
      validate: v => /^\d{7,15}$/.test(v.replace(/[\s\-\+\(\)]/g, '')),
      msg: 'Phone number must contain only digits (7–15 digits).'
    },
    message: {
      el: form.querySelector('#message'),
      err: form.querySelector('#messageError'),
      validate: v => v.trim().length >= 10,
      msg: 'Message must be at least 10 characters.'
    }
  };

  function validateField(key) {
    const { el, err, validate, msg } = fields[key];
    const group = el.closest('.form-group');
    const valid = validate(el.value);
    group.classList.toggle('error', !valid);
    group.classList.toggle('success', valid);
    if (err) err.textContent = valid ? '' : msg;
    return valid;
  }

  Object.keys(fields).forEach(key => {
    const el = fields[key].el;
    if (el) {
      el.addEventListener('blur', () => validateField(key));
      el.addEventListener('input', () => {
        if (el.closest('.form-group').classList.contains('error')) validateField(key);
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allValid = Object.keys(fields).map(validateField).every(Boolean);
    const successEl = document.getElementById('formSuccess');
    if (allValid) {
      if (successEl) {
        successEl.style.display = 'block';
        successEl.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
      }
      setTimeout(() => form.reset(), 200);
      Object.keys(fields).forEach(key => {
        const group = fields[key].el.closest('.form-group');
        group.classList.remove('success', 'error');
      });
      setTimeout(() => { if (successEl) successEl.style.display = 'none'; }, 5000);
    }
  });
}

document.addEventListener('DOMContentLoaded', initContactForm);
