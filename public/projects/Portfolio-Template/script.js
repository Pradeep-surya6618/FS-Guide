/* =========================================================
   Student Portfolio Template — interactions
   Plain JavaScript, no libraries.
   ========================================================= */

/* ---- 1. Light / dark theme ------------------------------ */
var root = document.documentElement;
var themeBtn = document.getElementById('theme-btn');

themeBtn.addEventListener('click', function () {
  var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('portfolio-theme', next); } catch (e) {}
});

/* ---- 2. Topbar hairline once scrolled ------------------- */
var topbar = document.getElementById('topbar');

window.addEventListener('scroll', function () {
  topbar.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

/* ---- 3. Footer year ------------------------------------- */
document.getElementById('year').textContent = new Date().getFullYear();
