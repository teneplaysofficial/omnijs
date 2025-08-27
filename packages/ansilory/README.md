<div align="center">

# Ansilory

_Terminal styling made beautiful_

</div>

[![npm](https://img.shields.io/npm/v/ansilory.svg)](https://www.npmjs.com/package/ansilory)
[![npm downloads](https://img.shields.io/npm/dw/ansilory)](https://www.npmjs.com/package/ansilory)

## Installation

```bash
# npm
npm install ansilory

# yarn
yarn add ansilory

# pnpm
pnpm add ansilory

# bun
bun add ansilory
```

## ANSI Escape Codes

Ansilory includes robust support for ANSI escape codes, enabling vibrant and expressive CLI output. It supports 4-bit, 8-bit, and 24-bit color modes, with a chainable syntax for easy styling.

### ANSI Features

- **Chainable Syntax**: Combine styles fluently (e.g., `ansi.red.bold.underline('Hello')`).
- **Fully Typed**: TypeScript support for all ANSI styles.
- **Comprehensive SGR Codes**: Includes all Select Graphic Rendition (SGR) codes.
- **Cross-Platform**: Works in Node.js, Deno, and ANSI-compatible browser terminals.
- **Auto-Reset**: Automatically appends `\x1b[0m` to reset styles after each print.
- **Raw Output**: Use `.apply(text)` to retrieve styled strings without printing.

### ANSI Usage

```js
import { o } from 'ansilory';

// Basic styling
o.bold('Bold text'); // Bold text
o.italic.underline('Stylish!'); // Italicized and underlined text
o.red.bgWhite.bold('Alert!'); // Red text on white background, bold
console.log(o.green.apply('Green text')); // Returns raw styled string
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
o.inverse('Inverted'); // Inverted text
o.brightCyan('Bright Cyan Text'); // Bright cyan text
o.bgBrightMagenta.white.bold('Highlight this!'); // White bold text on bright magenta background
```

### How ANSI Works

Ansilory’s ANSI support uses dynamic proxy chaining to build escape sequences. Each chained property appends an ANSI code, and the final invocation wraps the text with the appropriate codes:

```js
o.red.bold('Hello'); // Outputs: \u001b[31m\u001b[1mHello\u001b[0m
```

> [!NOTE]
> Use `.apply(text)` to retrieve the raw styled string for further processing without printing to the console.
