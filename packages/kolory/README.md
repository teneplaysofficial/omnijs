<div align="center">

# Kolory

_Paint your projects with vibrant Kolory_

[![npm](https://img.shields.io/npm/v/kolory.svg)](https://www.npmjs.com/package/kolory)
[![npm downloads](https://img.shields.io/npm/dw/kolory)](https://www.npmjs.com/package/kolory)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/kolory)](https://github.com/teneplaysofficial/kolory)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/kolory/badge?style=square)](https://github.com/teneplaysofficial/kolory)

</div>

## Overview

**Kolory** is a lightweight, versatile, and zero-dependency JavaScript library designed for seamless color manipulation and exploration. It supports multiple color formats (`HEX`, `RGB`, `RGBA`, `HSL`, `HSLA`) and provides built-in ANSI escape code support for styling terminal output. With a simple and intuitive API, Kolory empowers developers to work with colors effortlessly in both Node.js and browser environments.

Whether you're converting colors, generating dynamic palettes, or enhancing CLI output with vibrant formatting, Kolory is your go-to tool for all things color.

## Features

- **Multiple Color Formats**: Work with `HEX`, `RGB`, `RGBA`, `HSL`, and `HSLA` formats effortlessly.
- **Prebuilt Distributions**: Available in ESM, CommonJS, and IIFE formats for maximum compatibility.
- **Zero Dependencies**: Lightweight with a minimal footprint for optimal performance.
- **TypeScript Support**: First-class TypeScript definitions for a type-safe development experience.
- **Cross-Platform**: Compatible with Node.js, Deno, and modern browsers.
- **ANSI Styling**: Built-in support for 4-bit, 8-bit, and 24-bit ANSI escape codes to style CLI output.

## Installation

Kolory can be installed via all major package managers or used directly in the browser via a CDN.

### Using Package Managers

```bash
# npm
npm install kolory

# yarn
yarn add kolory

# pnpm
pnpm add kolory

# bun
bun add kolory
```

### Using CDN (Browser)

Include Kolory in your HTML for browser-based projects:

```html
<!-- UNPKG -->
<script src="https://unpkg.com/kolory/dist/index.iife.js"></script>

<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/kolory/dist/index.iife.js"></script>

<!-- ESM (Modern Browsers) -->
<script type="module">
  import kolory from 'https://esm.sh/kolory';
</script>
```

## Usage

Kolory provides a straightforward API to access and manipulate colors in various formats. Below are examples for different environments.

### ESM (Modern JavaScript)

```js
import kolory, { hex, rgb, rgba, hsl, hsla } from 'kolory';

console.log(kolory.hex.blue_metal);
console.log(hex.blue_metal);
console.log(rgb.blue_metal);
```

### CommonJS

```js
const { hex, rgb } = require('kolory');

console.log(hex.sunset_orange);
console.log(rgb.sunset_orange);
```

### Browser (IIFE via CDN)

```html
<script src="https://unpkg.com/kolory/dist/index.iife.js"></script>
<script>
  console.log(kolory.hex.blue_metal);
</script>
```

## Color Data Structure

Kolory organizes colors in a structured JSON format, with each color entry providing values for all supported formats. Below is an example:

```json
{
  "blue_metal": {
    "hex": "#4A90E2",
    "rgb": "74,144,226",
    "rgba": "74,144,226,1",
    "hsl": "210,73%,58%",
    "hsla": "210,73%,58%,1"
  }
}
```

## API Reference

Kolory exports several modules to access colors in different formats:

| Export   | Description                                    |
| -------- | ---------------------------------------------- |
| `kolory` | Structured object containing all color formats |
| `hex`    | Colors in HEX format (e.g., `#4A90E2`)         |
| `rgb`    | Colors in RGB format (e.g., `74,144,226`)      |
| `rgba`   | Colors in RGBA format (e.g., `74,144,226,1`)   |
| `hsl`    | Colors in HSL format (e.g., `210,73%,58%`)     |
| `hsla`   | Colors in HSLA format (e.g., `210,73%,58%,1`)  |
| `ansi`   | ANSI escape codes for CLI styling              |

## ANSI Escape Codes

Kolory includes robust support for ANSI escape codes, enabling vibrant and expressive CLI output. It supports 4-bit, 8-bit, and 24-bit color modes, with a chainable syntax for easy styling.

### ANSI Features

- **Chainable Syntax**: Combine styles fluently (e.g., `ansi.red.bold.underline('Hello')`).
- **Fully Typed**: TypeScript support for all ANSI styles.
- **Comprehensive SGR Codes**: Includes all Select Graphic Rendition (SGR) codes.
- **Cross-Platform**: Works in Node.js, Deno, and ANSI-compatible browser terminals.
- **Auto-Reset**: Automatically appends `\x1b[0m` to reset styles after each print.
- **Raw Output**: Use `.apply(text)` to retrieve styled strings without printing.

### ANSI Usage

```js
import { ansi } from 'kolory';

// Basic styling
ansi.bold('Bold text'); // Bold text
ansi.italic.underline('Stylish!'); // Italicized and underlined text
ansi.red.bgWhite.bold('Alert!'); // Red text on white background, bold
console.log(ansi.green.apply('Green text')); // Returns raw styled string
```

### Supported ANSI Styles

| Category        | Styles                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Text Styles** | `bold`, `dim`, `italic`, `underline`, `blink`, `inverse`, `hidden`                                                             |
| **Foreground**  | `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`                                                          |
| **Bright FG**   | `gray`, `brightRed`, `brightGreen`, `brightYellow`, `brightBlue`, `brightMagenta`, `brightCyan`, `brightWhite`                 |
| **Background**  | `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`                                          |
| **Bright BG**   | `bgGray`, `bgBrightRed`, `bgBrightGreen`, `bgBrightYellow`, `bgBrightBlue`, `bgBrightMagenta`, `bgBrightCyan`, `bgBrightWhite` |
| **Reset**       | `.reset` (or automatic after every print)                                                                                      |

### ANSI Examples

```js
ansi.inverse('Inverted'); // Inverted text
ansi.brightCyan('Bright Cyan Text'); // Bright cyan text
ansi.bgBrightMagenta.white.bold('Highlight this!'); // White bold text on bright magenta background
```

### How ANSI Works

Kolory’s ANSI support uses dynamic proxy chaining to build escape sequences. Each chained property appends an ANSI code, and the final invocation wraps the text with the appropriate codes:

```js
ansi.red.bold('Hello'); // Outputs: \u001b[31m\u001b[1mHello\u001b[0m
```

> [!NOTE]
> Use `.apply(text)` to retrieve the raw styled string for further processing without printing to the console.

## Contributing

We welcome contributions to make Kolory even better! To contribute:

1. **Add Colors**: Add new color entries to [kolory.json](./kolory.json), following the structure defined in [kolory.schema.json](./kolory.schema.json).
2. **Supported Formats**: Ensure each color includes `hex`, `rgb`, `rgba`, `hsl`, and `hsla` values.
3. **Consistency**: Maintain consistent naming and formatting across all entries.
4. **Code Quality**: Run the formatter (`prettier`) and linter (`eslint`) before submitting a pull request.
5. **Submit a PR**: Open a pull request with a clear description of your changes.

## License

Kolory is licensed under the [Apache License 2.0](../../LICENSE).
