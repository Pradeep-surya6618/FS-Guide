# Student Portfolio Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a responsive, light-editorial student portfolio template as the fifth card in the Frontend projects row of the DevGuides landing page, with a live Preview and a downloadable zip.

**Architecture:** A standalone three-file static site (`index.html`, `style.css`, `script.js`) under `public/projects/Portfolio-Template/`, built the same way as every other frontend project on this site — no build step, no framework, no dependencies. The page is assembled section by section; each task appends markup to `index.html` and the matching rules to `style.css`, so the page is viewable and reviewable after every task. Interaction JavaScript and responsive rules land near the end, once all the markup exists to hook into.

**Tech Stack:** HTML5, CSS (custom properties, grid, flexbox, `clamp()`), vanilla JavaScript (`IntersectionObserver`, `localStorage`). Google Fonts: Instrument Serif, Inter, JetBrains Mono.

## Global Constraints

- **No build step, no npm, no dependencies.** The page must open correctly by double-clicking `index.html` from `file://`.
- **No external images.** All visual elements are CSS or inline SVG. Fonts are the only network request, and every font stack ends in a real system fallback (`serif` / `sans-serif` / `monospace`).
- **No gradients, no card shadows, no glassmorphism** anywhere in the template. Hairline `1px` rules and whitespace carry the layout.
- **One accent colour only** (`--accent`), used sparingly: link underlines, section numbers, the active nav marker.
- **Theme persistence key is exactly `portfolio-theme`** in `localStorage`, applied pre-paint by an inline `<head>` script so there is no flash.
- **No horizontal scroll at any width from 320px upward.**
- **Placeholder identity is the fictional student "Aarav Mehta"** — never the site author's real details.
- Every student-editable point carries an HTML comment of the form `<!-- ✏️ Replace ... -->`.
- Links a student must supply (`Résumé`, each project's `Live ↗` / `Code ↗`, socials) are `href="#"`. The contact address is a real `mailto:` to `aarav.mehta@example.com`.
- All new template files live in `public/projects/Portfolio-Template/`. `styles.css` and `script.js` **at the repo root are not modified** — the landing page needs markup only.

## How to verify (used by every task)

There is no test framework in this repo and none is being added — it is a static site. Verification is a mix of shell assertions and explicit browser checks.

Start a local server once and leave it running:

```bash
cd "d:/Incrix/Internship/May-Jun-Intern/Projects/FS-Method"
python -m http.server 5500
```

Then open `http://localhost:5500/public/projects/Portfolio-Template/index.html`.

If `python` is unavailable, use `npx serve .` and adjust the port in the URLs below.

---

## File Structure

| File | Responsibility |
|---|---|
| `public/projects/Portfolio-Template/index.html` | All markup: head, pre-paint theme script, topbar, hero, seven numbered sections, footer. |
| `public/projects/Portfolio-Template/style.css` | Design tokens, reset, type scale, every section's layout, responsive breakpoints. |
| `public/projects/Portfolio-Template/script.js` | Theme toggle, mobile menu, scroll reveal, scroll spy, topbar scrolled state, footer year. |
| `public/projects/Portfolio-Template/README.md` | How to open it and what to customise. |
| `public/downloads/portfolio-template.zip` | Zipped copy of the folder above. |
| `index.html` (repo root) | Modified: one new `.lp-card.proj-card` in the Frontend projects grid. |

---

## Task 1: Foundation — shell, tokens, topbar, footer, theme toggle

Creates the folder and all three files with a working document shell: fonts, design tokens, reset, type scale, a sticky topbar, a footer, and a persisting light/dark toggle.

**Files:**
- Create: `public/projects/Portfolio-Template/index.html`
- Create: `public/projects/Portfolio-Template/style.css`
- Create: `public/projects/Portfolio-Template/script.js`

**Interfaces:**
- Consumes: nothing.
- Produces: the CSS custom properties `--paper`, `--paper-2`, `--ink`, `--muted`, `--rule`, `--accent`, `--serif`, `--sans`, `--mono`, `--max`, `--gut`; the utility classes `.wrap`, `.sec`, `.sec-head`, `.num`, `.eyebrow`, `.reveal`; the element IDs `topbar`, `nav`, `theme-btn`, `menu-btn`, `year`; and the `<main class="wrap">` container that Tasks 2–6 append sections into, immediately before `<!-- SECTIONS END -->`.

- [ ] **Step 1: Create `index.html`**

The skip link points at `#about`, which Task 3 creates — it is inert until then. That is expected; do not change the href.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="A simple, premium student portfolio template built with HTML, CSS and JavaScript." />

  <!-- ✏️ Replace with your own name -->
  <title>Aarav Mehta — Student Portfolio</title>

  <!-- Applies the saved theme before the page paints, so there is no flash. -->
  <script>
    (function () {
      try {
        var t = localStorage.getItem('portfolio-theme');
        if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', t);
      } catch (e) {}
    })();
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <a class="skip" href="#about">Skip to content</a>

  <header class="topbar" id="topbar">
    <div class="bar">
      <!-- ✏️ Replace with your own name -->
      <a class="brand" href="#top">Aarav <span>Mehta</span></a>

      <nav class="nav" id="nav" aria-label="Sections">
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#experience">Experience</a>
        <a href="#certifications">Certificates</a>
        <a href="#education">Education</a>
        <a href="#contact">Contact</a>
      </nav>

      <div class="bar-actions">
        <button class="icon-btn" id="theme-btn" type="button" aria-label="Switch theme">
          <svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
          <svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
        </button>

        <button class="icon-btn menu-btn" id="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>
    </div>
  </header>

  <main class="wrap" id="top">

    <!-- SECTIONS END -->
  </main>

  <footer class="foot">
    <div class="wrap foot-in">
      <!-- ✏️ Replace with your own name -->
      <p class="foot-name">Aarav Mehta</p>
      <p class="foot-meta">© <span id="year">2026</span> · Built with HTML, CSS &amp; JavaScript</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `style.css`**

```css
/* =========================================================
   Student Portfolio Template — light editorial
   ✏️ Change the colours and fonts here; everything follows.
   ========================================================= */

:root {
  --paper:   #FAF8F4;
  --paper-2: #F3EFE8;
  --ink:     #14110E;
  --muted:   #6B635A;
  --rule:    #E4DED4;
  --accent:  #A8452A;

  --serif: "Instrument Serif", Georgia, "Times New Roman", serif;
  --sans:  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --mono:  "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

  --max: 1120px;
  --gut: clamp(20px, 5vw, 64px);
  --bar: 66px;
}

:root[data-theme="dark"] {
  --paper:   #12100E;
  --paper-2: #1A1714;
  --ink:     #F2EDE4;
  --muted:   #A29889;
  --rule:    #2A2622;
  --accent:  #D46A46;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; scroll-padding-top: calc(var(--bar) + 16px); }

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 1.0625rem;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
  transition: background .28s ease, color .28s ease;
}

img, svg { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }

::selection { background: var(--accent); color: var(--paper); }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px; }

.skip {
  position: absolute; left: -9999px; top: 8px;
  background: var(--ink); color: var(--paper);
  padding: 10px 16px; border-radius: 4px; z-index: 60;
  font-size: .9rem;
}
.skip:focus { left: 16px; }

/* ---------- layout ---------- */
.wrap { width: 100%; max-width: var(--max); margin-inline: auto; padding-inline: var(--gut); }

.sec { padding: clamp(56px, 9vw, 110px) 0; border-top: 1px solid var(--rule); }

.sec-head { display: flex; align-items: baseline; gap: 18px; margin-bottom: clamp(28px, 4vw, 52px); }
.sec-head h2 {
  font-family: var(--serif); font-weight: 400;
  font-size: clamp(1.9rem, 4vw, 2.9rem); line-height: 1.1; letter-spacing: -.01em;
}

.num, .eyebrow {
  font-family: var(--mono); font-size: .72rem; font-weight: 500;
  letter-spacing: .16em; text-transform: uppercase;
}
.num { color: var(--accent); }
.eyebrow { color: var(--muted); }

/* ---------- topbar ---------- */
.topbar {
  position: sticky; top: 0; z-index: 50;
  border-bottom: 1px solid transparent;
  transition: border-color .25s ease, background .25s ease;
}
.topbar.scrolled {
  border-bottom-color: var(--rule);
  background: color-mix(in srgb, var(--paper) 82%, transparent);
  backdrop-filter: saturate(1.4) blur(10px);
  -webkit-backdrop-filter: saturate(1.4) blur(10px);
}

.bar {
  width: 100%; max-width: var(--max); margin-inline: auto; padding-inline: var(--gut);
  height: var(--bar); display: flex; align-items: center; gap: 20px;
}

.brand { font-family: var(--serif); font-size: 1.25rem; letter-spacing: -.01em; white-space: nowrap; }
.brand span { font-style: italic; color: var(--muted); }

.nav { margin-left: auto; display: flex; gap: 22px; }
.nav a {
  position: relative; font-size: .875rem; color: var(--muted);
  padding: 4px 0; transition: color .2s ease;
}
.nav a:hover { color: var(--ink); }
.nav a.active { color: var(--ink); }
.nav a.active::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -2px;
  height: 1px; background: var(--accent);
}

.bar-actions { display: flex; align-items: center; gap: 6px; }

.icon-btn {
  width: 36px; height: 36px; display: grid; place-items: center;
  background: none; border: 1px solid transparent; border-radius: 6px;
  color: var(--muted); cursor: pointer;
  transition: color .2s ease, border-color .2s ease;
}
.icon-btn:hover { color: var(--ink); border-color: var(--rule); }
.icon-btn svg { width: 18px; height: 18px; }

.i-moon { display: none; }
:root[data-theme="dark"] .i-sun  { display: none; }
:root[data-theme="dark"] .i-moon { display: block; }

.menu-btn { display: none; }

/* ---------- reveal ---------- */
.reveal { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.reveal.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
}

/* ---------- footer ---------- */
.foot { border-top: 1px solid var(--rule); padding: 40px 0 56px; }
.foot-in { display: flex; flex-wrap: wrap; gap: 10px 24px; align-items: baseline; justify-content: space-between; }
.foot-name { font-family: var(--serif); font-size: 1.35rem; }
.foot-meta { font-family: var(--mono); font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
```

- [ ] **Step 3: Create `script.js`**

```js
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
```

- [ ] **Step 4: Verify the files exist and are wired together**

```bash
cd "d:/Incrix/Internship/May-Jun-Intern/Projects/FS-Method/public/projects/Portfolio-Template"
ls -1
grep -c "portfolio-theme" index.html script.js
```

Expected: `ls` lists `index.html`, `script.js`, `style.css`. The `grep -c` prints `index.html:1` and `script.js:1`.

- [ ] **Step 5: Verify in the browser**

Open `http://localhost:5500/public/projects/Portfolio-Template/index.html`.

Expected:
- Warm off-white page, "Aarav *Mehta*" top-left in a serif, seven nav links right, sun icon.
- Console is clean — no errors.
- Clicking the sun icon flips to the dark ink theme and the icon becomes a moon.
- Reload — the dark theme is still applied, and there is **no white flash** before paint.
- The footer shows the current year.

- [ ] **Step 6: Commit**

```bash
cd "d:/Incrix/Internship/May-Jun-Intern/Projects/FS-Method"
git add public/projects/Portfolio-Template
git commit -m "feat(portfolio): scaffold template shell with tokens, topbar and theme toggle"
```

---

## Task 2: Hero

**Files:**
- Modify: `public/projects/Portfolio-Template/index.html` (insert before `<!-- SECTIONS END -->`)
- Modify: `public/projects/Portfolio-Template/style.css` (append)

**Interfaces:**
- Consumes: `.wrap`, `.eyebrow`, `.reveal`, and the tokens from Task 1.
- Produces: `.btn`, `.btn.ghost` and `.lede` — all three are used only inside the hero; no later task consumes them.

- [ ] **Step 1: Insert the hero markup** immediately before `<!-- SECTIONS END -->` in `index.html`

```html
    <section class="hero reveal">
      <div class="hero-copy">
        <p class="eyebrow">Portfolio — 2026</p>

        <!-- ✏️ Replace this headline with your own one-liner -->
        <h1>Final-year CS student building <em>thoughtful</em> things for the web.</h1>

        <!-- ✏️ Replace with two lines about you -->
        <p class="lede">
          I like interfaces that stay out of the way — clean type, honest spacing and code
          a beginner can read. Currently looking for a frontend internship.
        </p>

        <div class="hero-links">
          <a class="btn" href="#projects">View work</a>
          <!-- ✏️ Point this at your résumé PDF -->
          <a class="btn ghost" href="#">Résumé</a>
        </div>
      </div>

      <div class="hero-portrait">
        <!-- ✏️ Replace the initials, or swap this whole block for an <img> -->
        <div class="frame"><span>AM</span></div>
        <p class="frame-cap">Coimbatore, India</p>
      </div>
    </section>
```

- [ ] **Step 2: Append the hero styles** to `style.css`

```css
/* ---------- hero ---------- */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: clamp(28px, 6vw, 72px);
  align-items: center;
  padding: clamp(48px, 10vw, 120px) 0 clamp(56px, 9vw, 110px);
}

.hero h1 {
  font-family: var(--serif); font-weight: 400;
  font-size: clamp(2.5rem, 7.2vw, 4.9rem);
  line-height: 1.04; letter-spacing: -.02em;
  margin: 18px 0 22px;
  text-wrap: balance;
}
.hero h1 em { font-style: italic; color: var(--accent); }

.lede { max-width: 46ch; color: var(--muted); }

.hero-links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }

.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 22px; border-radius: 999px;
  background: var(--ink); color: var(--paper);
  font-size: .9rem; font-weight: 500;
  border: 1px solid var(--ink);
  transition: transform .18s ease, opacity .18s ease;
}
.btn:hover { transform: translateY(-2px); opacity: .9; }

.btn.ghost { background: none; color: var(--ink); border-color: var(--rule); }
.btn.ghost:hover { border-color: var(--ink); }

.hero-portrait { justify-self: end; text-align: center; }

.frame {
  width: clamp(180px, 24vw, 260px);
  aspect-ratio: 4 / 5;
  border: 1px solid var(--rule);
  display: grid; place-items: center;
  background: var(--paper-2);
  position: relative;
}
.frame::after {
  content: ""; position: absolute; inset: 9px;
  border: 1px solid var(--rule);
  pointer-events: none;
}
.frame span {
  font-family: var(--serif);
  font-size: clamp(3rem, 6vw, 4.4rem);
  letter-spacing: .04em;
  color: var(--ink);
}

.frame-cap {
  margin-top: 12px;
  font-family: var(--mono); font-size: .68rem;
  letter-spacing: .14em; text-transform: uppercase; color: var(--muted);
}
```

- [ ] **Step 3: Verify in the browser**

Reload `http://localhost:5500/public/projects/Portfolio-Template/index.html`.

Expected:
- A large serif headline over three-ish lines with the word *thoughtful* in italic sienna.
- A 4:5 portrait frame on the right with a double hairline border and the monogram `AM`, captioned `COIMBATORE, INDIA`.
- Two pill buttons; `View work` is solid ink, `Résumé` is outlined. Both lift 2px on hover.
- Switch to dark mode — the frame, rules and accent all invert cleanly and nothing becomes unreadable.

- [ ] **Step 4: Commit**

```bash
cd "d:/Incrix/Internship/May-Jun-Intern/Projects/FS-Method"
git add public/projects/Portfolio-Template
git commit -m "feat(portfolio): add hero with serif headline and monogram frame"
```

---

## Task 3: About (01) and Skills (02)

**Files:**
- Modify: `public/projects/Portfolio-Template/index.html` (insert before `<!-- SECTIONS END -->`)
- Modify: `public/projects/Portfolio-Template/style.css` (append)

**Interfaces:**
- Consumes: `.sec`, `.sec-head`, `.num`, `.reveal`, `.lede`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Insert both sections** before `<!-- SECTIONS END -->`

```html
    <section class="sec reveal" id="about">
      <header class="sec-head"><span class="num">01</span><h2>About</h2></header>

      <div class="about-grid">
        <!-- ✏️ Replace with your own story, 3–4 sentences is plenty -->
        <p class="about-text">
          I started with a single HTML file and a lot of curiosity. Three years later I build
          responsive interfaces, small APIs and the occasional weekend tool — always trying to
          keep the code simple enough that the next person can follow it.
        </p>

        <dl class="facts">
          <div><dt>Location</dt><dd>Coimbatore, India</dd></div>
          <div><dt>Focus</dt><dd>Frontend &amp; UI engineering</dd></div>
          <div><dt>Status</dt><dd>Open to internships</dd></div>
        </dl>
      </div>
    </section>

    <section class="sec reveal" id="skills">
      <header class="sec-head"><span class="num">02</span><h2>Skills</h2></header>

      <!-- ✏️ Rename the rows and swap in your own tools -->
      <div class="skill-row">
        <span class="skill-label">Languages</span>
        <p class="skill-items">HTML · CSS · JavaScript · Python · SQL</p>
      </div>
      <div class="skill-row">
        <span class="skill-label">Frontend</span>
        <p class="skill-items">React · Responsive layout · Flexbox &amp; Grid · Accessibility</p>
      </div>
      <div class="skill-row">
        <span class="skill-label">Tools</span>
        <p class="skill-items">Git &amp; GitHub · VS Code · Figma · Postman · Vercel</p>
      </div>
    </section>
```

- [ ] **Step 2: Append the styles** to `style.css`

```css
/* ---------- about ---------- */
.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: clamp(28px, 5vw, 72px);
  align-items: start;
}

.about-text {
  font-family: var(--serif);
  font-size: clamp(1.25rem, 2.3vw, 1.65rem);
  line-height: 1.5;
  max-width: 34ch;
}

.facts { border-top: 1px solid var(--rule); }
.facts > div { display: flex; gap: 16px; padding: 13px 0; border-bottom: 1px solid var(--rule); }
.facts dt {
  flex: 0 0 34%;
  font-family: var(--mono); font-size: .68rem;
  letter-spacing: .14em; text-transform: uppercase; color: var(--muted);
  padding-top: .35em;
}
.facts dd { font-size: .95rem; }

/* ---------- skills ---------- */
.skill-row {
  display: grid;
  grid-template-columns: minmax(0, 220px) minmax(0, 1fr);
  gap: 16px clamp(20px, 4vw, 48px);
  padding: 20px 0;
  border-bottom: 1px solid var(--rule);
}
.skill-row:first-of-type { border-top: 1px solid var(--rule); }

.skill-label {
  font-family: var(--mono); font-size: .68rem;
  letter-spacing: .14em; text-transform: uppercase; color: var(--muted);
  padding-top: .35em;
}
.skill-items { font-size: 1.05rem; }
```

- [ ] **Step 3: Verify in the browser**

Reload the page and scroll past the hero.

Expected:
- `01 / About` — the number in mono sienna, the word "About" in serif, separated by a full-width hairline above.
- Two columns: a larger serif paragraph left, a three-row fact list right with hairlines between rows.
- `02 / Skills` — three rows, each `LABEL` in small mono caps on the left and the items on the right, hairline rules top and between. No pills, no badges.

- [ ] **Step 4: Commit**

```bash
cd "d:/Incrix/Internship/May-Jun-Intern/Projects/FS-Method"
git add public/projects/Portfolio-Template
git commit -m "feat(portfolio): add about and skills sections"
```

---

## Task 4: Projects (03)

**Files:**
- Modify: `public/projects/Portfolio-Template/index.html` (insert before `<!-- SECTIONS END -->`)
- Modify: `public/projects/Portfolio-Template/style.css` (append)

**Interfaces:**
- Consumes: `.sec`, `.sec-head`, `.num`, `.reveal`.
- Produces: `.tags` (reused in no later task) and `.arrow-link`, which Task 6 reuses for the social row.

- [ ] **Step 1: Insert the section** before `<!-- SECTIONS END -->`

```html
    <section class="sec reveal" id="projects">
      <header class="sec-head"><span class="num">03</span><h2>Selected work</h2></header>

      <div class="proj-grid">

        <!-- ✏️ Copy one <article> block per project you want to show -->
        <article class="proj-item">
          <div class="plate"><span class="plate-no">01</span></div>
          <h3>Weather Dashboard</h3>
          <p>Search any city and read its live conditions, pulled from a public weather API with <code>fetch</code> and async/await.</p>
          <ul class="tags"><li>HTML</li><li>CSS</li><li>JavaScript</li><li>REST API</li></ul>
          <div class="proj-links">
            <!-- ✏️ Point these at your live site and repo -->
            <a class="arrow-link" href="#">Live <span aria-hidden="true">↗</span></a>
            <a class="arrow-link" href="#">Code <span aria-hidden="true">↗</span></a>
          </div>
        </article>

        <article class="proj-item">
          <div class="plate"><span class="plate-no">02</span></div>
          <h3>Task Manager</h3>
          <p>A to-do app with filtering and drag-to-reorder. State lives in <code>localStorage</code>, so the list survives a refresh.</p>
          <ul class="tags"><li>React</li><li>Hooks</li><li>CSS Grid</li></ul>
          <div class="proj-links">
            <a class="arrow-link" href="#">Live <span aria-hidden="true">↗</span></a>
            <a class="arrow-link" href="#">Code <span aria-hidden="true">↗</span></a>
          </div>
        </article>

        <article class="proj-item">
          <div class="plate"><span class="plate-no">03</span></div>
          <h3>Campus Notes API</h3>
          <p>A small REST API for sharing lecture notes — Express routes, MongoDB documents and JWT-protected uploads.</p>
          <ul class="tags"><li>Node.js</li><li>Express</li><li>MongoDB</li><li>JWT</li></ul>
          <div class="proj-links">
            <a class="arrow-link" href="#">Live <span aria-hidden="true">↗</span></a>
            <a class="arrow-link" href="#">Code <span aria-hidden="true">↗</span></a>
          </div>
        </article>

      </div>
    </section>
```

- [ ] **Step 2: Append the styles** to `style.css`

```css
/* ---------- projects ---------- */
.proj-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: clamp(28px, 4vw, 48px);
}

.proj-item h3 {
  font-family: var(--serif); font-weight: 400;
  font-size: 1.5rem; line-height: 1.2; letter-spacing: -.01em;
  margin: 16px 0 8px;
}
.proj-item p { color: var(--muted); font-size: .95rem; }
.proj-item code {
  font-family: var(--mono); font-size: .82em;
  background: var(--paper-2); padding: 1px 5px; border-radius: 3px;
}

/* the "print plate" thumbnail — flat tone, hairline inset, oversized numeral */
.plate {
  aspect-ratio: 16 / 10;
  background: var(--paper-2);
  border: 1px solid var(--rule);
  display: grid; place-items: center;
  position: relative; overflow: hidden;
}
.plate::after {
  content: ""; position: absolute; inset: 10px;
  border: 1px solid var(--rule);
}
.plate-no {
  font-family: var(--serif);
  font-size: clamp(3.4rem, 7vw, 5rem);
  line-height: 1;
  color: var(--rule);
  transition: color .28s ease, transform .28s ease;
}
.proj-item:hover .plate-no { color: var(--accent); transform: translateY(-3px); }

.tags { display: flex; flex-wrap: wrap; gap: 6px 14px; margin: 14px 0 16px; }
.tags li {
  font-family: var(--mono); font-size: .66rem;
  letter-spacing: .12em; text-transform: uppercase; color: var(--muted);
}

.proj-links { display: flex; gap: 20px; }

.arrow-link {
  font-size: .85rem; font-weight: 500;
  padding-bottom: 2px;
  border-bottom: 1px solid var(--rule);
  transition: border-color .2s ease, color .2s ease;
}
.arrow-link:hover { color: var(--accent); border-bottom-color: var(--accent); }
.arrow-link span { display: inline-block; transition: transform .2s ease; }
.arrow-link:hover span { transform: translate(2px, -2px); }
```

- [ ] **Step 3: Verify in the browser**

Reload and scroll to `03 / Selected work`.

Expected:
- Three cards side by side on a wide screen. Each has a 16:10 flat plate with a double hairline inset and a very large pale serial number.
- Hovering a card turns its numeral sienna and nudges it up 3px.
- Tags are small mono uppercase, spaced, with no pill backgrounds.
- `Live ↗` and `Code ↗` sit under a hairline underline that turns sienna on hover, and the arrow shifts up-right.
- No shadows anywhere.

- [ ] **Step 4: Commit**

```bash
cd "d:/Incrix/Internship/May-Jun-Intern/Projects/FS-Method"
git add public/projects/Portfolio-Template
git commit -m "feat(portfolio): add selected-work grid with CSS print plates"
```

---

## Task 5: Experience (04), Certifications (05), Education (06)

**Files:**
- Modify: `public/projects/Portfolio-Template/index.html` (insert before `<!-- SECTIONS END -->`)
- Modify: `public/projects/Portfolio-Template/style.css` (append)

**Interfaces:**
- Consumes: `.sec`, `.sec-head`, `.num`, `.reveal`.
- Produces: `.rail`, used by both Experience and Education in this same task.

- [ ] **Step 1: Insert all three sections** before `<!-- SECTIONS END -->`

```html
    <section class="sec reveal" id="experience">
      <header class="sec-head"><span class="num">04</span><h2>Experience</h2></header>

      <!-- ✏️ Copy one .rail block per role -->
      <div class="rail">
        <p class="rail-date">2025 — Present</p>
        <div class="rail-body">
          <h3>Frontend Developer Intern</h3>
          <p class="org">Incrix Technologies · Coimbatore</p>
          <p>Built responsive marketing pages and a component library in plain HTML and CSS. Cut the landing page's load time by trimming unused CSS and inlining critical styles.</p>
        </div>
      </div>

      <div class="rail">
        <p class="rail-date">2024 — 2025</p>
        <div class="rail-body">
          <h3>Web Team Volunteer</h3>
          <p class="org">College Tech Club</p>
          <p>Maintained the club's event site, ran two beginner workshops on Git and shipped a registration form used by 400+ students.</p>
        </div>
      </div>
    </section>

    <section class="sec reveal" id="certifications">
      <header class="sec-head"><span class="num">05</span><h2>Certifications</h2></header>

      <div class="cert-grid">
        <!-- ✏️ Copy one .cert block per certificate -->
        <div class="cert">
          <p class="cert-issuer">freeCodeCamp</p>
          <h3>Responsive Web Design</h3>
          <p class="cert-year">2025</p>
        </div>
        <div class="cert">
          <p class="cert-issuer">Meta · Coursera</p>
          <h3>Front-End Developer</h3>
          <p class="cert-year">2025</p>
        </div>
        <div class="cert">
          <p class="cert-issuer">Smart India Hackathon</p>
          <h3>Regional Finalist</h3>
          <p class="cert-year">2024</p>
        </div>
      </div>
    </section>

    <section class="sec reveal" id="education">
      <header class="sec-head"><span class="num">06</span><h2>Education</h2></header>

      <!-- ✏️ Copy one .rail block per qualification -->
      <div class="rail">
        <p class="rail-date">2023 — 2027</p>
        <div class="rail-body">
          <h3>B.E. Computer Science &amp; Engineering</h3>
          <p class="org">Anna University · CGPA 8.6</p>
          <p>Coursework in data structures, databases, operating systems and web technologies.</p>
        </div>
      </div>

      <div class="rail">
        <p class="rail-date">2021 — 2023</p>
        <div class="rail-body">
          <h3>Higher Secondary, Computer Science</h3>
          <p class="org">Kendriya Vidyalaya · 92%</p>
          <p>School topper in computer science; built the school's first student-run results portal.</p>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Append the styles** to `style.css`

```css
/* ---------- rail (experience + education) ---------- */
.rail {
  display: grid;
  grid-template-columns: minmax(0, 200px) minmax(0, 1fr);
  gap: 10px clamp(20px, 4vw, 48px);
  padding: 26px 0;
  border-bottom: 1px solid var(--rule);
}
.rail:first-of-type { border-top: 1px solid var(--rule); }

.rail-date {
  font-family: var(--mono); font-size: .68rem;
  letter-spacing: .14em; text-transform: uppercase; color: var(--muted);
  padding-top: .5em;
}
.rail-body h3 {
  font-family: var(--serif); font-weight: 400;
  font-size: 1.4rem; line-height: 1.25;
}
.rail-body .org { font-size: .9rem; color: var(--accent); margin: 2px 0 8px; }
.rail-body p:last-child { color: var(--muted); font-size: .95rem; max-width: 62ch; }

/* ---------- certifications ---------- */
.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: clamp(16px, 2.5vw, 24px);
}
.cert { border: 1px solid var(--rule); padding: 22px; }
.cert-issuer,
.cert-year {
  font-family: var(--mono); font-size: .66rem;
  letter-spacing: .14em; text-transform: uppercase; color: var(--muted);
}
.cert h3 {
  font-family: var(--serif); font-weight: 400;
  font-size: 1.3rem; line-height: 1.25; margin: 8px 0 10px;
}
```

- [ ] **Step 3: Verify in the browser**

Reload and scroll through sections 04, 05 and 06.

Expected:
- Experience: two rows, mono date in a fixed left rail, role in serif, organisation in sienna, description in muted grey. Hairlines above, between and below.
- Certifications: three bordered cards in a row, issuer in mono caps above a serif title, year in mono caps below.
- Education: the same rail pattern as Experience, two entries.
- Section numbers read `04`, `05`, `06` in order.

- [ ] **Step 4: Commit**

```bash
cd "d:/Incrix/Internship/May-Jun-Intern/Projects/FS-Method"
git add public/projects/Portfolio-Template
git commit -m "feat(portfolio): add experience, certifications and education sections"
```

---

## Task 6: Contact (07)

**Files:**
- Modify: `public/projects/Portfolio-Template/index.html` (insert before `<!-- SECTIONS END -->`)
- Modify: `public/projects/Portfolio-Template/style.css` (append)

**Interfaces:**
- Consumes: `.sec`, `.sec-head`, `.num`, `.reveal`, `.arrow-link` (from Task 4).
- Produces: nothing consumed by later tasks. This is the last section, so after this task `<!-- SECTIONS END -->` has all seven sections above it.

- [ ] **Step 1: Insert the section** before `<!-- SECTIONS END -->`

```html
    <section class="sec reveal" id="contact">
      <header class="sec-head"><span class="num">07</span><h2>Contact</h2></header>

      <p class="contact-line">Let's build <em>something</em>.</p>

      <!-- ✏️ Replace with your real email address -->
      <a class="contact-mail" href="mailto:aarav.mehta@example.com">aarav.mehta@example.com</a>

      <!-- ✏️ Point these at your real profiles -->
      <ul class="socials">
        <li><a class="arrow-link" href="#">GitHub <span aria-hidden="true">↗</span></a></li>
        <li><a class="arrow-link" href="#">LinkedIn <span aria-hidden="true">↗</span></a></li>
        <li><a class="arrow-link" href="#">Twitter <span aria-hidden="true">↗</span></a></li>
      </ul>
    </section>
