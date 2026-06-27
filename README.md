# Lulusweets

A Markdown-first recipe system with a canonical Obsidian recipe vault and a generated static PWA for
searching and reading recipes.

## Start Here

- Coding agents: read [`AGENTS.md`](AGENTS.md), then
  [`docs/agent-context/current-state.md`](docs/agent-context/current-state.md).
- Project context: see [`docs/agent-context/`](docs/agent-context/).
- Local plan mirror: see [`PROJECT_PLAN.md`](PROJECT_PLAN.md).

## Current Status

Phase 2 is complete: the local Obsidian vault is canonical and validated with 99 recipes across 15
categories.

Phase 3 is in progress: the logo-derived visual/search design needs Lucia's review and approval before
final PWA work proceeds.

## Current Structure

- `generated_recipe_vault/` - canonical local Obsidian/Markdown recipe vault.
- `site/` - PWA source files; current design is still under Phase 3 review.
- `scripts/build.mjs` - converts recipe Markdown into generated cookbook data and static output.
- `scripts/validate.mjs` - checks generated recipe counts, links, routes, and required PWA assets.
- `dist/` - generated site output; safe to delete and rebuild, not edited by hand.
- `audit/` - source-to-vault inventory, validation, images, and gap reports.
- `docs/agent-context/` - distilled project context for coding agents.
- `docs/BRAND_DIRECTION.md` - logo-derived brand notes.

## Preview

```sh
npm run check
npm run serve
```

Then open `http://127.0.0.1:4173`.

With the preview server running:

```sh
npm run smoke
```

## Editing Rule

Recipe content lives in Markdown. Generated files under `dist/` should not be edited by hand.
