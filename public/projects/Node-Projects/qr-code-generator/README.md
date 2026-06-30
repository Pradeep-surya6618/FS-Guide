# QR Code Generator (Node.js)

Turn any **text or URL** into a PNG **QR code** — a tiny command-line tool built with
[Node.js](https://nodejs.org) and the [`qrcode`](https://www.npmjs.com/package/qrcode) package.

## Setup

```bash
npm install        # installs the qrcode package
```

## Usage

```bash
# encode a URL → saves qrcode.png
node index.js "https://github.com"

# encode text and choose the output filename
node index.js "Hello World" my-qr.png
```

The PNG is saved in this folder, and the QR is also printed in your terminal.

## How it works

- `QRCode.toFile(output, text, options)` writes the QR code to a **PNG** file.
- `QRCode.toString(text, { type: "terminal" })` prints it right in the console.
- The text/URL and optional filename are read from `process.argv`.

---

Part of **DevGuides** · Created by **Pradeep Surya**
