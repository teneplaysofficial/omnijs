/* 
Testing library and framework:
- This test suite is written to run under Vitest (preferred if present) or Jest with minimal changes.
  - If running under Vitest: import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
  - If running under Jest:    replace vi.* calls with jest.* and import from '@jest/globals' if needed.
*/

// eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, import/no-commonjs

// Try Vitest first; fallback types for Jest if needed
let describeFn: any, itFn: any, expectFn: any, beforeEachFn: any, afterEachFn: any, viLike: any
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const v = require('vitest')
  describeFn = v.describe; itFn = v.it; expectFn = v.expect; beforeEachFn = v.beforeEach; afterEachFn = v.afterEach; viLike = v.vi
} catch {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const j = require('@jest/globals')
  describeFn = j.describe; itFn = j.it; expectFn = j.expect; beforeEachFn = j.beforeEach; afterEachFn = j.afterEach
  // Map minimal vi-like API to jest
  viLike = {
    spyOn: (obj: any, key: any) => (j.jest.spyOn as any)(obj, key),
    fn: (impl?: any) => (j.jest.fn as any)(impl),
    useFakeTimers: (opts?: any) => (j.jest.useFakeTimers as any)(opts),
    setSystemTime: (d: Date) => (j.jest.setSystemTime as any)(d),
    useRealTimers: () => (j.jest.useRealTimers as any)(),
    resetModules: () => (j.jest.resetModules as any)(),
    mock: (id: string, factory: any) => (j.jest.mock as any)(id, factory),
    doMock: (id: string, factory: any) => (j.jest.doMock as any)(id, factory),
    unmock: (id: string) => (j.jest.unmock as any)(id),
    restoreAllMocks: () => (j.jest.restoreAllMocks as any)(),
    clearAllMocks: () => (j.jest.clearAllMocks as any)(),
  }
}

const { describe, it, expect, beforeEach, afterEach, vi } = {
  describe: describeFn, it: itFn, expect: expectFn, beforeEach: beforeEachFn, afterEach: afterEachFn, vi: viLike
}

/**
 * Mock ansilory to return stable, inspectable wrappers without real ANSI codes.
 * The Sylog implementation uses:
 *   - ansi.white.apply
 *   - ansi.blue.bold.apply
 *   - ansi.yellow.bold.apply
 *   - ansi.red.bold.apply
 *   - ansi.green.bold.apply
 *   - ansi.cyan.bold.apply
 *   - ansi.gray.apply
 *   - ansi.gray.bold.apply
 */
const makeAnsi = (name: string) => ({
  apply: (txt: string) => `<${name}>${txt}</${name}>`,
  bold: {
    apply: (txt: string) => `<${name}.bold>${txt}</${name}.bold>`,
  },
})
vi.doMock('ansilory', () => {
  return {
    __esModule: true,
    default: {
      white: makeAnsi('white'),
      blue: makeAnsi('blue'),
      yellow: makeAnsi('yellow'),
      red: makeAnsi('red'),
      green: makeAnsi('green'),
      cyan: makeAnsi('cyan'),
      gray: makeAnsi('gray'),
    },
  }
})

// Now import the module under test with the mocked ansilory in place.
// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-commonjs
const mod = require('./index.js') as typeof import('./index.js')
const Sylog = mod.Sylog as new (opts?: any) => any

