# Student Portfolio Template — Design

**Date:** 2026-08-07
**Status:** Approved

## Goal

Add a fifth project to the **Frontend projects** row on the DevGuides landing page: a
responsive student portfolio template with a premium, editorial visual design. Like the
other four frontend projects, the card offers a live **Preview** and a **.zip** download.

## Context

DevGuides is a static multi-page site — plain HTML, CSS and JavaScript, no build step.
The Frontend projects grid lives in `index.html` (currently Landing Page, Calculator,
Weather App, Movie App). Each card follows one shape:

- a gradient icon tile (`.lp-card-ico` + a `bg-*` class)
- an `<h3>` title and a one-sentence description
- `.proj-actions` holding `.proj-btn.preview` (opens the standalone file in a new tab)
  and `.proj-btn.dl` (downloads a zip from `public/downloads/`)

Project sources live under `public/projects/`. `.lp-grid` is
`repeat(auto-fill, minmax(258px, 1fr))`, so a fifth card flows in without any CSS change.

## Approach

Build the template as a three-file static site — `index.html`, `style.css`, `script.js` —
matching every other frontend project.

Two alternatives were rejected:

- **Multi-page** (index / work / about) duplicates the nav and footer on every page and
  adds routing a student template does not need.
- **Single self-contained HTML file** is easy to hand over but hides the file separation
  the HTML and CSS guides teach.

## Deliverables

```
public/projects/Portfolio-Template/
  index.html
  style.css
  script.js
  README.md
public/downloads/portfolio-template.zip
```

Plus one new card in the Frontend projects grid in `index.html`.

## Visual System

Light editorial / print. Whitespace and hairline rules carry the layout; there are no card
shadows, no glassmorphism and no gradients anywhere in the template.

### Palette

| Token | Light | Dark |
|---|---|---|
| `--paper` | `#FAF8F4` | `#12100E` |
| `--ink` | `#14110E` | `#F2EDE4` |
| `--muted` | `#6B635A` | `#A29889` |
| `--rule` | `#E4DED4` | `#2A2622` |
| `--accent` | `#A8452A` | `#D46A46` |

One accent only, used sparingly: link underlines, the active nav marker, section numbers
on hover. The dark theme is ink-on-ink — the same editorial character inverted, not a
generic dark mode.

### Typography

- **Display** — Instrument Serif. Set large, high contrast. Headlines mix roman and
  *italic* within a single line.
- **Body** — Inter (already used site-wide).
- **Meta** — JetBrains Mono, uppercase, letter-spaced. Carries section numbers
  (`01 / ABOUT`), dates and project tags. The mono-against-serif contrast is what makes
  the page read as premium.

Fonts load from Google Fonts with real `serif` / `sans-serif` / `monospace` fallbacks, so
the page degrades gracefully offline.

## Sections

| # | Section | Treatment |
|---|---|---|
| — | Topbar | Sticky. Name left, nav right, theme toggle. Hairline bottom rule; background blurs once scrolled past the hero. |
| — | Hero | Mono eyebrow `PORTFOLIO — 2026`, three-line serif headline with one italic phrase, short paragraph, `View work` and `Résumé` links, monogram portrait frame at the right. |
| 01 | About | Two columns — a large serif paragraph left, a hairline-separated fact list right (Location, Focus, Status). |
| 02 | Skills | Three labelled rows (Languages, Frontend, Tools) separated by hairlines. Deliberately not badge-soup. |
| 03 | Projects | Two-column grid. Each entry: 16:10 CSS-drawn thumbnail, serif title, one-line description, mono tags, `Live ↗` and `Code ↗` links. Three sample entries. |
| 04 | Experience | Timeline — mono dates in a left rail, role, company and two lines of detail on the right. Two entries. |
| 05 | Certifications | Compact card row — issuer, title, year. Three entries. |
| 06 | Education | Same left-rail pattern as Experience. Two entries. |
| 07 | Contact | Oversized serif line, email as a large underlined link, social row. No form. |
| — | Footer | Name, auto-updating year, "Built with HTML, CSS & JavaScript". |

