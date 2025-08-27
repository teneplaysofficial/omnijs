import assert from 'node:assert';
import { it, describe } from 'node:test';
import kolory, { ansi, hex, rgb, rgba, hsl, hsla } from '../dist/index.js';
import rawAnsi from '../data/ansi.json' with { type: 'json' };
import rawColors from '../data/kolory.json' with { type: 'json' };

describe('Kolory', () => {
  it('should export ansi, hex, rgb, rgba, hsl, hsla', () => {
    assert.ok(kolory);
    assert.ok(ansi);
    assert.ok(hex);
    assert.ok(rgb);
    assert.ok(rgba);
    assert.ok(hsl);
    assert.ok(hsla);
  });

  it('should load all colors from kolory.json', () => {
    for (const [name, values] of Object.entries(rawColors)) {
      if (name === '$schema') continue;
      for (const format of Object.keys(values)) {
        assert.strictEqual(
          kolory[format][name],
          values[format],
          `kolory.${format}.${name} should match`,
        );
      }
    }
  });
});

describe('ansi', () => {
  it('should reset styles correctly', () => {
    const text = 'reset test';
    const styled = ansi.apply(text);
    assert(styled.startsWith(''));
    assert(styled.includes(text));
    assert(styled.endsWith(rawAnsi.reset));
  });

  it('should allow chaining multiple styles', () => {
    const styled = ansi.red.bold.underline.apply('multi');
    assert(styled.includes(rawAnsi.red));
    assert(styled.includes(rawAnsi.bold));
    assert(styled.includes(rawAnsi.underline));
    assert(styled.endsWith(rawAnsi.reset));
  });

  it('should be callable directly after chaining', () => {
    let logged = '';
    const original = console.log;
    console.log = (msg) => (logged = msg);

    ansi.green.bold('direct call');
    assert(logged.includes('direct call'));
    assert(logged.includes(rawAnsi.green));
    assert(logged.includes(rawAnsi.bold));

    console.log = original;
  });

  it('should ignore invalid ansi properties', () => {
    const invalid = ansi.noSuchCode;
    assert.strictEqual(invalid, undefined);
  });

  it('should not mutate base ansi when chained', () => {
    const red = ansi.red;
    const bold = ansi.bold;

    const redText = red.apply('red text');
    const boldText = bold.apply('bold text');

    assert(redText.includes(rawAnsi.red));
    assert(!redText.includes(rawAnsi.bold));

    assert(boldText.includes(rawAnsi.bold));
    assert(!boldText.includes(rawAnsi.red));
  });

  it('should support nested apply without logging', () => {
    const chained = ansi.cyan.italic;
    const styled = chained.apply('silent');
    assert(styled.includes(rawAnsi.cyan));
    assert(styled.includes(rawAnsi.italic));
    assert(styled.endsWith(rawAnsi.reset));
  });
});