```

- [ ] **Step 2: Append the styles** to `style.css`

```css
/* ---------- contact ---------- */
.contact-line {
  font-family: var(--serif); font-weight: 400;
  font-size: clamp(2.2rem, 6.5vw, 4.2rem);
  line-height: 1.05; letter-spacing: -.02em;
  text-wrap: balance;
}
.contact-line em { font-style: italic; color: var(--accent); }

.contact-mail {
  display: inline-block;
  margin: 26px 0 34px;
  font-family: var(--serif);
  font-size: clamp(1.3rem, 3vw, 2rem);
  border-bottom: 1px solid var(--rule);
  padding-bottom: 4px;
  transition: color .2s ease, border-color .2s ease;
  word-break: break-word;
}
.contact-mail:hover { color: var(--accent); border-bottom-color: var(--accent); }

.socials { display: flex; flex-wrap: wrap; gap: 12px 26px; }
```

- [ ] **Step 3: Verify in the browser**

Reload and scroll to the bottom.

Expected:
- `07 / Contact`, then an oversized serif line "Let's build *something*." with the italic word in sienna.
- The email below it is a large serif link with a hairline underline that turns sienna on hover; clicking it opens a mail client.
- Three social links in a row, styled like the project links.
- All seven section numbers are present and sequential: 01–07.

- [ ] **Step 4: Commit**

```bash
cd "d:/Incrix/Internship/May-Jun-Intern/Projects/FS-Method"
git add public/projects/Portfolio-Template
git commit -m "feat(portfolio): add contact section"
```

---

## Task 7: Interaction JavaScript — mobile menu, scroll reveal, scroll spy

All seven sections and the nav now exist, so the remaining JavaScript has real targets to bind to.

**Files:**
- Modify: `public/projects/Portfolio-Template/script.js` (append)
- Modify: `public/projects/Portfolio-Template/style.css` (append the `.nav.open` and `body.nav-open` rules)

**Interfaces:**
- Consumes: `#menu-btn`, `#nav`, `.nav a`, `.reveal` from Tasks 1–6.
- Produces: the classes `.nav.open`, `body.nav-open`, and `.nav a.active` (styled in Task 1), consumed by the Task 8 breakpoints.

