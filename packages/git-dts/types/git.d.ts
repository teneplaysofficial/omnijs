/**
 * Git - The stupid content tracker
 *
 * @description
 * Git is a fast, scalable, distributed revision control system with an unusually rich command set that provides both high-level operations and full access to internals.
 *
 * {@link https://git-scm.com/docs/git Git}
 */
export interface Git {
  flags?: GitFlags | GitFlags[];
  flagsWithValue?: GitFlagsWithValue;
}

/**
 * OPTIONS
 *
 * - `--version` Prints the Git suite version.
 * - `--help` Prints the synopsis and a list of the most commonly used commands.
 * - `--html-path` Print the path, without trailing slash, where Git’s HTML documentation is installed and exit.
 * - `--man-path` Print the manpath for the man pages for this version of Git and exit.
 * - `--info-path` Print the path where the Info files documenting this version of Git are installed and exit.
 * - `--paginate` Pipe all output into less (or if set, $PAGER) if standard output is a terminal. This overrides the pager.
 * - `--no-pager` Do not pipe Git output into a pager.
 */
export type GitFlags =
  | '--version'
  | '--help'
  | '--html-path'
  | '--man-path'
  | '--info-path'
  | '--paginate';

export interface GitFlagsWithValue {
  /**
   * -C <path>
   *
   * {@link https://git-scm.com/docs/git#Documentation/git.txt--Cpath}
   *
   * @example
   * ```sh
   * git --git-dir=a.git --work-tree=b -C c status
   * git --git-dir=c/a.git --work-tree=c/b status
   * ```
   */
  '-C'?: string;
  /**
   * -c <name>=<value>
   *
   * {@link https://git-scm.com/docs/git#Documentation/git.txt--cnamevalue}
   */
  '-c'?: string;
  /**
   * --config-env=<name>=<envvar>
   *
   * {@link https://git-scm.com/docs/git#Documentation/git.txt---config-envnameenvvar}
   */
  '--config-env'?: string;
  /**
   * --exec-path[=<path>]
   *
   * {@link https://git-scm.com/docs/git#Documentation/git.txt---exec-pathpath}
   */
  '--exec-path'?: string;
}
