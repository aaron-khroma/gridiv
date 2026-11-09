# Gridiv

**Grid-based content management for React.** Pages are _gridmaps_: reorderable, full-width **sections** whose content boxes (_gridivs_) are placed on a CSS grid. Each gridmap defines a layout per column count (12, 10, 8, 6, 4), and an auto-fit algorithm fills in any layout an editor hasn't defined yet.

> ⚠️ **Pre-release (0.x).** Being built in the open. Interactivity comes from [GElement](https://github.com/aaron-khroma/gelement), a peer dependency.

## Status

| Piece                         | State          |
| ----------------------------- | -------------- |
| Gridmap schema and validation | Planned (v0.1) |
| Auto-fit algorithm            | Planned (v0.1) |
| Renderer                      | Planned (v0.1) |
| Visual editor                 | Planned        |

## Install

```sh
npm install gridiv gelement react
```

## Development

```sh
nvm use          # Node 26
npm install
npm run check    # typecheck, lint, test, build
```

Releases use [Changesets](https://github.com/changesets/changesets) (`npm run changeset`). Merging to `prime` opens a release PR, and merging that publishes to npm.

## License

[MIT](LICENSE) © Aaron Clement
