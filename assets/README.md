# Orbitum developer site: mockup pages

Rendered HTML examples of the developer site mockups from the canvas
"Orbitum developer site · mockup drafts" (https://claude.ai/artifact/6iQB5LTnL6V2itGoCZ5ySr).

Open `index.html` for a gallery of every page.

## Folder layout

| Path | What it is |
|---|---|
| `index.html` | Gallery with a preview and a link for each page |
| `pages/*.html` | One page per canvas artboard (Main, Docs, ApiRef, Changelog, Directory, AgentSetup, Resources, LearningPath, RefArch, Support, ContactSupport, Error403, SearchDialog) |
| `css/orbitum-devsite.css` | Orbitum design-system tokens, base, components and shell, plus the developer-site extension (stylesheet v8, plus a small fix for the search field's focus ring) |
| `js/dc-lite.js` | Small renderer that runs the canvas templates in any browser |
| `previews/*.png` | 1440 × 900 screenshots of the top of each page |

## How the pages work

Each page keeps its canvas template (`<template data-dc-main>`) and its logic
(`class Component extends DCLogic`). `dc-lite.js` renders them, so interactions keep working:

- `{{holes}}`, `<sc-if>` and `<sc-for>`;
- event bindings and component state;
- the shared `SearchDialog` component, inlined into each page that imports it.

Links between pages point at the sibling `.html` files.

No build step or server is needed. You can open the files directly or serve the folder
(`npx serve assets`). Open Sans loads from Google Fonts; offline, the system font is used.

## Updating

These are snapshots. Edit the mockups on the canvas, then export them again.