- [ ] **Step 1: Append the interaction code** to `script.js`

```js
/* ---- 4. Mobile menu ------------------------------------- */
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

/* ---- 5. Reveal sections on scroll ----------------------- */
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

/* ---- 6. Highlight the nav link for the section in view --- */
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
```

- [ ] **Step 2: Append the open-menu styles** to `style.css`

```css
/* ---------- mobile menu (the drop-down itself arrives at the ≤900px breakpoint) ---------- */
body.nav-open { overflow: hidden; }
```

- [ ] **Step 3: Verify the reveal and spy in the browser**

Reload with a hard refresh (`Ctrl+Shift+R`) and scroll slowly from top to bottom.

Expected:
- Each section fades and slides up 14px as it enters view, once only — scrolling back up does not replay it.
- The nav link for the section you are looking at turns full-ink with a sienna hairline underneath; it moves as you scroll.
- Console is clean.

- [ ] **Step 4: Verify reduced motion**

In Chrome DevTools: `Ctrl+Shift+P` → run **"Emulate CSS prefers-reduced-motion: reduce"** → hard refresh.

Expected: every section is fully visible immediately, with no fade or slide.

Turn the emulation off again before continuing.

- [ ] **Step 5: Verify the menu wiring**

The hamburger is still hidden at desktop width (Task 8 reveals it), so check it from the console:

