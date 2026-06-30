// ============================================================
//  QR Code Generator  ·  Node.js
//  Converts any text or URL into a PNG image using `qrcode`.
//
//  Usage:
//    node index.js "https://github.com"
//    node index.js "Hello World"  my-qr.png
// ============================================================

const QRCode = require("qrcode");

// 1. read the text/URL and (optional) output filename from the command line
const text = process.argv[2];
const output = process.argv[3] || "qrcode.png";

if (!text) {
  console.log("❌  Please provide some text or a URL to encode.");
  console.log('    Example:  node index.js "https://github.com"');
  process.exit(1);
}

// 2. options for the QR image
const options = {
  width: 400, // image size in pixels
  margin: 2, // quiet zone around the code
  color: {
    dark: "#000000", // the squares
    light: "#ffffff", // the background
  },
};

// 3. save the QR code as a PNG file
QRCode.toFile(output, text, options)
  .then(() => {
    console.log(`✅  QR code for "${text}"`);
    console.log(`    saved as: ${output}`);
  })
  .catch((err) => {
    console.error("⚠️  Could not create QR code:", err.message);
  });

// 4. bonus — also print it straight into the terminal
QRCode.toString(text, { type: "terminal", small: true })
  .then((qr) => console.log("\n" + qr))
  .catch(() => {});
