# Lulusweets Agent Operations

## Start Here

For coding-agent work in this repo:

1. Read `AGENTS.md`.
2. Read `docs/agent-context/current-state.md`.
3. Read the relevant file under `docs/agent-context/`.
4. Check the Brain only when broader history, decisions, phase gates, or long-term context are needed.

If repo-local context and Brain disagree, pause and document the conflict. Do not silently choose one
without checking the date, source, and task impact.

## Safe Inspection

Use fast read-only inspection first:

```sh
rg --files
rg "pattern"
git status --short
npm run check
```

Prefer targeted file reads over broad rewrites. Do not infer project state from generated output alone.

## Build And Validation

Use:

```sh
npm run build
npm run validate
npm run check
```

For browser behavior, start the preview server:

```sh
npm run serve
```

Then run:

```sh
npm run smoke
```

## Documentation Updates

After a meaningful change, update repo context first:

- `docs/agent-context/current-state.md` for status, blockers, and next safe steps.
- `docs/agent-context/decision-log.md` for new decisions.
- `docs/agent-context/architecture.md` for structure, data flow, or tool changes.
- `docs/agent-context/operations.md` for command, testing, deployment, or workflow changes.

Update Brain when the change matters beyond the immediate coding session, changes project direction,
changes decisions, changes architecture, changes phase status, or should survive outside this repo.

## Brain Update Targets

Brain path:

```txt
/Users/luciaurcuyo/Library/CloudStorage/GoogleDrive-lurcuyop@gmail.com/Other computers/My Mac/Brain
```

For meaningful Lulusweets work, update relevant pages under:

```txt
Projects/lulusweets/
```

Also add a parseable root log entry:

```txt
## [YYYY-MM-DD] build | Lulusweets — <subject>
```

## Safety Rules

- Do not change production code, infra, deployment config, secrets, cloud resources, databases, or
  external services unless explicitly asked.
- Do not edit `dist/` by hand.
- Do not change recipe content, filenames, schema, or category layout without source/context review.
- Do not skip the current phase gate.
- Do not reintroduce the abandoned iCloud sync path as the primary vault strategy.

## Deployment Rules

Hosting path: GitHub Pages from `.github/workflows/pages.yml`.

Live URL:

```txt
https://lucia-urcuyo.github.io/lulusweets/
```

Deployment flow:

```sh
git push origin main
```

GitHub Actions then runs `npm run check`, uploads `dist/`, and publishes it with GitHub Pages.
Do not edit `dist/` by hand or commit generated `dist/`.

After deploy, verify the GitHub Actions run and open the Pages URL on desktop and phone.

Hosted smoke check:

```sh
APP_URL=https://lucia-urcuyo.github.io/lulusweets/ npm run smoke
```

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
