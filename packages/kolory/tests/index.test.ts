import kolory, { ansi, hex, rgb, rgba, hsl, hsla } from '../src/index.js';
// import kolory, { ansi, hex, rgb, rgba, hsl, hsla } from '../dist/index.js';
import rawAnsi from '../data/ansi.json' with { type: 'json' };
import rawColors from '../data/kolory.json' with { type: 'json' };

describe('Kolory', () => {
  it('should export ansi, hex, rgb, rgba, hsl, hsla', () => {
    expect(kolory).toBeDefined();
    expect(ansi).toBeDefined();
    expect(hex).toBeDefined();
    expect(rgb).toBeDefined();
    expect(rgba).toBeDefined();
    expect(hsl).toBeDefined();
    expect(hsla).toBeDefined();
  });

  it('should load all colors from kolory.json', () => {
    for (const [name, values] of Object.entries(rawColors)) {
      if (name === '$schema') continue;
      for (const format of Object.keys(values)) {
        const k = kolory as Record<string, unknown>;
        const v = values as Record<string, unknown>;

        expect((k[format] as Record<string, unknown>)[name]).toBe(
          (v[format] as Record<string, unknown>)[name],
        );
      }
    }
  });
});

describe('ansi', () => {
  it('should reset styles correctly', () => {
    const text = 'reset test';
    const styled = ansi.apply(text);
    expect(styled).toContain(text);
    expect(styled.endsWith(rawAnsi.reset)).toBe(true);
  });

  it('should allow chaining multiple styles', () => {
    const styled = ansi.red.bold.underline.apply('multi');
    expect(styled).toContain(rawAnsi.red);
    expect(styled).toContain(rawAnsi.bold);
    expect(styled).toContain(rawAnsi.underline);
    expect(styled.endsWith(rawAnsi.reset)).toBe(true);
  });

  it('should be callable directly after chaining', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    ansi.green.bold('direct call');
    expect(spy).toHaveBeenCalled();
    const msg = (spy.mock.calls[0] as string[])[0];
    expect(msg).toContain('direct call');
    expect(msg).toContain(rawAnsi.green);
    expect(msg).toContain(rawAnsi.bold);
    spy.mockRestore();
  });

  it('should ignore invalid ansi properties', () => {
    // @ts-expect-error testing invalid property
    const invalid = ansi.noSuchCode;
    expect(invalid).toBeUndefined();
  });

  it('should not mutate base ansi when chained', () => {
    const red = ansi.red;
    const bold = ansi.bold;

    const redText = red.apply('red text');
    const boldText = bold.apply('bold text');

    expect(redText).toContain(rawAnsi.red);
    expect(redText).not.toContain(rawAnsi.bold);

    expect(boldText).toContain(rawAnsi.bold);
    expect(boldText).not.toContain(rawAnsi.red);
  });

  it('should support nested apply without logging', () => {
    const chained = ansi.cyan.italic;
    const styled = chained.apply('silent');
    expect(styled).toContain(rawAnsi.cyan);
    expect(styled).toContain(rawAnsi.italic);
    expect(styled.endsWith(rawAnsi.reset)).toBe(true);
  });
});
