/**
 * Generate common string variants for a given name.
 *
 * @description
 * This can be used to normalize package or username formats by replacing `-`, `_`, or `.` characters in various ways.
 *
 * @returns An array of string variants.
 *
 * @example
 * ```ts
 * variants('my-package');
 * // Returns: ['mypackage', 'my_package', 'my.package', 'my-package', ...]
 * ```
 */
export function variantsLook(
  /**
   * The input string to generate variants.
   */
  name: string,
) {
  return [
    name.replace(/-/g, ''),
    name.replace(/-/g, '_'),
    name.replace(/-/g, '.'),
    name.replace(/_/g, ''),
    name.replace(/_/g, '-'),
    name.replace(/_/g, '.'),
    name.replace(/\./g, ''),
    name.replace(/\./g, '-'),
    name.replace(/\./g, '_'),
  ];
}

/**
 * Check that a username or array of usernames is valid.
 *
 * @throws {TypeError} If the argument is not a string or an array of strings.
 */
export function userLook(
  /** A string or an array of strings representing npm usernames. */
  username: string | string[],
) {
  if (!(typeof username === 'string') || !Array.isArray(username)) {
    throw new TypeError(
      `Invalid argument: expected a string or an array of strings, but received ${typeof username}`,
    );
  }
}

/**
 * Check that a package name or array of package names is valid.
 *
 * @throws {TypeError} If the argument is not a string or an array of strings.
 */
export function packageLook(
  /** A string or an array of strings representing npm package names. */
  name: string | string[],
) {
  if (!(typeof name === 'string') || !Array.isArray(name)) {
    throw new TypeError(
      `Invalid argument: expected a string or an array of strings, but received ${typeof name}`,
    );
  }
}
