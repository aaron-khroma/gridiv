# Developer guide

How Gridiv is built, for learning and for reference. The **map** below walks the repo from the top down. Each system lists the features and concepts it uses, where to see them in the code, and the official docs to read next. **Guides** go deeper on one system at a time.

What Gridiv _is_ lives in the [README](../../README.md); the workflow lives in [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Guides

| Guide                              | Covers                                                                     |
| ---------------------------------- | -------------------------------------------------------------------------- |
| [Publishing to npm](publishing.md) | ESM output, the `exports` map, Changesets, release PRs, Trusted Publishing |

Add a guide when a system gets big enough to need a walkthrough (the gridmap schema and the auto-fit algorithm will), and link it from the map below.

## Map of the repo

```
gridiv/
├── src/                      The library's TypeScript source
│   ├── index.ts              The entry point: column counts, grid geometry, gridWidth()
│   └── index.test.ts         Its unit tests
├── dist/                     Build output (git-ignored): .js, .d.ts, and source maps
├── docs/dev/                 This guide
├── .changeset/               Changesets config, plus pending release notes
├── .github/                  CI and release workflows, and the PR template
├── CHANGELOG.md              Written by Changesets at each release
└── tsconfig*.json, *.config.*  TypeScript, Vitest, ESLint, Prettier
```

The gridmap schema, the auto-fit algorithm, and the renderer arrive with v0.1 (see the README's status table), each in its own folder under `src/`.

### Grid geometry: `src/index.ts`

The first pieces are the grid's fixed facts, written so TypeScript derives types from data instead of repeating it:

```ts
export const COLUMN_COUNTS = [12, 10, 8, 6, 4] as const;
export type ColumnCount = (typeof COLUMN_COUNTS)[number];
```

- **`as const`** makes the array readonly and keeps its exact values: its type is `readonly [12, 10, 8, 6, 4]`, not `number[]`.
- **`typeof COLUMN_COUNTS`** takes that type from the value, and **`[number]`** asks for the type of any element: `12 | 10 | 8 | 6 | 4`. Add a column count to the array, and the `ColumnCount` type follows. `gridWidth(7)` is a type error.
  Docs: [Const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html), [`typeof` types](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html), [Indexed access types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
- **`gridWidth(columns, geometry = DEFAULT_GEOMETRY)`** uses a default parameter, so callers pass a geometry only when it differs from Grid.Studio's 84px cells and 12px gaps.

### Dependencies on GElement and React: `package.json`

Gridiv uses GElement for interactivity, but it doesn't bundle its own copy:

- **`peerDependencies`** says "the host app provides `@styleeyes/g-element` (any `0.x`) and React". npm installs exactly one copy of each, shared by the app and Gridiv. With two GElements, an app's wires couldn't reach Gridiv's parts, because each copy would have its own circuit.
- **`devDependencies`** lists them _again_, so they're installed while developing and testing Gridiv itself. Apps that install Gridiv never get dev dependencies.

Docs: [package.json › peerDependencies](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)

### The public API: `package.json` `exports`

The `exports` map lists the only entry point (`.`), with its `types` path first. `"type": "module"` makes the package ES modules, `"sideEffects": false` lets bundlers drop anything an app doesn't use, and `files` decides what goes into the npm package. All of this, and the `.js` extensions in imports, is explained in [Publishing to npm](publishing.md).
Docs: [Package entry points](https://nodejs.org/api/packages.html), [Tree shaking](https://webpack.js.org/guides/tree-shaking/)

### TypeScript: `tsconfig.json`, `tsconfig.build.json`

- **Two configs.** `tsconfig.json` typechecks everything, tests and config files included (`npm run typecheck`). `tsconfig.build.json` extends it to emit `dist/`: JavaScript, `.d.ts` type declarations, and maps, leaving the tests out.
- **`NodeNext` modules**: relative imports end in `.js` (`from './index.js'`) so Node can load the built files. See [Publishing to npm](publishing.md#esm-output-and-the-js-extension).
- **Stricter than `strict`**, all in the [tsconfig reference](https://www.typescriptlang.org/tsconfig/):
  - `noUncheckedIndexedAccess`: `array[i]` and `record[key]` may be `undefined`, so you must check.
  - `exactOptionalPropertyTypes`: an optional property may be left out, but not set to `undefined` explicitly.
  - `verbatimModuleSyntax`: type-only imports and exports must be marked `type`.

### Tests: `*.test.ts`, `vitest.config.ts`

- **Vitest** runs `src/**/*.test.ts`, next to the code they test. [`index.test.ts`](../../src/index.test.ts) checks `gridWidth` against the 1140px Grid.Studio container.
- **`globals: true`** makes `describe`, `it`, and `expect` available without imports; `"types": ["vitest/globals"]` in `tsconfig.json` tells TypeScript about them.
- **`environment: 'jsdom'`** gives tests a simulated browser DOM, ready for the renderer.

Docs: [Vitest guide](https://vitest.dev/guide/), [config](https://vitest.dev/config/)

### Quality checks: `npm run check`

`check` runs, in order: typecheck, lint (ESLint, then Prettier's formatting check), tests, build, and **smoke**. Smoke imports the built `dist/index.js` with plain Node, which catches a package that compiles but can't actually load.

- **ESLint** uses `typescript-eslint`'s strict rules and React's rules of hooks, in a flat config (`eslint.config.js`). Docs: [Configuration files](https://eslint.org/docs/latest/use/configure/configuration-files)
- **Prettier** owns formatting (tabs, single quotes, 100 columns). Docs: [Prettier](https://prettier.io/docs/)

### CI and releases: `.github/workflows/`, `.changeset/`

- **`ci.yml`** runs typecheck, lint, tests, and build on every pull request and every push to `prime`. `prime` requires it to pass.
- **`release.yml`** and **Changesets** turn merged changes into npm releases.
  Guide: [Publishing to npm](publishing.md)
