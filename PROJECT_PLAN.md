# Lulusweets — concrete implementation plan

Brain `Projects/lulusweets/specs.md` is canonical. This file is a local convenience mirror and must be
kept aligned with Brain.

## Objective

Build a long-term recipe system in the correct order:

1. A complete, validated Obsidian/Markdown recipe vault.
2. An approved Lulusweets visual and interaction design.
3. A static PWA generated from the validated vault.

The Markdown vault is the source of truth. The PWA is a generated browsing interface.

## Current status

- `Recipe.docx.md` is the available Markdown conversion of the cookbook.
- `generated_recipe_vault/` is a useful prototype and the starting point for the audit. It is **not
  yet certified as complete or canonical**.
- The converted Markdown exposes 98 unique recipe/component titles after correcting for malformed
  headings. The prototype also has 98 recipe files.
- Equal counts do not prove content parity. Images are absent, some source boundaries are malformed,
  and every recipe still needs source-to-vault verification.
- The existing `site/`, `scripts/`, and `dist/` implementation is an **exploratory PWA prototype**.
  Website feature/design work is paused until the Obsidian vault passes its completion gate.
- The correct product/brand name is **Lulusweets**.
- `logo.jpg` is the visual reference for future design work.

## Operating rule

Work on one phase at a time. Do not begin the next phase until its completion gate is satisfied and
Lucia has reviewed the phase deliverables.

---

## Phase 0 — Reset and baseline

### Work

- Correct the product name to `Lulusweets` in project files.
- Preserve the current PWA as an exploratory prototype, not an approved design.
- Document `logo.jpg` as the brand reference.
- Preserve the source cookbook and current generated vault before bulk migration edits.
- Record this phased plan in the Brain.
- Add repository `AGENTS.md` enforcing Brain as source of truth and mandatory work-session updates.

### Deliverables

- This plan.
- `AGENTS.md`.
- `docs/BRAND_DIRECTION.md`.
- `audit/README.md`.
- Brain project state corrected.

### Completion gate

- [x] Naming is corrected.
- [x] Website work is explicitly marked paused/exploratory.
- [x] The plan exists locally and in the Brain.
- [x] Repository agent instructions enforce the Brain read/update protocol.

---

## Phase 1 — Authoritative cookbook inventory and gap audit

### Purpose

Determine what actually exists in the original cookbook and whether every piece is represented
correctly in `generated_recipe_vault`.

### Work

1. Obtain the authoritative original Google Doc export as `.docx`, including embedded images.
2. Create a source manifest containing, for every recipe/component:
   - Source title
   - Source category
   - Source location/range
   - Ingredient tables/components
   - Instruction sections
   - Notes/recommendations
   - Links/pairings
   - Images/assets
3. Compare each manifest entry with its generated Markdown file.
4. Classify every entry:
   - `complete`
   - `partial`
   - `missing`
   - `misassigned`
   - `needs-human-review`
5. Record source content that is not a standalone recipe but must still be preserved.
6. Resolve naming/category discrepancies:
   - Buttercreams vs Frostings
   - Dough vs Doughs
   - Cheesecake vs Cheesecakes
   - Sauces heading missing/malformed in the conversion
   - Healthy Recipes currently empty

### Deliverables

- `audit/source-manifest.csv`
- `audit/content-gap-report.md`
- Asset/image inventory
- Explicit list of ambiguous source sections requiring Lucia's decision

### Completion gate

- [ ] Every source recipe/component has exactly one manifest entry.
- [ ] Every source section and image is accounted for.
- [ ] Every generated note has a parity status.
- [ ] Missing, partial, and misassigned content is known—not inferred from file counts.
- [ ] Lucia approves the inventory and ambiguity decisions.

**No canonical-vault migration work proceeds until this gate passes.**

---

## Phase 2 — Build and validate the canonical Obsidian vault

### Purpose

Repair/promote the prototype into the permanent Markdown source of truth.

### Work

1. Freeze the recipe schema:
   - Stable `id`
   - `title`
   - `category`
   - `tags`
   - aliases
   - pairings/components
   - source reference
   - image references
   - migration/validation status
