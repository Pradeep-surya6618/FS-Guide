/* ==========================================================================
   FULL STACK GUIDE — script.js  (vanilla JS, no framework)
   --------------------------------------------------------------------------
   Features:
     1.  Dark / light theme toggle (persisted in localStorage)
     2.  Lightweight syntax highlighting for code blocks
     3.  Copy-to-clipboard buttons on every code block
     4.  Reading-progress bar (top of page)
     5.  Sticky sidebar scroll-spy (highlights current section)
     6.  Sidebar "course progress" based on how far you've read
     7.  Smooth-scroll + breadcrumb update
     8.  Mobile sidebar (hamburger + scrim)
     9.  Live search / filter over sidebar links
     10. Accordion (FAQ / troubleshooting)
     11. Reveal-on-scroll animations
   ========================================================================== */
(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     1. THEME TOGGLE — read a saved theme, else fall back to OS preference.
  ---------------------------------------------------------------------- */
  var root = document.documentElement;
  var THEME_KEY = "fsguide-theme";
  var reduceMQ = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  // Set + persist the theme (instant, no animation).
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }

  (function initTheme() {
    var saved;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved === "light" || saved === "dark") {
      setTheme(saved);                   // restore saved choice instantly
    } else {
      var prefersDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  })();

  // Wave switch: an expanding circular reveal from the click point, powered by
  // the View Transitions API. The browser composites a single snapshot, so it
  // stays smooth no matter how many elements are on the page.
  function waveTheme(theme, x, y) {
    if (!document.startViewTransition || reduceMQ.matches) { setTheme(theme); return; }
    if (x == null || y == null) { x = window.innerWidth / 2; y = window.innerHeight / 2; }
    var endR = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    // Freeze every element's own colour transition while the wave plays — the
    // theme is applied INSTANTLY to the live DOM (no dozens of concurrent
    // per-element repaints competing with the snapshot animation). Restored
    // when the transition finishes.
    root.classList.add("theme-switching");

    var vt = document.startViewTransition(function () { setTheme(theme); });
    vt.ready.then(function () {
      root.animate(
        {
          clipPath: [
            "circle(0px at " + x + "px " + y + "px)",
            "circle(" + endR + "px at " + x + "px " + y + "px)"
          ]
        },
        { duration: 520, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
    var unfreeze = function () { root.classList.remove("theme-switching"); };
    if (vt.finished && vt.finished.finally) { vt.finished.finally(unfreeze); }
    else { vt.finished.then(unfreeze, unfreeze); }
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-theme-toggle]");
    if (!t) return;
    var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    var next = current === "dark" ? "light" : "dark";
    var x = e.clientX, y = e.clientY;                 // wave originates at the pointer
    if (!x && !y) { var r = t.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
    waveTheme(next, x, y);
  });

  // Cross-tab sync (no origin point → switch instantly).
  window.addEventListener("storage", function (e) {
    if (e.key === THEME_KEY && (e.newValue === "light" || e.newValue === "dark")) {
      setTheme(e.newValue);
    }
  });

  /* ----------------------------------------------------------------------
     2. SYNTAX HIGHLIGHTING (tiny, dependency-free)
     Strings/comments are first replaced with placeholder characters in the
     Unicode Private Use Area (one char per match, starting at code point
     0xE000). Those chars contain no digits or ASCII letters, so the
     number/keyword/function regexes that run next can never corrupt them.
     A final char-scan swaps the placeholders back in.
  ---------------------------------------------------------------------- */
  var PUA_BASE = 0xE000;
  var KEYWORDS = [
    "const","let","var","function","return","if","else","for","while","import",
    "from","export","default","await","async","new","try","catch","finally",
    "throw","class","extends","this","typeof","instanceof","of","in","do",
    "switch","case","break","continue","null","undefined","true","false"
  ];
  // One combined matcher: 1=number, 2=keyword, 3=function name, 4=the "(".
  // Order matters — number, then keyword, then generic identifier-call.
  var tokenRe = new RegExp(
    "\\b(\\d+(?:\\.\\d+)?)\\b" +
    "|\\b(" + KEYWORDS.join("|") + ")\\b" +
    "|\\b([A-Za-z_$][\\w$]*)(\\s*\\()",
    "g"
  );

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function highlight(raw, lang) {
    var store = [];
    function stash(html) {
      var i = store.length;
      store.push(html);
      return String.fromCharCode(PUA_BASE + i); // one placeholder char per item
    }

    var code = escapeHtml(raw);

    if (lang === "bash" || lang === "shell") {
      // Strings before "#" comments so a "#" inside a string isn't a comment.
      code = code.replace(
        /("[^"\n]*"|'[^'\n]*'|#[^\n]*)/g,
        function (m) {
          var cls = (m.charAt(0) === "#") ? "tok-com" : "tok-str";
          return stash('<span class="' + cls + '">' + m + "</span>");
        }
      );
      code = code.replace(
        /\b(npm|npx|node|cd|mkdir|git|cp|copy|code|curl|vercel|nodemon|express)\b/g,
        '<span class="tok-key">$1</span>'
      );
    } else if (lang === "html" || lang === "xml" || lang === "markup") {
      // comments + doctype (stashed so later passes don't touch them)
      code = code.replace(/(&lt;!--[\s\S]*?--&gt;)/g, function (m) { return stash('<span class="tok-com">' + m + "</span>"); });
      code = code.replace(/(&lt;!\w[^&]*?&gt;)/g, function (m) { return stash('<span class="tok-com">' + m + "</span>"); });
      // attribute values
      code = code.replace(/("[^"\n]*"|'[^'\n]*')/g, function (m) { return stash('<span class="tok-str">' + m + "</span>"); });
      // attribute names FIRST (before tag spans are inserted, so the regex never
      // re-scans an inserted class="..." attribute)
      code = code.replace(/(\s)([a-zA-Z][\w-]*)(=)/g, '$1<span class="tok-prop">$2</span>$3');
      // tag names (uses the escaped &lt; so it can't match the <span> we insert)
      code = code.replace(/(&lt;\/?)([a-zA-Z][\w-]*)/g, '$1<span class="tok-key">$2</span>');
    } else if (lang === "css") {
      code = code.replace(/(\/\*[\s\S]*?\*\/)/g, function (m) { return stash('<span class="tok-com">' + m + "</span>"); });
      code = code.replace(/("[^"\n]*"|'[^'\n]*')/g, function (m) { return stash('<span class="tok-str">' + m + "</span>"); });
      code = code.replace(/([-a-zA-Z]+)(\s*:)/g, '<span class="tok-prop">$1</span>$2');     // property names
      code = code.replace(/\b(\d+(?:\.\d+)?)(px|rem|em|%|vh|vw|s|ms|deg|fr)?\b/g, '<span class="tok-num">$1$2</span>');
    } else {
      // Match strings AND comments in a SINGLE pass, with strings listed first,
      // so a "//" inside a string or URL (e.g. "http://localhost") is never
      // mistaken for the start of a comment. Quote strings stop at a newline;
      // template literals (backticks) may span lines.
      code = code.replace(
        /("[^"\n]*"|'[^'\n]*'|`[^`]*`|\/\*[\s\S]*?\*\/|\/\/[^\n]*)/g,
        function (m) {
          var f = m.charAt(0);
          var cls = (f === '"' || f === "'" || f === "`") ? "tok-str" : "tok-com";
          return stash('<span class="' + cls + '">' + m + "</span>");
        }
      );
      // Numbers, keywords and function-calls in ONE pass. This is essential:
      // doing them as separate replaces let a later pass re-scan the markup an
      // earlier pass produced — e.g. the keyword "class" matched the word
      // `class` inside a `class="tok-num"` attribute and mangled the span.
      // A single pass never re-scans its own output.
      code = code.replace(tokenRe, function (m, num, kw, fn, paren) {
        if (num !== undefined) return '<span class="tok-num">' + num + "</span>";
        if (kw !== undefined) return '<span class="tok-key">' + kw + "</span>";
        if (fn !== undefined) return '<span class="tok-fn">' + fn + "</span>" + paren;
        return m;
      });
    }

    // Restore stashed strings/comments by scanning for placeholder chars.
    // (Uses only numeric code points — no literal high-Unicode in the source.)
    if (store.length) {
      var out = "";
      for (var ci = 0; ci < code.length; ci++) {
        var cc = code.charCodeAt(ci);
        if (cc >= PUA_BASE && cc < PUA_BASE + store.length) {
          out += store[cc - PUA_BASE];
        } else {
          out += code.charAt(ci);
        }
      }
      code = out;
    }
    return code;
  }

  function buildCodeBlocks() {
    document.querySelectorAll(".code").forEach(function (block) {
      var pre = block.querySelector("pre code");
      if (!pre || pre.dataset.hl === "1") return;
      var lang = (block.getAttribute("data-lang") || "js").toLowerCase();
      var raw = pre.textContent;
      pre.dataset.raw = raw; // keep original text for the copy button
      if (lang === "text" || lang === "tree" || lang === "plain") {
        pre.innerHTML = escapeHtml(raw); // folder trees: no token colouring
      } else {
        pre.innerHTML = highlight(raw, lang);
      }
      pre.dataset.hl = "1";
    });
  }

  /* ----------------------------------------------------------------------
     2b. ICON INJECTION
     Replace the emoji inside card / callout icon chips with real stroke
     SVG icons. Keyed by Unicode code point (read from the DOM) so the
     source file contains no emoji or \u literals.
  ---------------------------------------------------------------------- */
  var ICON_PATHS = {
    // card icons
    "1f5a5": '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    "1f7e2": '<path d="M12 2 21 7v10l-9 5-9-5V7z"/><path d="M12 8v8M8.5 10v4M15.5 10v4"/>',
    "1f500": '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="7" r="2.5"/><path d="M6 8.5v7M18 9.5c0 3.5-6 1.5-6 6"/>',
    "1f343": '<path d="M4 20s1.5-8 8.5-11C16 7.5 20 4 20 4s.5 8.5-5 12.5C11.5 19 4 20 4 20z"/><path d="M9 15c2.5-3 6-4.5 6-4.5"/>',
    "1f4ee": '<path d="M22 3 11 14"/><path d="M22 3 15 21l-4-7-7-4z"/>',
    "1f310": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>',
    "1f4c1": '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    "2328": '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>',
    "1f9e9": '<path d="M10 3.5a2 2 0 0 1 4 0V5h3a2 2 0 0 1 2 2v3h1.5a2 2 0 0 1 0 4H19v3a2 2 0 0 1-2 2h-3v-1.5a2 2 0 0 0-4 0V19H7a2 2 0 0 1-2-2v-3H3.5a2 2 0 0 1 0-4H5V7a2 2 0 0 1 2-2h3z"/>',
    "1f4c4": '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
    "1f682": '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
    "1f6e1": '<path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6z"/>',
    "1f511": '<circle cx="8" cy="15" r="4"/><path d="m10.8 12.2 8.2-8.2M16 6l3 3M14 8l2 2"/>',
    "2705": '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    "274c": '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
    "1f4e6": '<path d="M21 8 12 3 3 8l9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    "1f504": '<path d="M21 12a9 9 0 0 1-15.9 5.7M3 12a9 9 0 0 1 15.9-5.7"/><path d="M21 4v4h-4M3 20v-4h4"/>',
    "1f5fa": '<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
    "1f39b": '<path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h7M15 17h5"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="13" cy="17" r="2"/>',
    "1f50e": '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    "1f3f7": '<path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    "1f3a8": '<path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.6 0-1.4 1-2 2.3-2H18a3 3 0 0 0 3-3c0-5-4-8.4-9-8.4z"/><circle cx="7.5" cy="11" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16" cy="11" r="1"/>',
    "270f": '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    "1f552": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "2195": '<path d="M7 4v16M4 7l3-3 3 3M17 20V4M14 17l3 3 3-3"/>',
    "2b50": '<path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9z"/>',
    // callout icons
    "2753": '<circle cx="12" cy="12" r="9"/><path d="M9.3 9a3 3 0 0 1 5.6 1c0 2-3 2.3-3 4"/><path d="M12 17h.01"/>',
    "26a0": '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17.5h.01"/>',
    "1f4a1": '<path d="M9 18h6M10 21h4M8.5 14A5 5 0 1 1 16 14c-.8.9-1 1.5-1 2.5H9.5c0-1-.2-1.6-1-2.5z"/>',
    "1f5a8": '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>',
    "1f6ab": '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
    "1f4d8": '<path d="M5 4a2 2 0 0 1 2-2h11v18H7a2 2 0 0 0-2 2z"/><path d="M9 2v18"/>',
    "1f9f1": '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
    "1f3af": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
    "1f5c4": '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    "1f389": '<circle cx="12" cy="9" r="5"/><path d="M9 13.5 8 21l4-2 4 2-1-7.5"/>',
    "1f393": '<path d="M12 4 2 9l10 5 10-5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>'
  };

  function buildIcons() {
    document.querySelectorAll(".card-ico, .callout .ci").forEach(function (el) {
      if (el.dataset.icx === "1") return;
      var txt = el.textContent.trim();
      if (!txt) return;
      var cp = txt.codePointAt(0);
      if (cp < 0x2000) return; // leave plain numbers/letters (e.g. roadmap 1-4)
      var inner = ICON_PATHS[cp.toString(16)];
      if (inner) {
        el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
          'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + "</svg>";
        el.dataset.icx = "1";
      }
    });
  }

  /* ----------------------------------------------------------------------
     3. COPY BUTTONS
  ---------------------------------------------------------------------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".copy-btn");
    if (!btn) return;
    var block = btn.closest(".code");
    var codeEl = block && block.querySelector("pre code");
    if (!codeEl) return;
    var text = codeEl.dataset.raw != null ? codeEl.dataset.raw : codeEl.textContent;

    function done() {
      var label = btn.querySelector(".cp-label");
      btn.classList.add("copied");
      if (label) label.textContent = "Copied!";
      setTimeout(function () {
        btn.classList.remove("copied");
        if (label) label.textContent = "Copy";
      }, 1600);
    }
    function fallbackCopy() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (err) {}
      document.body.removeChild(ta);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallbackCopy);
    } else {
      fallbackCopy();
    }
  });

  /* ----------------------------------------------------------------------
     4 + 6. READING PROGRESS BAR + APP-BAR COURSE PROGRESS
  ---------------------------------------------------------------------- */
  var progressFill = document.querySelector(".progress-fill");      // thin bar at the very top
  var apFill = document.querySelector(".appbar-progress .ap-fill"); // widget bar
  var apPct  = document.querySelector(".appbar-progress .ap-pct");  // widget %

  function onScrollProgress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0;
    if (progressFill) progressFill.style.width = pct.toFixed(1) + "%";
    if (apFill) apFill.style.width = pct.toFixed(1) + "%";
    if (apPct)  apPct.textContent = Math.round(pct) + "%";
  }

  /* ----------------------------------------------------------------------
     5. SCROLL-SPY for sidebar links + breadcrumb
  ---------------------------------------------------------------------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll(".section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link[href^='#']"));
  var crumb = document.querySelector(".appbar .crumb b");

  function setActive(id) {
    navLinks.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("active", on);
      if (on && crumb) crumb.textContent = a.dataset.title || a.textContent.trim();
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) setActive(en.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // The hero/Overview region has no observed section, so the spy would keep the
  // first section (#software) active when you reach the top. Activate "Overview"
  // (#top) while the first section is still below the spy's active line (~50% vh).
  if (sections.length) {
    var firstSection = sections[0];
    var spyTop = function () {
      if (firstSection.getBoundingClientRect().top > window.innerHeight * 0.5) {
        setActive("top");
      }
    };
    window.addEventListener("scroll", spyTop, { passive: true });
    window.addEventListener("resize", spyTop);
    spyTop();
  }

  /* ----------------------------------------------------------------------
     5c. SIDEBAR COLLAPSE (desktop) + icon tooltips
     The collapsed state is applied pre-paint by the inline <head> script;
     here we just wire the toggle, persist it, and drive the hover tooltip.
  ---------------------------------------------------------------------- */
  var COLLAPSE_KEY = "fsguide-collapsed";
  var navAnimTimer = null;
  var contentEl = document.querySelector(".content");

  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-collapse-toggle]")) return;
    if (window.innerWidth <= 860) return;            // desktop only
    hideTip();

    // FLIP: the layout (sidebar width + content margin) changes INSTANTLY (one
    // reflow), then we animate the content back to its old spot with a GPU
    // transform. With blur suppressed, nothing reflows or re-blurs per frame.
    var before = contentEl ? contentEl.getBoundingClientRect().left : 0;

    root.classList.add("nav-animating");             // suppress backdrop blur
    var collapsed = root.classList.toggle("nav-collapsed");
    try { localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0"); } catch (er) {}

    if (contentEl) {
      var delta = before - contentEl.getBoundingClientRect().left; // forces sync layout
      contentEl.style.transition = "none";
      contentEl.style.transform = "translateX(" + delta + "px)";
      void contentEl.offsetWidth;                    // flush the start transform
      contentEl.style.transition = "transform .32s cubic-bezier(.4,0,.2,1)";
      contentEl.style.transform = "translateX(0)";
    }

    if (navAnimTimer) clearTimeout(navAnimTimer);
    navAnimTimer = setTimeout(function () {
      root.classList.remove("nav-animating");
      if (contentEl) { contentEl.style.transition = ""; contentEl.style.transform = ""; }
    }, 360);
  });

  // Premium tooltip shown beside the collapsed icons (body-level so it isn't
  // clipped by the sidebar's overflow).
  var tip = document.createElement("div");
  tip.className = "nav-tooltip";
  document.body.appendChild(tip);

  function tipActive() {
    return root.classList.contains("nav-collapsed") && window.innerWidth > 860;
  }
  function showTip(link) {
    if (!tipActive()) return;
    tip.textContent = link.dataset.title || link.textContent.trim();
    var r = link.getBoundingClientRect();
    tip.style.top = (r.top + r.height / 2) + "px";
    tip.style.left = (r.right + 14) + "px";
    tip.classList.add("show");
  }
  function hideTip() { tip.classList.remove("show"); }

  navLinks.forEach(function (l) {
    l.addEventListener("mouseenter", function () { showTip(l); });
    l.addEventListener("mouseleave", hideTip);
    l.addEventListener("focus", function () { showTip(l); });
    l.addEventListener("blur", hideTip);
  });
  window.addEventListener("scroll", hideTip, { passive: true });

  /* ----------------------------------------------------------------------
     11. REVEAL ON SCROLL
  ---------------------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function revealEl(el) { el.classList.add("in"); }
  if ("IntersectionObserver" in window && revealEls.length) {
    // threshold 0 fires as soon as ANY part intersects — important for very
    // tall sections (e.g. the Sticky Notes project) whose visible fraction can
    // never reach a larger threshold, which previously left them invisible.
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { revealEl(en.target); revObs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0 });
    revealEls.forEach(function (el) { revObs.observe(el); });
  } else {
    revealEls.forEach(revealEl);
  }

  /* ----------------------------------------------------------------------
     11b. TIMELINE ENTRANCE
     Add ".tl-go" when a timeline scrolls into view so its line-draw + staggered
     step animation plays exactly when the user reaches it. Fallback: reveal all.
  ---------------------------------------------------------------------- */
  var timelines = Array.prototype.slice.call(document.querySelectorAll(".timeline"));
  if ("IntersectionObserver" in window && timelines.length) {
    var tlObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("tl-go"); tlObs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0 });
    timelines.forEach(function (t) { tlObs.observe(t); });
  } else {
    timelines.forEach(function (t) { t.classList.add("tl-go"); });
  }

  /* ----------------------------------------------------------------------
     8. MOBILE SIDEBAR
  ---------------------------------------------------------------------- */
  var sidebar = document.querySelector(".sidebar");
  var scrim   = document.querySelector(".scrim");
  function openSidebar()  {
    if (sidebar) sidebar.classList.add("open");
    if (scrim) scrim.classList.add("show");
    document.documentElement.classList.add("drawer-open"); // lock background scroll
  }
  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("open");
    if (scrim) scrim.classList.remove("show");
    document.documentElement.classList.remove("drawer-open");
  }
  function toggleSidebar() {
    if (sidebar && sidebar.classList.contains("open")) closeSidebar();
    else openSidebar();
  }
  // If the viewport is widened past the mobile breakpoint while open, unlock.
  window.addEventListener("resize", function () {
    if (window.innerWidth > 860) closeSidebar();
  });

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-menu-open]")) { toggleSidebar(); return; } // hamburger toggles
    if (e.target.closest(".scrim")) { closeSidebar(); return; }
    if (e.target.closest(".sidebar .nav-link") && window.innerWidth <= 860) { closeSidebar(); }
  });
  // Close the drawer with the Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSidebar();
  });

  /* ----------------------------------------------------------------------
     8b. LANDING-PAGE MOBILE DRAWER (independent of the guide sidebar)
  ---------------------------------------------------------------------- */
  var lpDrawer = document.querySelector(".lp-drawer");
  if (lpDrawer) {
    var lpScrim = document.querySelector(".lp-scrim");
    function lpOpen() {
      lpDrawer.classList.add("open");
      if (lpScrim) lpScrim.classList.add("show");
      document.documentElement.classList.add("drawer-open");
      lpDrawer.setAttribute("aria-hidden", "false");
    }
    function lpClose() {
      lpDrawer.classList.remove("open");
      if (lpScrim) lpScrim.classList.remove("show");
      document.documentElement.classList.remove("drawer-open");
      lpDrawer.setAttribute("aria-hidden", "true");
    }
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-lp-open]")) {
        lpDrawer.classList.contains("open") ? lpClose() : lpOpen();
        return;
      }
      if (e.target.closest("[data-lp-close]")) { lpClose(); return; }
      if (e.target.closest(".lp-drawer-nav a")) { lpClose(); }   // close after picking a section
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") lpClose();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) lpClose();
    });
  }

  /* ----------------------------------------------------------------------
     9. SEARCH / FILTER sidebar links
  ---------------------------------------------------------------------- */
  var searchInput = document.querySelector(".search input");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      var q = this.value.trim().toLowerCase();
      document.querySelectorAll(".nav-group").forEach(function (group) {
        var anyVisible = false;
        group.querySelectorAll(".nav-link").forEach(function (link) {
          var match = link.textContent.toLowerCase().indexOf(q) !== -1;
          link.style.display = match ? "" : "none";
          if (match) anyVisible = true;
        });
        var title = group.querySelector(".nav-title");
        if (title) title.style.display = anyVisible ? "" : "none";
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== searchInput) {
        e.preventDefault(); searchInput.focus();
      }
    });
  }

  /* ----------------------------------------------------------------------
     10. ACCORDION
  ---------------------------------------------------------------------- */
  document.addEventListener("click", function (e) {
    var head = e.target.closest(".acc-head");
    if (!head) return;
    var item = head.closest(".acc-item");
    if (item) item.classList.toggle("open");
  });

  /* ----------------------------------------------------------------------
     Smooth-scroll for in-page anchors
  ---------------------------------------------------------------------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    // Reveal the destination immediately so it's never blank on arrival,
    // even before the scroll-reveal observer fires.
    if (target.classList.contains("reveal")) target.classList.add("in");
    target.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (history.replaceState) history.replaceState(null, "", "#" + id);
  });

  /* ----------------------------------------------------------------------
     INIT
  ---------------------------------------------------------------------- */
  function init() {
    buildCodeBlocks();
    buildIcons();
    onScrollProgress();
    window.addEventListener("scroll", onScrollProgress, { passive: true });
    window.addEventListener("resize", onScrollProgress);
    var y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
