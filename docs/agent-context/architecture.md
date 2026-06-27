# Lulusweets Architecture

## Main Components

- `generated_recipe_vault/` - canonical recipe Markdown source.
- `audit/` - migration evidence, manifest, image extraction, mapping, and validation outputs.
- `scripts/build.mjs` - dependency-free Markdown/frontmatter parser and static PWA generator.
- `scripts/validate.mjs` - generated content and link validation.
- `scripts/serve.mjs` - local preview server.
- `scripts/browser-smoke.mjs` - Chrome smoke test for routing/search/offline behavior.
- `site/` - static app shell, CSS, client-side routing/search, manifest, service worker, and assets.
- `dist/` - disposable generated build output.

## Data Flow

```txt
Recipe.docx / Recipe.docx.md
        |
        v
audit/source-manifest.csv + audit/image-recipe-mapping.csv
        |
        v
generated_recipe_vault/
        |
        v
npm run build
        |
        v
dist/
```

## Canonical Recipe Schema

Recipe files use frontmatter like:

```yaml
---
title: "Vanilla Cake"
category: "cakes"
---
```

Recipe relationships are represented as Markdown/Obsidian wikilinks in body content, especially in
`## Recommended Pairings` sections. Obsidian backlinks provide reverse navigation.

## Canonical Vault Inventory

The canonical vault currently contains 99 recipes across 15 populated categories. The former
`Frostings` category is now split into `American Buttercreams` and `Buttercream Variations`.

`Buttercream Variations` contains Swiss Meringue Buttercream, Ermine Buttercream, and French
Buttercream. The remaining American buttercream recipes live in `American Buttercreams` and use
shortened recipe titles such as `Vanilla`, `Chocolate`, and `Cream Cheese` instead of repeating
`Buttercream` in each title.

## Runtime Architecture

The browsing layer is a static PWA:

- no application server at runtime,
- no recipe database,
- generated client-side search index,
- static hosting target,
- service worker for offline caching and cache updates.

## External Systems

- Brain vault:
  `/Users/luciaurcuyo/Library/CloudStorage/GoogleDrive-lurcuyop@gmail.com/Other computers/My Mac/Brain`
- GitHub repo:
  `https://github.com/lucia-urcuyo/lulusweets`

## Verified Commands

```sh
npm run check
npm run serve
npm run smoke
```

Latest recorded validation in Brain: 99 recipes, 15 categories, 94 relationships, 0 unresolved
wikilinks.

Latest local validation:

- 2026-06-27: `npm run check` and `npm run smoke` passed after adding `Ginger Molasses Chewy Cookies`
  under Cookies and updating the vault home/index plus recipe-count expectations. Build output: 99
  recipes, 15 categories, 94 relationships, 0 unresolved source links.
- 2026-06-27: `npm run check` passed after adding missing component links for Graham Cracker Crust,
  Pate a Choux, and Tart Crust. Build output: 98 recipes, 15 categories, 94 relationships, 0
  unresolved source links.
- 2026-06-27: `npm run check` and `npm run smoke` passed after splitting `Frostings` into
  `American Buttercreams` and `Buttercream Variations`, shortening American buttercream recipe titles,
  retargeting wikilinks, removing the search hint text, and hiding the native browser search clear
  control.
- 2026-06-27: `npm run check` and `npm run smoke` passed after Phase 3 Wave 3 active-search and
  recipe-reading polish. Chrome layout diagnostics showed `documentScrollWidth` equal to the viewport
  for mobile and desktop active-search views and mobile recipe detail. A headless browser check
  verified the recipe jump chips scroll to their target sections.
- 2026-06-27: `npm run check` and `npm run smoke` passed after the Phase 3 feedback pass that removed
  monogram/initial boxes, enlarged/simplified the logo treatment, and added PNG logo install icons.
  A follow-up replaced header usage of the full tall `logo.jpg` with the tighter centered PNG crop
  `site/logo-mark.png` and regenerated install icons from that crop. Chrome layout diagnostics showed
  `documentScrollWidth` equal to the viewport at 390px mobile for home and recipe detail, and at
  1440px desktop for the homepage. Ingredient tables and filter chips remain locally scrollable where
  intended.
- 2026-06-26: `npm run check` and `npm run smoke` passed after Phase 3 wave 2 visual/search
  refinements. Smoke now expects 9 `cream cheese` results, matching the current corpus and app search.
- 2026-06-26: Chrome layout diagnostics at 390px mobile and 1440px desktop reported
  `documentScrollWidth` equal to the viewport after Phase 3 wave 2. Ingredient tables and filter chips
  remain locally scrollable where intended.
- 2026-06-26: `npm run check` passed after Phase 3 wave 1 mobile overflow CSS refinements.
- 2026-06-26: Chrome layout diagnostics at 390px mobile reported `documentScrollWidth` equal to the
  viewport for home, active search, and recipe detail pages. Ingredient tables remain locally
  scrollable inside `.table-scroll`.

## Known Risks

- PWA cache invalidation needs explicit testing before release.
- iPhone home-screen behavior still needs device verification before release, though local PWA icon
  assets now use generated PNGs from the tight `logo-mark.png` crop.
- Hosting and deployment are undecided.
- Ingredient search currently relies on rendered ingredient text; normalized ingredients remain an
  open design question.
- Duplicate or same-name recipes could make title-only wikilinks ambiguous in the future.