```js
document.getElementById('menu-btn').click();
document.getElementById('nav').classList.contains('open');   // → true
document.body.classList.contains('nav-open');                // → true
```

Then press `Escape` and re-run the two checks.

Expected: both now return `false`.

- [ ] **Step 6: Commit**

```bash
cd "d:/Incrix/Internship/May-Jun-Intern/Projects/FS-Method"
git add public/projects/Portfolio-Template
git commit -m "feat(portfolio): add mobile menu, scroll reveal and scroll spy"
```

---

## Task 8: Responsive breakpoints

**Files:**
- Modify: `public/projects/Portfolio-Template/style.css` (append — these must be the last rules in the file so they override the desktop defaults)

**Interfaces:**
- Consumes: every class defined in Tasks 1–7.
- Produces: nothing.

- [ ] **Step 1: Append the media queries** to the **end** of `style.css`

```css
/* =========================================================
   Responsive
   ========================================================= */

/* The inline nav needs ~780px for seven links plus the brand and two buttons,
   so the hamburger takes over at 900px — the same point the hero stacks. */
@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; gap: 34px; }
  .hero-portrait { justify-self: start; text-align: left; order: -1; }
  .about-grid { grid-template-columns: 1fr; }
  .about-text { max-width: none; }

  .menu-btn { display: grid; }

  .nav {
    position: fixed;
    inset: var(--bar) 0 auto 0;
    margin-left: 0;
    flex-direction: column;
    gap: 0;
    padding: 8px var(--gut) 22px;
    background: var(--paper);
    border-bottom: 1px solid var(--rule);
    transform: translateY(-12px);
    opacity: 0;
    visibility: hidden;
    transition: opacity .22s ease, transform .22s ease, visibility .22s;
  }
  .nav.open { transform: none; opacity: 1; visibility: visible; }

  .nav a { padding: 12px 0; font-size: 1rem; border-bottom: 1px solid var(--rule); }
  .nav a:last-child { border-bottom: 0; }
  .nav a.active::after { display: none; }
  .nav a.active { color: var(--accent); }
}

@media (max-width: 700px) {
  .proj-grid { grid-template-columns: 1fr; gap: 40px; }

  .skill-row,
  .rail { grid-template-columns: 1fr; gap: 6px; }
  .skill-label,
  .rail-date { padding-top: 0; }

  .facts > div { flex-direction: column; gap: 2px; }
  .facts dt { flex: none; padding-top: 0; }
}

@media (max-width: 420px) {
  :root { --bar: 58px; }

  .hero h1 { font-size: 2.15rem; }
  .sec-head h2 { font-size: 1.6rem; }
  .contact-line { font-size: 1.95rem; }
  .contact-mail { font-size: 1.15rem; }

  .hero-links { gap: 10px; }
  .btn { padding: 10px 18px; font-size: .85rem; }
  .cert { padding: 18px; }
}
```

