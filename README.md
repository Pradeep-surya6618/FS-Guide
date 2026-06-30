# Full Stack Guide — Documentation Landing Page

A **beautiful, colorful, documentation-style landing page** that teaches complete beginners how to build and deploy a full-stack app with **React + Node.js + Express + MongoDB** — from installing software all the way to deploying on Vercel.

> ⚠️ This project is the **teaching website itself** (the docs page). It is *not* the React app being taught. The React/Express/MongoDB app is explained **inside** the page as copyable code and step-by-step lessons.

---

## ✨ What's inside

A single, self-contained static site — **no build step, no framework, no Tailwind**:

| File | Purpose |
|------|---------|
| `index.html` | All the content: hero, roadmap, and 18 teaching sections. |
| `styles.css` | The full design system (gradients, glassmorphism, dark/light themes, animations, responsive layout). |
| `script.js` | All interactivity (vanilla JS, zero dependencies). |

### Features
- 🎨 Colorful gradient + **glassmorphism** UI
- 🌗 **Dark / light mode** toggle (remembers your choice)
- 📌 **Sticky sidebar** navigation with scroll-spy highlighting
- 📊 **Reading-progress** bar + sidebar progress %
- 📋 **Copy buttons** on every code block
- 🌈 Lightweight **syntax highlighting** (JS / JSX / JSON / bash / trees)
- 🧭 Diagrams for **CORS**, request flow, and origins
- 🔎 Sidebar **search/filter** (press <kbd>/</kbd> to focus)
- 📱 Fully **responsive** with a mobile drawer menu
- ✨ Reveal-on-scroll animations (respects `prefers-reduced-motion`)

---

## 📚 Sections covered

1. Software you need to install (VS Code, Node, Git, MongoDB Atlas, Postman, Chrome)
2. Create your React project (Vite vs CRA, every file explained)
3. Open the project in VS Code
4. Create the backend project (npm, packages, dev dependencies)
5. Create the Express server (line-by-line)
6. **Understanding CORS** — in depth, with diagrams
7. Set up MongoDB Atlas (step by step)
8. Connect your backend to MongoDB (`.env`, `.gitignore`, `db.js`)
9. Project folder structure (frontend + backend)
10. **Mini Project 1 — Sticky Notes** (full CRUD, complete code)
11. **Mini Project 2 — Contact Form** (validation, complete code)
12. Axios — talking to your backend
13. Testing your API with Postman
14. Deploy the backend to Vercel
15. Deploy the React frontend to Vercel
16. Connect frontend & backend in production
17. Common errors & how to fix them (troubleshooting accordion)
18. Practice challenge — level up the Notes app

---

## 🚀 How to view it

No installation needed. Pick either option:

**Option A — just open the file**
- Double-click `index.html` to open it in your browser.

**Option B — run a tiny local server** (recommended; some browsers restrict fonts/clipboard on `file://`)

```bash
# from this folder, with Node installed:
npx serve .
# ...or with Python:
python -m http.server 5500
```

Then open the printed URL (e.g. `http://localhost:3000` or `http://localhost:5500`).

---

## 🛠️ Customising

- **Colors / theme:** edit the CSS variables at the top of `styles.css` (`--grad-brand`, `--c-violet`, the `:root[data-theme="dark"]` block, etc.).
- **Add a section:** copy any `<section class="section reveal" id="...">…</section>` block in `index.html` and add a matching `<a class="nav-link" href="#...">` in the sidebar.
- **Screenshots:** every `.shot` placeholder shows the suggested file path (e.g. `/assets/sticky-notes.png`). Drop real images in and swap the placeholder for an `<img>`.

---

## 📦 Tech

Plain **HTML + CSS + JavaScript**. Fonts loaded from Google Fonts (Inter + JetBrains Mono). Works in any modern browser.
