import rawColors from '../data/kolory.json' with { type: 'json' };
import rawAnsi from '../data/ansi.json' with { type: 'json' };

const colors = rawColors;
const ansis = rawAnsi;

type ColorKey = Exclude<keyof typeof colors, '$schema'>;
type AnsiKey = Exclude<keyof typeof ansis, '$schema'>;
type Format = keyof (typeof colors)[ColorKey];

type Formats = {
  [F in Format]: {
    [C in ColorKey]: string;
  };
};

type Ansi = {
  [K in AnsiKey]: Ansi;
} & {
  (text: string): void;
  apply: (text: string) => string;
};

type Kolory = Formats & {
  ansi: Ansi;
};

function createAnsi(codes: string[] = []): Ansi {
  const applyStyle = (text: string) => codes.join('') + text + ansis.reset;

  const printer = new Proxy(
    (text: string) => {
      console.log(applyStyle(text));
    },
    {
      get(_, prop: string) {
        if (prop === 'apply') {
          return (text: string) => codes.join('') + text + ansis.reset;
        }

        if (prop in ansis) {
          return createAnsi([...codes, ansis[prop as AnsiKey]]);
        }
        return undefined;
      },

      apply(_target, _thisArg, argArray) {
        const [text] = argArray;
        console.log(applyStyle(text));
      },
    },
  );

  return printer as Ansi;
}

const kolory: Kolory = {
  ansi: createAnsi(),
  hex: {},
  rgb: {},
  rgba: {},
  hsl: {},
  hsla: {},
} as Kolory;

for (const [name, values] of Object.entries(colors)) {
  if (name === '$schema') continue;
  for (const [format, value] of Object.entries(values)) {
    kolory[format as Format][name as ColorKey] = value as string;
  }
}

export const ansi = kolory.ansi;
export const hex = kolory.hex;
export const rgb = kolory.rgb;
export const rgba = kolory.rgba;
export const hsl = kolory.hsl;
export const hsla = kolory.hsla;

export { kolory };
export default kolory;