- [ ] **Step 2: Verify each breakpoint**

Open DevTools device toolbar (`Ctrl+Shift+M`) and step through these widths. The 940px row is the one that catches a nav that no longer fits — do not skip it.

| Width | Expected |
|---|---|
| 1280px | Two-column hero and about; three project cards in a row; inline nav; no hamburger. |
| 940px | Still inline nav — all seven links visible and **not** overlapping the brand or the icon buttons. |
| 880px | Hero stacked with the portrait **above** the headline; about single column. Hamburger visible, inline nav gone. Tap it — the menu drops down under the bar and the page behind cannot scroll. Tap a link — it navigates and the menu closes. Press `Escape` — it closes. |
| 660px | Projects one per row; skills rows, fact list and timeline rails fully stacked (label above value). |
| 380px | Headline noticeably smaller, buttons tighter. |
| 320px | Everything still readable. |

- [ ] **Step 3: Verify there is no horizontal overflow**

At **each** of the widths above, run in the console:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

Expected: `true` every time.

- [ ] **Step 4: Verify dark mode at mobile width**

At 380px, toggle to dark mode and scroll the whole page.

Expected: the drop-down menu background is the dark paper tone (not transparent, nothing showing through), and every section stays legible.

- [ ] **Step 5: Commit**

```bash
cd "d:/Incrix/Internship/May-Jun-Intern/Projects/FS-Method"
git add public/projects/Portfolio-Template
git commit -m "feat(portfolio): add responsive breakpoints and mobile drop-down nav"
```

