# Lulusweets

A Markdown-first recipe system. The current priority is validating and completing the canonical
Obsidian recipe vault before final website design or implementation.

See [`PROJECT_PLAN.md`](PROJECT_PLAN.md) for the required phase order.

## Current structure

- `generated_recipe_vault/` — Obsidian prototype under source-to-content audit; not yet canonical.
- `site/` — exploratory PWA interface source; design work is paused.
- `scripts/build.mjs` — converts recipe Markdown into the generated cookbook data and static app.
- `scripts/validate.mjs` — checks generated recipe counts, links, routes, and required PWA assets.
- `dist/` — generated site output; safe to delete and rebuild.
- `audit/` — source-to-vault inventory and gap reports.
- `docs/` — project design references, including the logo-derived brand direction.

## Exploratory PWA preview

```sh
npm run check
npm run serve
```

Then open `http://127.0.0.1:4173`.

This prototype does not represent an approved Lulusweets aesthetic and is not the current project
phase.

## Editing rule

Recipe content is edited in Markdown. Files under `dist/` are generated and should not be edited by
hand.
