/* 
  Test suite for sylog type definitions.

  Testing library/framework: Vitest.
  - Runtime assertions use: describe/it/expect from 'vitest'.
  - Type-level assertions use: expectTypeOf from 'vitest' (compile-time verification).
  If your project uses Jest, you can adapt by:
    - import { describe, it, expect } from '@jest/globals';
    - remove expectTypeOf checks or switch to a Jest-compatible type test helper.

  Focus: Validate the public type interfaces introduced/modified in the diff:
    - Levels
    - LogArgs
    - TimeStamp
    - SylogOpts
    - LogOpts

  Strategy:
    - Use expectTypeOf to assert assignability and structure.
    - Include negative cases via `.not` where feasible.
    - Add minimal runtime checks to ensure file participates in test run.
*/

import { describe, it, expect, expectTypeOf } from 'vitest';

// Import the types under test. Adjust the import path if the actual source differs.
// If the types are declared in packages/sylog/types.ts, this path will work.
// If they are re-exported elsewhere, update accordingly.

import type {
  Levels,
  LogArgs,
  TimeStamp,
  SylogOpts,
  LogOpts,
} from './types';

// Helper no-op function to stabilize runtime tests
function id<T>(v: T) { return v; }

describe('sylog types: Levels', () => {
  it('accepts only the defined level literals', () => {
    // Positive assignability checks
    expectTypeOf<'log'>().toMatchTypeOf<Levels>();
    expectTypeOf<'info'>().toMatchTypeOf<Levels>();
    expectTypeOf<'warn'>().toMatchTypeOf<Levels>();
    expectTypeOf<'error'>().toMatchTypeOf<Levels>();
    expectTypeOf<'success'>().toMatchTypeOf<Levels>();
    expectTypeOf<'debug'>().toMatchTypeOf<Levels>();

    // Negative assignability checks
    expectTypeOf<'trace'>().not.toMatchTypeOf<Levels>();
    expectTypeOf<'fatal'>().not.toMatchTypeOf<Levels>();
    expectTypeOf<string>().not.toEqualTypeOf<Levels>(); // arbitrary string is wider than the union

    // Minimal runtime sanity (string union at runtime is string)
    expect(typeof id('info' as Levels)).toBe('string');
  });
});

describe('sylog types: TimeStamp', () => {
  it('only allows "utc" or "local"', () => {
    expectTypeOf<'utc'>().toMatchTypeOf<TimeStamp>();
    expectTypeOf<'local'>().toMatchTypeOf<TimeStamp>();

    expectTypeOf<'UTC'>().not.toMatchTypeOf<TimeStamp>();
    expectTypeOf<'epoch'>().not.toMatchTypeOf<TimeStamp>();

    expect(typeof id('utc' as TimeStamp)).toBe('string');
  });
});

describe('sylog types: LogOpts', () => {
  it('allows optional sep and end as strings', () => {
    const a: LogOpts = {};
    const b: LogOpts = { sep: ' ' };
    const c: LogOpts = { end: '\n' };
    const d: LogOpts = { sep: ' | ', end: '\r\n' };

    // Type structure checks
    expectTypeOf<LogOpts>().toMatchTypeOf<{ sep?: string; end?: string }>();
    expectTypeOf<typeof a>().toMatchTypeOf<LogOpts>();
    expectTypeOf<typeof b>().toMatchTypeOf<LogOpts>();
    expectTypeOf<typeof c>().toMatchTypeOf<LogOpts>();
    expectTypeOf<typeof d>().toMatchTypeOf<LogOpts>();

    // Negative shapes
    // @ts-expect-error - sep must be a string if provided
    const e: LogOpts = { sep: 123 };
    // @ts-expect-error - end must be a string if provided
    const f: LogOpts = { end: 0 };

    // trivial runtime check
    expect(Object.keys(d)).toContain('sep');

    // Use variables in runtime to satisfy ESLint
    expect(a).toBeDefined();
    expect(b).toBeDefined();
    expect(c).toBeDefined();
    expect(e).toBeDefined();
    expect(f).toBeDefined();
  });
});

describe('sylog types: LogArgs', () => {
  it('accepts arrays of string | number | object | LogOpts', () => {
    const a: LogArgs = [];
    const b: LogArgs = ['hello'];
    const c: LogArgs = [42, 'ok', { a: 1 }];
    const d: LogArgs = ['x', { any: 'object' }, { sep: ' ', end: '\n' }]; // includes LogOpts

    expectTypeOf<typeof a>().toMatchTypeOf<LogArgs>();
    expectTypeOf<typeof b>().toMatchTypeOf<LogArgs>();
    expectTypeOf<typeof c>().toMatchTypeOf<LogArgs>();
    expectTypeOf<typeof d>().toMatchTypeOf<LogArgs>();

    // Negative: elements must be from the allowed union
    // @ts-expect-error - boolean is not permitted
    const e: LogArgs = [true];
    // @ts-expect-error - arrays of disallowed items fail
    const f: LogArgs = [Symbol('nope')];

    // Note: The documentation states "Last argument can optionally be LogOpts".
    // The current LogArgs definition does not constrain LogOpts to be last; it allows it anywhere.
    // The following is therefore valid under the current types:
    const g: LogArgs = [{ sep: '-' }, 'middle', 1]; // allowed by current type
    expectTypeOf<typeof g>().toMatchTypeOf<LogArgs>();

    // Basic runtime check
    expect(Array.isArray(d)).toBe(true);

    // Use variables in runtime to satisfy ESLint
    expect(a).toBeDefined();
    expect(b).toBeDefined();
    expect(c).toBeDefined();
    expect(e).toBeDefined();
    expect(f).toBeDefined();
    expect(g).toBeDefined();
  });
});

describe('sylog types: SylogOpts', () => {
  it('supports optional configuration fields with proper types', () => {
    const minimal: SylogOpts = {};
    const full: SylogOpts = {
      prefix: '[app]',
      showTimeStamp: true,
      timeStamp: 'utc',
      showLevels: false,
      levels: {
        log: 'LOG',
        info: 'INFO',
        warn: 'WARN',
        error: 'ERROR',
        success: 'OK',
        debug: null, // null hides the level label
      },
    };

    expectTypeOf<typeof minimal>().toMatchTypeOf<SylogOpts>();
    expectTypeOf<typeof full>().toMatchTypeOf<SylogOpts>();

    // Validate the 'levels' shape precisely
    type LevelsRecord = Partial<Record<Levels, string | null>>;
    expectTypeOf<NonNullable<SylogOpts['levels']>>().toEqualTypeOf<LevelsRecord>();

    // Negative: disallow invalid keys or value types in levels
    // @ts-expect-error - 'trace' is not a valid level key
    const badLevels1: SylogOpts = { levels: { trace: 'TRACE' } };
    // @ts-expect-error - values must be string or null
    const badLevels2: SylogOpts = { levels: { info: 123 } };

    // timeStamp must be 'utc' or 'local' if provided
    // @ts-expect-error - invalid timestamp literal
    const badTs: SylogOpts = { timeStamp: 'UTC' };

    // Runtime sanity
    expect(typeof (full.prefix)).toBe('string');
    expect(full.showLevels).toBe(false);

    // Use variables in runtime to satisfy ESLint
    expect(minimal).toBeDefined();
    expect(badLevels1).toBeDefined();
    expect(badLevels2).toBeDefined();
    expect(badTs).toBeDefined();
  });
});