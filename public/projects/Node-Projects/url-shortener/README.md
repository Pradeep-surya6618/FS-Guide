# URL Shortener (Node.js + Express)

Turn long links into short ones — a tiny REST API built with [Express](https://expressjs.com).
Shortened URLs are stored **in memory**, so they **reset whenever the server restarts**
(no database needed).

## Setup

```bash
npm install        # installs express
npm start          # runs on http://localhost:3000
```

## Endpoints

| Method | Route        | Description                          |
| ------ | ------------ | ------------------------------------ |
| GET    | `/`          | Usage info + how many links stored   |
| POST   | `/shorten`   | Body `{ "url": "…" }` → a short code  |
| GET    | `/:code`     | Redirects to the original URL        |

## Examples

```bash
# shorten a URL
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/anthropics"}'

# → { "code": "Ab3xYz", "shortUrl": "http://localhost:3000/Ab3xYz", ... }

# then open the shortUrl in a browser → it redirects to the original
```

## How it works

- Links live in a plain object `urls = {}` in memory — **lost on restart**.
- `crypto.randomBytes()` generates a short, URL-safe code.
- `res.redirect(originalUrl)` sends visitors to the real link.

To make links permanent, store them in a database — see the **MongoDB** guide.

---

Part of **DevGuides** · Created by **Pradeep Surya**
