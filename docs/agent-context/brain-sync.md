# Lulusweets Brain Sync

## Relationship Between Repo Docs And Brain

Repo-local docs are the first source of truth for coding-agent work inside this repo:

- `AGENTS.md`
- `docs/agent-context/current-state.md`
- the rest of `docs/agent-context/`

The Obsidian Brain remains the broader long-term project memory, decision archive, roadmap, research
record, and evidence trail.

## Brain Path

```txt
/Users/luciaurcuyo/Library/CloudStorage/GoogleDrive-lurcuyop@gmail.com/Other computers/My Mac/Brain
```

Lulusweets project pages:

```txt
Projects/lulusweets/_overview.md
Projects/lulusweets/decisions.md
Projects/lulusweets/specs.md
Projects/lulusweets/technical.md
Projects/lulusweets/research.md
Projects/lulusweets/sources.md
```

## When To Update Brain

Update Brain when work changes:

- project phase or gate status,
- major decisions,
- architecture or data flow,
- build/test/deploy workflow,
- source content, recipe schema, or validation state,
- research findings or unresolved questions,
- evidence/source inventory,
- long-term project understanding.

Always add a root `log.md` entry for meaningful Lulusweets work:

```txt
## [YYYY-MM-DD] build | Lulusweets — <subject>
```

## Conflict Handling

If repo docs and Brain disagree:

1. Check dates and sources.
2. Prefer the newest verified project decision.
3. Do not guess when the conflict changes behavior, phase gates, or safety rules.
4. Record the conflict and resolution in both repo context and Brain if it matters long term.

## Current Brain Status

As of 2026-06-26, Brain already has a Lulusweets project with the standard six-page structure. The
Brain template is available at `Projects/_TEMPLATE/`. Preserve the existing Lulusweets structure.
