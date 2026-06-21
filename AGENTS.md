# Lulusweets — agent instructions

## Source of truth

The Brain vault is the canonical source of truth for this project:

`/Users/luciaurcuyo/Library/CloudStorage/GoogleDrive-lurcuyop@gmail.com/Other computers/My Mac/Brain`

Local files are implementation artifacts and working documents. If local documentation conflicts with
the Brain, the Brain wins unless Lucia explicitly changes the rule.

## Required reading before work

Before planning, editing, or implementing anything in this project:

1. Read the Brain's `SCHEMA.md`.
2. Read the Brain's `index.md`.
3. Read `Projects/lulusweets/_overview.md`.
4. Read the relevant project pages before acting:
   - `Projects/lulusweets/decisions.md`
   - `Projects/lulusweets/specs.md`
   - `Projects/lulusweets/technical.md`
   - `Projects/lulusweets/research.md`
   - `Projects/lulusweets/sources.md`
5. Confirm the current phase and completion gate in Brain `specs.md`.

Do not infer the current plan only from local files or prior chat context.

## Current execution rule

Follow the gated sequence recorded in Brain `Projects/lulusweets/specs.md`:

1. Authoritative source inventory and gap audit.
2. Complete and validate the canonical Obsidian vault.
3. Agree on the Lulusweets visual/search design using `logo.jpg`.
4. Build the final static PWA from the canonical vault.
5. Host, test, and document maintenance.

Do not skip a phase gate. The existing PWA code is exploratory until the Obsidian/source-content gate
and design-approval gate pass.

## Required Brain update after real work

At the end of every session that changes code, content, plans, decisions, or project understanding:

1. Refresh `Projects/lulusweets/_overview.md` → **Where I left off**:
   - Use an absolute ISO date.
   - State the current verified condition.
   - State blockers and the immediate next action.
2. Append new decisions to `Projects/lulusweets/decisions.md`:
   - Newest first.
   - Record the decision, why it was made, source, and status where useful.
3. Update `Projects/lulusweets/technical.md` if code, paths, tools, architecture, data, validation, or
   known issues changed.
4. Update `Projects/lulusweets/specs.md` if requirements, phase status, tasks, gates, or the plan changed.
5. Update `research.md` and `sources.md` when findings or evidence changed.
6. Add a parseable entry to the Brain root `log.md`:
   - `## [YYYY-MM-DD] build | Lulusweets — <subject>`
7. Update Brain `index.md` or `_Home.md` if the project summary/status materially changed.

Do not report a work session as complete until these Brain updates are done and verified.

## Naming and brand

- Product name: **Lulusweets**
- Never write the product name as “Lulu Sweets.”
- Brand reference: `/Users/luciaurcuyo/Desktop/lulusweets/logo.jpg`
- The final interface aesthetic must be discussed and approved before implementation.

## Local project references

- Working directory: `/Users/luciaurcuyo/Desktop/lulusweets`
- Converted source: `Recipe.docx.md`
- Obsidian prototype under audit: `generated_recipe_vault/`
- Local plan mirror: `PROJECT_PLAN.md`
- Preliminary audit: `audit/README.md`
- Brand notes: `docs/BRAND_DIRECTION.md`

The local plan may mirror the Brain plan for convenience, but Brain `specs.md` remains canonical.