## JavaScript

Roughly 90 lines of vanilla JavaScript, no dependencies, readable end to end by a
beginner:

1. **Theme toggle** — persists to `localStorage` under the key `portfolio-theme`. A small
   inline script in `<head>` applies the saved theme before first paint so there is no
   flash, mirroring the convention used across DevGuides.
2. **Mobile menu** — toggles the nav open on narrow screens; closes on link click and on
   `Escape`.
3. **Scroll reveal** — `IntersectionObserver` adds a visible class to sections. Skipped
   entirely when `prefers-reduced-motion: reduce` matches.
4. **Scroll spy** — marks the nav link for the section currently in view.
5. **Footer year** — writes the current year on load.

Smooth scrolling comes from CSS `scroll-behavior: smooth`, not JavaScript.

## Assets and Content

No external images. The portrait frame and the three project thumbnails are drawn with
CSS and inline SVG, which keeps the zip small and means nothing breaks when the page is
opened from `file://` with no network.

Placeholder content uses a fictional student, **Aarav Mehta**, so the page reads as a
finished site rather than a wireframe. Every editable point carries an HTML comment in the
form `<!-- ✏️ Replace this -->` so a student knows exactly what to change. `README.md`
explains how to open the file, where to swap the name, links and colours, and how to add a
project entry.

Outbound links that a student must supply — the hero `Résumé` button, each project's
`Live ↗` and `Code ↗`, and the social row — use `href="#"` with an adjacent replace
comment. The contact email is a real `mailto:` to the placeholder address so the
interaction is demonstrably working.

The zip is produced from the finished folder with PowerShell `Compress-Archive`, so that
extracting it yields a `Portfolio-Template/` directory containing the four files.

## Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| ≥ 901px | Full two-column editorial layout, inline nav. |
| ≤ 900px | Hero stacks (portrait above text); About collapses to one column; the hamburger menu replaces the inline nav. |
| ≤ 700px | Projects collapse to one column; the skills rows, fact list and timeline rails stack. |
| ≤ 420px | Display type steps down three sizes; horizontal padding tightens. |

The hamburger arrives at 900px rather than the narrower 720px first considered: the seven
nav links plus the brand and two icon buttons need roughly 780px of bar, so an inline nav
would overflow between 720px and 780px.

The page must never scroll horizontally at any width from 320px up.

## Landing Page Integration

A fifth `.lp-card.proj-card` is appended to the Frontend projects grid in `index.html`,
after the Movie App card. It uses the `bg-mint` icon gradient — the only `bg-*` class not
already used in that row — and reuses the existing Preview and .zip button markup
verbatim, including the same inline SVG icons, `target="_blank" rel="noopener"` on Preview
and `download` on the zip link.

- Title: **Portfolio Template**
- Preview href: `public/projects/Portfolio-Template/index.html`
- Zip href: `public/downloads/portfolio-template.zip`

No changes to `styles.css` or `script.js` at the site root — the grid already reflows to
accommodate a fifth card.

## Out of Scope

- A dedicated guide page (the pattern `organic-store.html` follows). Frontend projects
  link straight to the running file; this one does the same.
- A contact form or any backend.
- Adding the template to any topic guide's mini-projects section.

## Verification

1. Open `public/projects/Portfolio-Template/index.html` directly in a browser — every
   section renders, no console errors, no missing assets.
2. Toggle the theme, reload — the choice persists and there is no flash of the wrong
   theme.
3. Resize from 1440px down to 320px — no horizontal scrollbar; the menu becomes a
   hamburger at 900px and the hamburger opens and closes.
4. Open the landing page — the Frontend row shows five cards, and both new buttons work
   (Preview opens in a new tab, .zip downloads and extracts to a working folder).
5. Confirm the zip contains all four files and that the extracted `index.html` opens
   standalone.
