# CloudOrbitum Developer Documentation

The official documentation for the Orbitum platform.

Welcome to the open-source repository for all [CloudOrbitum's Documentation](https://developers.cloudorbitum.com/).

To learn how to contribute, visit the [CloudOrbitum Style Guide](https://developers.cloudorbitum.com/style-guide/contributions/).

## Run it locally

### With Docker

```sh
docker compose up --build        # production build on http://localhost:8080
docker compose up --build dev    # live reload on http://localhost:1111
```

### With Node.js 24

```sh
npm install
npm run dev                      # http://localhost:1111
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with live reload on port 1111 |
| `npm run build` | Static build in `dist/` (also checks MDX, frontmatter and internal links) |
| `npm run preview` | Serves `dist/` |
| `npm run check` | Type-checks Astro components and content schemas |
| `npm run lint:docs` | Nimbus authoring lint (run after a build) |

## Contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Contributions page](https://developers.cloudorbitum.com/style-guide/contributions/) of the style guide. Everyone who takes part follows the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Don't report security problems in public issues. See [SECURITY.md](SECURITY.md).

## Licence

Code: MIT ([LICENSE](LICENSE)). Open Sans: SIL Open Font License 1.1 (`src/styles/orbitum/fonts/LICENSE`).
