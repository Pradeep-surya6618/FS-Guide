/* =========================================================
   Student Portfolio Template — interactions
   Plain JavaScript, no libraries.
   ========================================================= */

/* ---- 1. Topbar hairline once scrolled ------------------- */
var topbar = document.getElementById('topbar');

window.addEventListener('scroll', function () {
  topbar.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

/* ---- 2. Footer year ------------------------------------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---- 3. Mobile menu ------------------------------------- */
var menuBtn = document.getElementById('menu-btn');
var nav = document.getElementById('nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  document.body.classList.toggle('nav-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

menuBtn.addEventListener('click', function () {
  setMenu(!nav.classList.contains('open'));
});

nav.addEventListener('click', function (e) {
  if (e.target.tagName === 'A') setMenu(false);
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') setMenu(false);
});

/* ---- 4. Reveal sections on scroll ----------------------- */
var revealItems = document.querySelectorAll('.reveal');
var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach(function (el) { el.classList.add('in'); });
} else {
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  revealItems.forEach(function (el) { revealObserver.observe(el); });
}

/* ---- 5. Highlight the nav link for the section in view --- */
var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));

if ('IntersectionObserver' in window) {
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  navLinks.forEach(function (link) {
    var section = document.querySelector(link.getAttribute('href'));
    if (section) spy.observe(section);
  });
}