describe('Sylog', () => {
  const FIXED = new Date('2020-01-02T03:04:05.678Z')

  let stdoutSpy: any
  let stderrSpy: any

  beforeEach(() => {
    vi.useFakeTimers({ now: FIXED })
    vi.setSystemTime(FIXED)
    stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.resetModules?.()
  })

  it('log() writes to stdout without level label by default', () => {
    const logger = new Sylog()
    logger.log('hello')

    expect(stdoutSpy).toHaveBeenCalledTimes(1)
    expect(stdoutSpy).toHaveBeenCalledWith('hello\n')
    expect(stderrSpy).not.toHaveBeenCalled()
  })

  it('info() writes to stdout with colored [INFO] prefix', () => {
    const logger = new Sylog()
    logger.info('hello')

    expect(stdoutSpy).toHaveBeenCalledTimes(1)
    const out = (stdoutSpy.mock.calls[0][0] as string)
    expect(out).toBe('<blue.bold>[INFO]</blue.bold> hello\n')
    expect(stderrSpy).not.toHaveBeenCalled()
  })

  it('warn() writes to stderr with colored [WARN] prefix', () => {
    const logger = new Sylog()
    logger.warn('be careful')
    expect(stderrSpy).toHaveBeenCalledTimes(1)
    expect(stderrSpy.mock.calls[0][0]).toBe('<yellow.bold>[WARN]</yellow.bold> be careful\n')
    expect(stdoutSpy).not.toHaveBeenCalled()
  })

  it('error() writes to stderr with colored [ERROR] prefix', () => {
    const logger = new Sylog()
    logger.error('boom')
    expect(stderrSpy).toHaveBeenCalledTimes(1)
    expect(stderrSpy.mock.calls[0][0]).toBe('<red.bold>[ERROR]</red.bold> boom\n')
  })

  it('success() writes to stdout with colored [SUCCESS] prefix', () => {
    const logger = new Sylog()
    logger.success('ok')
    expect(stdoutSpy).toHaveBeenCalledTimes(1)
    expect(stdoutSpy.mock.calls[0][0]).toBe('<green.bold>[SUCCESS]</green.bold> ok\n')
  })

  it('debug() writes to stdout with colored [DEBUG] prefix', () => {
    const logger = new Sylog()
    logger.debug('dbg')
    expect(stdoutSpy).toHaveBeenCalledTimes(1)
    expect(stdoutSpy.mock.calls[0][0]).toBe('<cyan.bold>[DEBUG]</cyan.bold> dbg\n')
  })

  it('respects showLevels=false to suppress level labels', () => {
    const logger = new Sylog({ showLevels: false })
    logger.info('no label')
    expect(stdoutSpy).toHaveBeenCalledTimes(1)
    expect(stdoutSpy.mock.calls[0][0]).toBe('no label\n')
  })

  it('includes prefix (gray.bold) when provided', () => {
    const logger = new Sylog({ prefix: 'MyApp' })
    logger.info('started')
    expect(stdoutSpy).toHaveBeenCalledTimes(1)
    expect(stdoutSpy.mock.calls[0][0]).toBe('<gray.bold>MyApp</gray.bold> <blue.bold>[INFO]</blue.bold> started\n')
  })

  it('includes UTC timestamp when showTimeStamp=true and timeStamp="utc"', () => {
    const logger = new Sylog({ showTimeStamp: true, timeStamp: 'utc' })
    logger.info('t')
    // UTC format: YYYY-MM-DD HH:mm:ss
    const expectedTs = '<gray>[2020-01-02 03:04:05]</gray>'
    expect(stdoutSpy).toHaveBeenCalledTimes(1)
    expect(stdoutSpy.mock.calls[0][0]).toBe(`${expectedTs} <blue.bold>[INFO]</blue.bold> t\n`)
  })

  it('stringifies object arguments and joins with sep', () => {
    const logger = new Sylog()
    logger.info('User', { id: 123, ok: true })
    expect(stdoutSpy).toHaveBeenCalledTimes(1)
    expect(stdoutSpy.mock.calls[0][0]).toBe('<blue.bold>[INFO]</blue.bold> User {"id":123,"ok":true}\n')
  })

  it('supports custom separator via LogOpts', () => {
    const logger = new Sylog()
    logger.info('a', 'b', 'c', { sep: ' | ' })
    expect(stdoutSpy).toHaveBeenCalledTimes(1)
    expect(stdoutSpy.mock.calls[0][0]).toBe('<blue.bold>[INFO]</blue.bold> a | b | c\n')
  })

  it('supports custom line ending via LogOpts', () => {
    const logger = new Sylog()
    logger.info('line-without-newline', { end: '' })
    expect(stdoutSpy).toHaveBeenCalledTimes(1)
    expect(stdoutSpy.mock.calls[0][0]).toBe('<blue.bold>[INFO]</blue.bold> line-without-newline')
  })

  it('does not treat plain object without sep/end as LogOpts', () => {
    const logger = new Sylog()
    logger.info({ a: 1 })
    expect(stdoutSpy).toHaveBeenCalledTimes(1)
    expect(stdoutSpy.mock.calls[0][0]).toBe('<blue.bold>[INFO]</blue.bold> {"a":1}\n')
  })

  it('debug() with no args still prints the level and newline', () => {
    const logger = new Sylog()
    logger.debug()
    expect(stdoutSpy).toHaveBeenCalledTimes(1)
    expect(stdoutSpy.mock.calls[0][0]).toBe('<cyan.bold>[DEBUG]</cyan.bold>\n')
  })

  it('log() with no args prints just a newline', () => {
    const logger = new Sylog()
    logger.log()
    expect(stdoutSpy).toHaveBeenCalledTimes(1)
    expect(stdoutSpy.mock.calls[0][0]).toBe('\n')
  })

  it('allows overriding a specific level label through options.levels', () => {
    const logger = new Sylog({ levels: { error: 'ERR', info: 'INFO', warn: 'WARN', success: 'SUCCESS', debug: 'DEBUG', log: null } })
    logger.error('bad')
    expect(stderrSpy).toHaveBeenCalledTimes(1)
    expect(stderrSpy.mock.calls[0][0]).toBe('<red.bold>[ERR]</red.bold> bad\n')
  })
})