2. Freeze folder, filename, link, alias, and asset conventions.
3. Rebuild or repair every recipe note from the Phase 1 manifest.
4. Preserve:
   - All ingredient tables and component headings
   - Numbered instructions
   - Notes and recommendations
   - Images
   - Cross-recipe relationships
5. Generate category indexes and a root vault home/README.
6. Generate forward recipe links and reliable reverse “used in” relationships.
7. Validate:
   - Missing recipes/content
   - Broken/ambiguous links
   - Duplicate names/IDs
   - Missing assets
   - Metadata/schema consistency
   - Obsidian desktop rendering
   - Obsidian mobile rendering

### Deliverables

- Canonical recipe vault
- Recipe template
- Category indexes
- Vault README/home
- Machine-readable validation report
- Human review checklist

### Completion gate

- [ ] 100% of manifest entries are `complete`.
- [ ] Zero missing source content or images.
- [ ] Zero broken or ambiguous recipe links.
- [ ] Zero duplicate stable IDs/output paths.
- [ ] Obsidian desktop and mobile review passes.
- [ ] Lucia approves the vault as the permanent source of truth.

**No website design/implementation proceeds until this gate passes.**

---

## Phase 3 — Lulusweets website design

### Purpose

Agree on the aesthetic and user experience before coding the final PWA.

### Brand starting point

Use `logo.jpg` as the primary reference:

- Correct name: **Lulusweets**
- Playful illustrated bakery identity
- Pastel blue background
- Soft pink frosting
- Warm yellow bird
- Cherry-red accent
- Hand-drawn black outlines
- Friendly, whimsical, personal—not a generic documentation site or luxury editorial brand

### Work

1. Create a compact visual brief:
   - Color palette sampled from the logo
   - Typography direction
   - Illustration/icon treatment
   - Spacing, cards, borders, and motion principles
2. Define the core screens:
   - Home/search
   - Search results
   - Category
   - Recipe
   - Related recipes/components
   - Mobile cooking view
3. Create wireframes, then a polished static mockup using representative recipes.
4. Review search behavior:
   - Name
   - Category
   - Ingredient
   - Frosting/filling/pairing
   - Keyword
5. Review desktop and phone layouts with Lucia.

### Deliverables

- Approved visual brief
- Approved desktop and mobile mockups
- Approved search/filter behavior

### Completion gate

- [ ] Lucia approves the visual direction.
- [ ] Lucia approves all core screens.
- [ ] Search behavior is agreed before final implementation.

---

## Phase 4 — Build the final static PWA

### Purpose

Generate the approved interface exclusively from the canonical Obsidian vault.

### Work

- Replace or refactor the exploratory PWA based on the approved design.
- Generate all routes and search data from canonical Markdown.
- Add installable PWA assets using the approved Lulusweets brand.
- Support offline access and reliable cache updates.
- Preserve links/backlinks and recipe relationships in the website.
- Add automated build, link, search, accessibility, and browser tests.

### Completion gate

- [ ] Clean build from the canonical vault succeeds.
- [ ] Website recipe count and content match the manifest.
- [ ] Search acceptance tests pass.
- [ ] Desktop and mobile visual review passes.
- [ ] iPhone installation and offline use pass.
- [ ] Lucia approves the final browsing experience.

---

## Phase 5 — Hosting, backup, and release

### Work

- Select private/public hosting and domain strategy.
- Deploy the static PWA.
- Document editing, rebuilding, deploying, backing up, and restoring.
- Verify clean rebuild from a fresh copy of the Markdown vault.
- Retain the original cookbook as archival evidence until final sign-off.

### Completion gate

- [ ] Production site is reachable at the chosen URL.
- [ ] Backup/restore rehearsal passes.
- [ ] Maintenance instructions are complete.
- [ ] Original Google Doc is no longer needed as the working copy.

## Immediate next action

Complete Phase 0, then begin Phase 1 by obtaining the original `.docx` export and generating the
source-to-vault manifest. Do not continue PWA design or feature work.