---

## Task 9: README, zip and the landing-page card

Packages the finished template and wires it into the DevGuides landing page.

**Files:**
- Create: `public/projects/Portfolio-Template/README.md`
- Create: `public/downloads/portfolio-template.zip`
- Modify: `index.html` (repo root) — insert one card after the Movie App card, which currently ends at line 375

**Interfaces:**
- Consumes: the finished template folder from Tasks 1–8.
- Produces: nothing.

- [ ] **Step 1: Create `public/projects/Portfolio-Template/README.md`**

```markdown
# Student Portfolio Template

A simple, responsive portfolio you can make your own in about twenty minutes.
Plain HTML, CSS and JavaScript — no build step, no frameworks, no npm.

## Open it

Double-click `index.html`. That's it.

If your browser blocks the web fonts on `file://`, run a tiny server instead:

```bash
python -m http.server 5500
# then open http://localhost:5500
```

## Files

| File | What's in it |
|------|--------------|
| `index.html` | All the content — topbar, hero, seven sections, footer. |
| `style.css` | Colours, fonts and every layout rule. |
| `script.js` | Theme toggle, mobile menu, scroll effects. |

## Make it yours

Search `index.html` for **✏️** — every spot you need to edit is marked.

1. **Your name** — three places: the `<title>`, the topbar brand, the footer.
2. **Headline and intro** — in the `.hero` block.
3. **Links** — the `Résumé` button, each project's `Live` and `Code`, and the three
   social links are all `href="#"`. Point them at real URLs.
