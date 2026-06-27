# Lulusweets Project Overview

## What This Project Is

Lulusweets is a portable recipe system with two layers:

1. A canonical Markdown/Obsidian recipe vault.
2. A generated, searchable, installable static PWA for everyday recipe browsing.

The product goal is to move a cookbook out of a monolithic Google Doc/PDF workflow into clean,
portable Markdown while preserving every recipe, table, note, pairing, relationship, and recoverable
image.

## What This Repo Is For

This repo contains the working implementation artifacts for Lulusweets:

- `generated_recipe_vault/` - canonical local Obsidian/Markdown recipe vault.
- `audit/` - source inventory, validation evidence, image mapping, and review artifacts.
- `scripts/` - Node scripts for building, serving, validating, and smoke-testing the generated PWA.
- `site/` - static PWA source files.
- `dist/` - generated output; disposable and not edited by hand.
- `docs/agent-context/` - coding-agent project context and operating memory.

## Key Terms

- **Source layer** - canonical recipe Markdown and assets.
- **Browsing layer** - generated static PWA derived from the source layer.
- **Canonical vault** - `generated_recipe_vault/`.
- **Recipe manifest** - audit mapping from source recipe/asset to generated output.
- **Pairing** - relationship between recipes, such as cake and frosting.
- **Brain** - Obsidian long-term project memory outside the repo.

## High-Level Architecture

```txt
Original cookbook source / PDF
        |
        v
audit manifest + image mapping
        |
        v
generated_recipe_vault/ Markdown
        |
        v
scripts/build.mjs
        |
        v
dist/ static PWA
```

The generated website must be reproducible from the canonical Markdown vault. Do not make the PWA a
second manually edited source of truth.

## Project Philosophy

- Preserve recipe content before improving presentation.
- Keep Markdown portable and human-editable.
- Use Obsidian for editing and relationships, not as the primary everyday browsing UI.
- Use a static PWA for fast search, mobile access, and offline use.
- Follow the gated phase sequence; do not skip design approval or validation gates.

## What Not To Assume

- Do not assume the current PWA design is final.
- Do not assume generated files in `dist/` should be edited.
- Do not assume a same-name recipe can be renamed or moved without checking links/search/build output.
- Do not assume iCloud sync is viable for the vault; it was abandoned because of macOS File Provider
  limitations.
- Do not assume Brain is obsolete. Repo docs are the first coding-agent entry point; Brain remains the
  broader long-term project record.
