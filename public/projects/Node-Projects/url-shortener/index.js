// ============================================================
//  URL Shortener  ·  Node.js + Express  (no database)
//
//  Shortened URLs are kept in memory, so they RESET every time
//  the server restarts.
//
//  Endpoints:
//    GET  /            → usage info
//    POST /shorten     → { "url": "https://…" }  →  a short code
//    GET  /:code       → redirects to the original URL
// ============================================================

const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());

// in-memory store  →  { code: originalUrl }
// (a plain object; wiped whenever the process stops)
const urls = {};

// generate a short, URL-safe random code
function makeCode(length = 6) {
  return crypto.randomBytes(8).toString("base64url").slice(0, length);
}

// home — quick usage guide
app.get("/", (req, res) => {
  res.json({
    message: "URL Shortener API",
    shorten: 'POST /shorten  with body { "url": "https://example.com" }',
    visit: "GET /:code  → redirects to the original URL",
    stored: Object.keys(urls).length,
  });
});

// create a short URL
app.post("/shorten", (req, res) => {
  const { url } = req.body;

  // basic validation — must be an http(s) URL
  if (!url || !/^https?:\/\/.+/.test(url)) {
    return res.status(400).json({ error: "Please provide a valid http(s) URL" });
  }

  const code = makeCode();
  urls[code] = url; // store it in memory

  res.status(201).json({
    code,
    shortUrl: `${req.protocol}://${req.get("host")}/${code}`,
    original: url,
  });
});

// follow a short URL → redirect to the original
app.get("/:code", (req, res) => {
  const url = urls[req.params.code];
  if (!url) {
    return res.status(404).json({ error: "Short URL not found" });
  }
  res.redirect(url);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔗  URL Shortener running at http://localhost:${PORT}`);
  console.log("    Note: links are stored in memory and reset on restart.");
});
