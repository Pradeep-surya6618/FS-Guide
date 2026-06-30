// ============================================================
//  Password Generator API  ·  Node.js + Express  (no database)
//
//  Endpoints:
//    GET /                  → usage info
//    GET /generate          → a random password (JSON)
//
//  Query options for /generate:
//    length     (4–128, default 16)
//    uppercase  (true/false, default true)
//    lowercase  (true/false, default true)
//    numbers    (true/false, default true)
//    symbols    (true/false, default false)
//
//  Example:
//    /generate?length=20&symbols=true
// ============================================================

const express = require("express");
const crypto = require("crypto"); // for secure randomness

const app = express();

// the character pools
const POOLS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

function generatePassword(opts) {
  // build the pool from the selected options
  let pool = "";
  if (opts.lowercase) pool += POOLS.lowercase;
  if (opts.uppercase) pool += POOLS.uppercase;
  if (opts.numbers) pool += POOLS.numbers;
  if (opts.symbols) pool += POOLS.symbols;

  // if the user turned everything off, fall back to lowercase
  if (!pool) pool = POOLS.lowercase;

  // pick `length` random characters (crypto.randomInt = unbiased & secure)
  let password = "";
  for (let i = 0; i < opts.length; i++) {
    password += pool[crypto.randomInt(pool.length)];
  }
  return password;
}

// a small helper: read a "true"/"false" query value with a default
function flag(value, fallback) {
  if (value === undefined) return fallback;
  return value === "true";
}

// home route — quick usage guide
app.get("/", (req, res) => {
  res.json({
    message: "Password Generator API",
    try: "/generate?length=20&symbols=true",
    options: ["length (4-128)", "uppercase", "lowercase", "numbers", "symbols"],
  });
});

// the generator
app.get("/generate", (req, res) => {
  // clamp length between 4 and 128 (default 16)
  let length = parseInt(req.query.length, 10) || 16;
  length = Math.min(Math.max(length, 4), 128);

  const opts = {
    length,
    uppercase: flag(req.query.uppercase, true),
    lowercase: flag(req.query.lowercase, true),
    numbers: flag(req.query.numbers, true),
    symbols: flag(req.query.symbols, false),
  };

  const password = generatePassword(opts);
  res.json({ password, length, options: opts });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔐  Password API running at http://localhost:${PORT}`);
  console.log(`    Try:  http://localhost:${PORT}/generate?length=20&symbols=true`);
});
