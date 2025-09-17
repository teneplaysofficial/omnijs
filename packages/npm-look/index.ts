import ansi from 'ansilory';

/**
 * Generate common string variants for a given package or username.
 *
 * @returns An array of unique string variants replacing '-', '_', and '.' in different ways.
 */
export function variantsLook(
  /** The string to generate variants from. */
  name: string,
) {
  return [
    ...new Set([
      name.replace(/-/g, ''),
      name.replace(/-/g, '_'),
      name.replace(/-/g, '.'),
      name.replace(/_/g, ''),
      name.replace(/_/g, '-'),
      name.replace(/_/g, '.'),
      name.replace(/\./g, ''),
      name.replace(/\./g, '-'),
      name.replace(/\./g, '_'),
    ]),
  ];
}

/**
 * Ensure a value is an array.
 *
 * @returns An array of strings.
 */
function toList(
  /** A string or array of strings. */
  vals: string | string[],
) {
  return Array.isArray(vals) ? vals : [vals];
}

/**
 * Fetch npm package or username data from the registry.
 *
 * @returns The fetched data as JSON, or `true/false` for user availability.
 */
export async function getDataLook(
  /** Package or username to check. */
  name: string,
  /** Optional settings */
  opts = {
    /**
     * Check an npm username instead of a package.
     *
     * @default false
     */
    user: false,
  },
) {
  const NPM_ENDPOINT = !opts.user
    ? 'https://registry.npmjs.org/'
    : 'https://www.npmjs.com/~';

  try {
    const res = await fetch(NPM_ENDPOINT + name);
    if (opts.user) return res.status === 404;
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(ansi.red.apply('Error:'), (err as Error).message);
  }
}

/**
 * Check npm username availability.
 *
 * @throws {TypeError} If the argument is not a string or an array of strings.
 */
export async function userLook(
  /** A string or array of usernames to check. */
  username: string | string[],
) {
  if (typeof username !== 'string' && !Array.isArray(username)) {
    throw new TypeError(
      `Invalid argument: expected a string or an array of strings, but received ${typeof username}`,
    );
  }

  const data = toList(username);

  await Promise.all(
    data.map(async (n) => {
      if (!/^[a-z0-9-]+$/.test(n)) {
        console.error(
          ansi.red.apply('Invalid npm username:'),
          ansi.yellow.apply(n),
          '\n',
          ansi.gray.apply(
            'Usernames must be lowercase and can only contain letters, numbers, and dashes (-)',
          ),
        );
        return;
      }

      if (await getDataLook(n, { user: true })) {
        console.info(
          ansi.green.apply('Username available:'),
          ansi.cyan.apply(n),
        );
        return;
      }

      console.warn(
        ansi.red.apply('Username not available:'),
        ansi.yellow.apply(n),
        '\n',
        ansi.gray.apply(`Profile: https://www.npmjs.com/~${n}`),
      );
    }),
  );
}

/**
 * Check npm package name availability and conflicts.
 *
 * @throws {TypeError} If the argument is not a string or an array of strings.
 */
export async function packageLook(
  /** A string or array of package names to check. */
  name: string | string[],
) {
  if (typeof name !== 'string' && !Array.isArray(name)) {
    throw new TypeError(
      `Invalid argument: expected a string or an array of strings, but received ${typeof name}`,
    );
  }

  const data = toList(name);

  await Promise.all(
    data.map(async (n) => {
      const match = n.startsWith('@') ? n.split('/') : n;

      console.info(
        Array.isArray(match)
          ? `${ansi.blue.apply('Checking package')} ${ansi.yellow.apply(match[1])} ${ansi.blue.apply('under scope')} ${ansi.magenta.apply(match[0])}`
          : `${ansi.blue.apply('Checking package')} ${ansi.yellow.apply(match)}`,
      );

      const result = await getDataLook(n);

      if (!result.error) {
        console.warn(
          ansi.red.apply('Package name not available:'),
          ansi.yellow.apply(n),
        );
        return;
      }

      console.info(
        ansi.green.apply('Package name looks available:'),
        ansi.cyan.apply(n),
      );

      console.info(
        ansi.blue.apply('Checking conflicts for:'),
        ansi.yellow.apply(n),
      );

      const _ = Array.isArray(match) ? match[1] : n;

      const names = variantsLook(_).filter((v) => v !== _);

      let hasConflict = false;

      for (const v of names) {
        const res = await getDataLook(
          Array.isArray(match) ? match[0] + '/' + v : v,
        );

        if (!res.error) {
          console.warn(
            ansi.red.apply('Conflict:'),
            ansi.yellow.apply(n),
            'with',
            ansi.cyan.apply(res.name),
            '\n',
            ansi.gray.apply(`URL: https://www.npmjs.com/package/${res.name}`),
          );

          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        console.info(
          ansi.green.apply('No conflicts found, available to claim:'),
          ansi.cyan.apply(n),
        );
      }
    }),
  );
}
