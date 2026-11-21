# Contributing to the Orbitum docs

Thanks for helping. The full guide is on the site at `/style-guide/` (source in `src/content/docs/style-guide/`). This file is the short version.

## 1. Run the site

```sh
docker compose up --build dev    # or: npm install && npm run dev
```

Open http://localhost:1111. Pages reload as you save.

## 2. Make your change

- **A page:** add or edit an `.mdx` file in `src/content/docs/`. The path is the URL. Folder and file names are lowercase with dashes, and every folder has an `index.mdx`.
- **The sidebar:** add a `link("Label", "/path/")` line to the right group in `astro.config.ts`.
- **Shared text:** put it in `src/content/partials/` and include it with `<Render file="…" />`.
- **A changelog entry:** add `src/content/changelog/<product>/<YYYY-MM-DD>-<slug>.mdx`.
- **A product:** add a YAML file to `src/content/directory/`.
- **The API reference:** edit `src/api/openapi.yaml`. Don't edit the generated pages.

Every page needs `title` and `description` frontmatter and a `pcx_content_type`. See `/style-guide/frontmatter/` and `/style-guide/content-types/`.

## 3. Follow the style

- Sentence case, plain words, units on numbers. See `/style-guide/writing/`.
- Sample data only: `acme-demo`, `example.com`, `203.0.113.0/24`. Never real customer names.
- Components and styles use Orbitum design-system tokens only. No literal colours, fonts, radii or shadows.

## 4. Check it

```sh
npm run check
npm run build
npm run lint:docs
```

## 5. Open a pull request

Branch from `main` and open a pull request against `main`. Say which pages changed and why. For a visual change, say which mockup in `assets/` you followed.