4. **Email** — change the `mailto:` in the contact section.
5. **Add a project** — copy one whole `<article class="proj-item">` block and change
   the number, title, description, tags and links.
6. **Add a job or a degree** — copy one whole `<div class="rail">` block.
7. **Photo instead of initials** — replace `<div class="frame"><span>AM</span></div>`
   with `<img class="frame" src="me.jpg" alt="Your name">`.

## Change the colours

Everything comes from a handful of variables at the top of `style.css`:

```css
:root {
  --paper:  #FAF8F4;   /* page background */
  --ink:    #14110E;   /* main text       */
  --muted:  #6B635A;   /* secondary text  */
  --rule:   #E4DED4;   /* hairlines       */
  --accent: #A8452A;   /* the one accent  */
}
```

Change `--accent` first — it's the fastest way to make the page feel like yours.
The dark theme lives right below in the `:root[data-theme="dark"]` block.

## Fonts

Instrument Serif for headings, Inter for body text, JetBrains Mono for the small
uppercase labels. They load from Google Fonts and fall back to your system fonts
if you're offline.
```

- [ ] **Step 2: Build the zip**

```powershell
cd "d:\Incrix\Internship\May-Jun-Intern\Projects\FS-Method"
Compress-Archive -Path "public\projects\Portfolio-Template" -DestinationPath "public\downloads\portfolio-template.zip" -Force
```

Run this with the **PowerShell** tool, not Bash — `Compress-Archive` is a PowerShell cmdlet.

- [ ] **Step 3: Verify the zip contents**

```powershell
Add-Type -AssemblyName System.IO.Compression.FileSystem
[IO.Compression.ZipFile]::OpenRead("d:\Incrix\Internship\May-Jun-Intern\Projects\FS-Method\public\downloads\portfolio-template.zip").Entries | Select-Object -ExpandProperty FullName
```

Expected — exactly these four entries:

```
Portfolio-Template/index.html
Portfolio-Template/README.md
Portfolio-Template/script.js
Portfolio-Template/style.css
```

If the archive is empty or nested one level too deep, delete it and re-run Step 2 from the repo root.

- [ ] **Step 4: Add the card to the landing page**

In the repo-root `index.html`, find the Movie App card — it is the last `.lp-card.proj-card` inside the Frontend `.lp-grid`, ending with `</div>` on line 375, immediately before the blank line and the closing `</div>` of the grid on line 377.

Insert this block after it, so it becomes the fifth card in the Frontend grid:

```html

        <div class="lp-card proj-card">
          <span class="lp-card-ico bg-mint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a4 4 0 0 1 4 4v1H8V7a4 4 0 0 1 4-4z"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg></span>
          <h3>Portfolio Template</h3>
          <p>A responsive student portfolio with a premium editorial design — dark mode, scroll animations &amp; ready to fill in with your own details.</p>
          <div class="proj-actions">
            <a class="proj-btn preview" href="public/projects/Portfolio-Template/index.html" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg> Preview</a>
            <a class="proj-btn dl" href="public/downloads/portfolio-template.zip" download><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></svg> .zip</a>
          </div>
        </div>
