<div align="center">

# Git DTS

_Reusable Git type definitions for TypeScript_

</div>

[![npm](https://img.shields.io/npm/v/git-dts.svg)](https://www.npmjs.com/package/git-dts) [![npm downloads](https://img.shields.io/npm/d18m/git-dts)](https://www.npmjs.com/package/git-dts)

## Overview

`git-dts` provides a comprehensive set of TypeScript type definitions for Git-related data structures, including commits, branches, tags, remotes, references, statuses, diffs, and semantic versioning. Designed for developers building Git-based tools, such as command-line interfaces, release management systems, or CI/CD automation scripts, this package ensures type safety and streamlines development by offering reusable, well-defined types.

## Installation

Install `git-dts` as a development dependency using your preferred package manager:

```bash
npm i -D git-dts
# or
yarn add -D git-dts
# or
pnpm add -D git-dts
```

## Why Use `git-dts`?

Building Git-based tools often requires defining common data structures like commits, branches, tags, or statuses. Recreating these types for each project is repetitive and error-prone. `git-dts` eliminates this overhead by providing a centralized, reusable collection of TypeScript type definitions, enabling developers to focus on building robust tools with enhanced type safety and consistency.

## Usage

Import the types from `git-dts` into your TypeScript project to leverage type-safe Git data structures. For example:

```ts
import { Commit, Branch } from 'git-dts';

function processCommit(commit: Commit) {
  console.log(`Processing commit: ${commit.sha} by ${commit.author.name}`);
}

function switchBranch(branch: Branch) {
  console.log(`Switching to branch: ${branch.name}`);
}
```

## License

Released under the [Apache License 2.0](../../LICENSE).
