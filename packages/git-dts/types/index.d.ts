/**
 * Type definitions for Git data structures.
 * Provides reusable, strongly-typed definitions for commits, branches, tags, remotes, refs, repository status, and more.
 * Designed for TypeScript projects, Git-based tools, CLI utilities, and automation scripts.
 *
 * @package git-dts
 *
 * @license Apache-2.0
 */

/**
 * Hexadecimal character
 *
 * @description
 * Valid values are in the range `0`–`9` and `a`–`f`.
 */
export type HexChar =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f';

/**
 * A 40-character Git hash.
 *
 * @example
 * `3bf8ab430eb2182e787e0f1c74c0d9ccab89e4ac`
 */
export type Hash = string;

/**
 * A 7-character short Git hash.
 *
 * @example
 * `3bf8ab4`
 */
export type ShortHash = string;

export * from './git';