```

- [ ] **Step 5: Verify the card markup**

```bash
cd "d:/Incrix/Internship/May-Jun-Intern/Projects/FS-Method"
grep -c "Portfolio Template" index.html
grep -n "portfolio-template.zip\|Portfolio-Template/index.html" index.html
git diff --stat index.html
```

Expected: the count is `1`; both hrefs appear once each; `git diff --stat` shows `index.html` with roughly 10 insertions and 0 deletions. **If any line shows as deleted, an existing card was overwritten — revert with `git checkout index.html` and redo Step 4 as a pure insertion.**

- [ ] **Step 6: Verify the two link targets actually exist**

```bash
cd "d:/Incrix/Internship/May-Jun-Intern/Projects/FS-Method"
ls -l public/projects/Portfolio-Template/index.html public/downloads/portfolio-template.zip
```

Expected: both files listed, the zip larger than 5 KB.

- [ ] **Step 7: Verify on the landing page**

Open `http://localhost:5500/index.html` and scroll to **Projects → 🎨 Frontend projects**.

Expected:
- Five cards: Landing Page, Calculator, Weather App, Movie App, **Portfolio Template**.
- The new card has a green/teal (`bg-mint`) icon tile and looks identical in shape to its neighbours — same button sizes, same spacing.
- **Preview** opens the template in a new tab and it renders fully.
- **.zip** downloads `portfolio-template.zip`. Extract it and open the extracted `index.html` directly from `file://` — the page renders, the theme toggle works, the console is clean.
- Resize the landing page to 380px — the Frontend grid stacks to one column and the new card behaves like the rest.

- [ ] **Step 8: Commit**

```bash
cd "d:/Incrix/Internship/May-Jun-Intern/Projects/FS-Method"
git add public/projects/Portfolio-Template/README.md public/downloads/portfolio-template.zip index.html
git commit -m "feat: add Portfolio Template to Frontend projects with preview and zip"
```

---

## Final acceptance

Run through the spec's verification list once, end to end:

- [ ] `public/projects/Portfolio-Template/index.html` opens directly from `file://` — every section renders, no console errors, no missing assets.
- [ ] Theme toggles, persists across reload, and there is no flash of the wrong theme.
- [ ] From 1440px down to 320px there is no horizontal scrollbar; the hamburger appears at 900px and opens and closes.
- [ ] The landing page shows five Frontend cards; Preview and .zip both work.
- [ ] The zip contains all four files and the extracted copy runs standalone.
