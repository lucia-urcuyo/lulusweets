# Lulusweets - Agent Instructions

## Context Order

For coding-agent work inside this repo, use repo-local context first:

1. `AGENTS.md`
2. `docs/agent-context/current-state.md`
3. Relevant files under `docs/agent-context/`
4. Relevant source files, scripts, tests, and docs
5. Brain project pages when broader history, phase gates, decisions, or durable project memory matter

The Obsidian Brain remains the broader long-term project memory and evidence trail:

```txt
/Users/luciaurcuyo/Library/CloudStorage/GoogleDrive-lurcuyop@gmail.com/Other computers/My Mac/Brain
```

If repo-local docs and Brain disagree, check dates and sources. Do not silently guess when the conflict
affects behavior, phase gates, safety, architecture, or project direction.

## Current Project Gate

Read `docs/agent-context/current-state.md` before planning edits.

Current phase as of 2026-06-26: Phase 3 is in progress. The canonical vault is validated, and final
PWA work waits on Lucia's approval of the Lulusweets visual/search design.

Do not skip the gated sequence:

1. Authoritative source inventory and gap audit. Complete.
2. Complete and validate the canonical Obsidian vault. Complete.
3. Agree on the Lulusweets visual/search design using `logo.jpg`. In progress.
4. Build the final static PWA from the canonical vault.
5. Host, test, and document maintenance.

## Project References

- Working directory: `/Users/luciaurcuyo/Desktop/lulusweets`
- Repo context: `docs/agent-context/`
- Canonical vault: `generated_recipe_vault/`
- Converted source: `Recipe.docx.md`
- Source PDF: `Recipe.docx`
- Audit outputs: `audit/`
- Brand reference: `logo.jpg`
- Local plan mirror: `PROJECT_PLAN.md`
- Brain project: `Projects/lulusweets/`

## Naming And Brand

- Product name: **Lulusweets**
- Never write the product name as "Lulu Sweets."
- The final interface aesthetic must be discussed and approved before final PWA implementation.
- `logo.jpg` is the primary visual reference.

## Editing Rules

- Do not edit generated `dist/` output by hand.
- Treat `generated_recipe_vault/` as the canonical recipe source. Check links/search/build impact
  before changing recipe filenames, categories, schema, or relationships.
- Keep generated website output reproducible from the vault.
- Prefer existing project patterns and scripts over introducing new tools.
- Do not change production code, notebooks, model files, infra, deployment config, secrets, cloud
  resources, or database resources unless explicitly asked.
- Do not deploy or change hosting without Lucia's approval.

## Validation

For site or build changes, run:

```sh
npm run check
```

For browser behavior, use:

```sh
npm run serve
npm run smoke
```

Report any validation that could not be run.

## Ponytail / Minimal Implementation Rule

Prefer the smallest correct change.

Before adding new code, check whether:

1. the behavior already exists in the codebase,
2. a standard library or platform feature already handles it,
3. an existing dependency already solves it,
4. the change can be done with a small targeted edit instead of a new abstraction.

Do not use minimalism as an excuse to remove validation, monitoring, logging, accessibility, error
handling, security, data-quality checks, tests, or production safeguards.

When in doubt, explain the tradeoff before editing.

## Documentation Update Protocol

After any meaningful task, update repo context when relevant:

1. `docs/agent-context/current-state.md`
2. `docs/agent-context/decision-log.md`
3. `docs/agent-context/architecture.md`
4. `docs/agent-context/operations.md`
5. `PROJECT_PLAN.md` or peer-facing docs if phase, workflow, or user-facing behavior changed

Also update Brain when the change matters beyond the immediate coding session:

1. Refresh `Projects/lulusweets/_overview.md` -> **Where I left off**.
2. Append decisions to `Projects/lulusweets/decisions.md` newest first.
3. Update `Projects/lulusweets/technical.md` for code, paths, tools, architecture, validation, or
   known issue changes.
4. Update `Projects/lulusweets/specs.md` for requirements, phase status, tasks, gates, or plan changes.
5. Update `research.md` and `sources.md` when findings or evidence changed.
6. Add a parseable root Brain `log.md` entry:

```txt
## [YYYY-MM-DD] build | Lulusweets — <subject>
```

Do not report a meaningful work session as complete until required repo and Brain updates are done or
you have clearly reported why they could not be completed.
