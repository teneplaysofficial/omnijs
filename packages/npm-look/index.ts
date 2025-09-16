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

function toList(vals: string | string[]) {
  return Array.isArray(vals) ? vals : [vals];
}

export async function getDataLook(name: string) {
  const NPM_ENDPOINT = 'https://registry.npmjs.org/';

  try {
    const res = await fetch(NPM_ENDPOINT + name);
    const data = await res.json();

    return data;
  } catch (err) {
    console.error((err as Error).message);
  }
}

/**
 * Check that a username or array of usernames is valid.
 *
 * @throws {TypeError} If the argument is not a string or an array of strings.
 */
export async function userLook(
  /** A string or an array of strings representing npm usernames. */
  username: string | string[],
) {
  if (!(typeof username === 'string') || !Array.isArray(username)) {
    throw new TypeError(
      `Invalid argument: expected a string or an array of strings, but received ${typeof username}`,
    );
  }

  const data = toList(username);

  await Promise.all(
    data.map(async (n) => {
      if (!/^[a-z0-9-]+$/.test(n)) {
        console.error(
          'Invalid npm username:',
          n,
          '\nUsernames must be lowercase and can only contain letters, numbers, and dashes (-)',
        );
        return;
      }
    }),
  );
}

/**
 * Check that a package name or array of package names is valid.
 *
 * @throws {TypeError} If the argument is not a string or an array of strings.
 */
export async function packageLook(
  /** A string or an array of strings representing npm package names. */
  name: string | string[],
) {
  if (!(typeof name === 'string') || !Array.isArray(name)) {
    throw new TypeError(
      `Invalid argument: expected a string or an array of strings, but received ${typeof name}`,
    );
  }

  const data = toList(name);
}
