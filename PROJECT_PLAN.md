# Lulusweets - Project Plan

Brain `Projects/lulusweets/specs.md` is the long-term canonical plan record. This file is a local
coding-agent mirror and should stay aligned with Brain when phase status changes.

## Objective

Build a long-term recipe system in this order:

1. A complete, validated Obsidian/Markdown recipe vault.
2. An approved Lulusweets visual and interaction design.
3. A static PWA generated from the validated vault.

The Markdown vault is the source of truth. The PWA is a generated browsing interface.

## Current Status

As of 2026-06-27:

- Phase 1 is complete: source inventory, gap audit, and image mapping are accounted for.
- Phase 2 is complete: `generated_recipe_vault/` is the canonical local vault.
- Phase 3 is in progress: the initial logo-derived PWA redesign is built. Phase 3 refinement wave 1
  fixed mobile horizontal overflow/clipping, and wave 2 strengthened header/logo treatment,
  logo-derived brand accents, recipe cards, filters, and recipe-page reading polish. A 2026-06-27
  feedback pass removed confusing category/recipe initial boxes, enlarged/simplified the real logo, and
  added logo-based PNG install icons. Follow-up logo asset fixes added and re-centered
  `site/logo-mark.png`, a tighter PNG crop used by the header and regenerated install icons. Wave 3
  added active-search summaries, clearer match labels, category filter counts, search-state result
  positioning, and recipe-page jump chips. A follow-up category/search cleanup split the former
  `Frostings` category into `American Buttercreams` and `Buttercream Variations`, shortened American
  buttercream recipe titles, removed the search hint line, and fixed the duplicate search clear button.
- GitHub Pages deployment is live at `https://lucia-urcuyo.github.io/lulusweets/`; hosted smoke passed.
- Final PWA work, hosting, and release remain gated behind Phase 3 approval.

## Operating Rule

Work on one phase at a time. Do not begin the next phase until the current completion gate is satisfied
and Lucia has reviewed the phase deliverables.

For coding-agent work, start with `AGENTS.md` and `docs/agent-context/current-state.md`.

## Phase 0 - Reset And Baseline

Status: complete.

Deliverables completed:

- Product name corrected to **Lulusweets**.
- Existing PWA marked exploratory until design approval.
- `logo.jpg` recorded as the brand reference.
- Brain and repo governance established.

Gate: passed 2026-06-20.

## Phase 1 - Authoritative Cookbook Inventory And Gap Audit

Status: complete.

Deliverables completed:

- `audit/source-manifest.csv`
- `audit/content-gap-report.md`
- `audit/image-recipe-mapping.csv`
- PDF/image extraction evidence under `audit/`
- Lucia decisions for ambiguous content.

Gate: passed 2026-06-21.

## Phase 2 - Canonical Obsidian Vault

Status: complete.

Deliverables completed:

- Canonical vault with 99 recipes and 15 categories.
- `title` and `category` frontmatter.
- No tags.
- Root home page, category indexes, recipe template.
- 94 validated relationships and 0 broken links.

Gate: passed 2026-06-21.

## Phase 3 - Lulusweets Visual/Search Design

Status: in progress.

Current work:

- Review the logo-derived pastel visual design.
- Wave 1 complete: CSS-only mobile overflow fix for the homepage, search, category grid, filter row,
  recipe cards, recipe detail pages, ingredient tables, and instruction sections.
- Wave 2 complete: focused visual/search polish for the logo/header, brand accents, category and recipe
  cards, filter states, and recipe detail readability.
- Feedback pass complete: removed `Ck`/`Cp`-style monogram boxes, kept category cards understandable
  with real labels/counts and color strips, enlarged the header logo without the extra black CSS ring,
  and added PNG install icons generated from `logo.jpg`.
- Logo asset fix complete: replaced header usage of the full tall `logo.jpg` with `site/logo-mark.png`
  so the logo fills the visible mark better, is centered, and is less soft when displayed small.
- Wave 3 complete: active search now collapses the category grid and brings results directly under the
  hero, filter chips show category counts, recipe cards label match context, and recipe pages include
  Ingredients/Instructions/Pairings/Related jump chips.
- Category/search cleanup complete: `Frostings` is now `American Buttercreams` plus `Buttercream
  Variations`; Swiss Meringue Buttercream, Ermine Buttercream, and French Buttercream are in the
  variation category; American buttercream recipe titles omit `Buttercream`; the search hint line is
  removed; and the browser-native search clear button is hidden.
- Recipe addition complete: `Ginger Molasses Chewy Cookies` added under Cookies with concise
  Lulusweets-style instructions; validation now expects 99 recipes.
- Agree typography, category colors, layout, image treatment, and search behavior.
- Review desktop and mobile screens with Lucia.
- Add a file watcher for automatic rebuilds when the vault changes.

Gate:

- Lucia approves the visual brief, core screens, and search behavior.

## Phase 4 - Final Static PWA

Status: not started.

Work:

- Generate the final interface exclusively from the canonical vault.
- Add approved icons/branding, offline behavior, and cache updates.
- Add content-parity, search, accessibility, link, and browser tests.
- Validate installability/offline behavior on iPhone and desktop.

Gate:

- Clean canonical build, content/search tests pass, and Lucia approves desktop/mobile experience.

## Phase 5 - Hosting And Release

Status: started. GitHub Pages deployment is live; final phone/install and release checks remain.

Work:

- [x] Choose hosting/domain strategy: GitHub Pages.
- [x] Add GitHub Pages workflow to build and publish `dist/`.
- [x] Verify first GitHub Actions deployment and Pages URL.
- [ ] Verify iPhone Add to Home Screen and update behavior.
- Document edit/build/deploy/backup/restore.
- Verify clean rebuild and recovery.

Gate:

- Production access, backup/restore, and maintenance documentation pass.
