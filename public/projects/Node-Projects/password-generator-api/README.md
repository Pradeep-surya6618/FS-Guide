# Password Generator API (Node.js + Express)

A small REST API that generates **secure random passwords** — built with
[Express](https://expressjs.com), no database needed. Randomness comes from
Node's built-in `crypto` module.

## Setup

```bash
npm install        # installs express
npm start          # runs the server on http://localhost:3000
```

## Endpoints

| Method | Route        | Description                |
| ------ | ------------ | -------------------------- |
| GET    | `/`          | Usage info                 |
| GET    | `/generate`  | Returns a random password  |

### `/generate` options (query params)

| Param       | Default | Notes                |
| ----------- | ------- | -------------------- |
| `length`    | `16`    | Clamped to 4–128     |
| `uppercase` | `true`  | `A–Z`                |
| `lowercase` | `true`  | `a–z`                |
| `numbers`   | `true`  | `0–9`                |
| `symbols`   | `false` | `!@#$%…`             |

### Examples

```bash
# default (16 chars, letters + numbers)
curl http://localhost:3000/generate

# 20 chars with symbols
curl "http://localhost:3000/generate?length=20&symbols=true"

# digits only, 6 chars (a PIN)
curl "http://localhost:3000/generate?length=6&uppercase=false&lowercase=false&symbols=false"
```

Response:

```json
{ "password": "kQ7$mb2!Xz…", "length": 20, "options": { … } }
```

---

Part of **DevGuides** · Created by **Pradeep Surya**
