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
