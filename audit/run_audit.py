#!/usr/bin/env python3
"""Phase 1 audit: parse source, compare against vault, generate manifest + gap report."""

import csv
import os
import re
from pathlib import Path

ROOT = Path("/Users/luciaurcuyo/Desktop/lulusweets")
SOURCE = ROOT / "Recipe.docx.md"
VAULT = ROOT / "generated_recipe_vault"
AUDIT = ROOT / "audit"
AUDIT.mkdir(exist_ok=True)

# ── 1. Parse source markdown into recipes ────────────────────────────────────

def parse_source(path):
    lines = path.read_text().splitlines()
    categories = []
    recipes = []
    current_cat = None
    current_recipe = None
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        cat_match = re.match(r'^#\s+\*?\*?([A-Za-z &/à-ÿ]+?)\*?\*?\s*(\{.*\})?\s*$', stripped)
        if cat_match and stripped.startswith('# ') and not stripped.startswith('## '):
            name = cat_match.group(1).strip()
            if name.lower() not in ('', 'recipes', 'table of content'):
                if current_recipe:
                    recipes.append(current_recipe)
                    current_recipe = None
                current_cat = name
                categories.append(name)
                i += 1
                continue

        recipe_match = re.match(r'^#{1,3}\s+\*?\*?([A-Za-z0-9 &/\'à-ÿ\-\(\)]+?)\*?\*?\s*(\{.*\})?\s*$', stripped)
        if recipe_match and stripped.startswith('## '):
            name = recipe_match.group(1).strip()
            if name and len(name) > 1:
                if current_recipe:
                    recipes.append(current_recipe)
                current_recipe = {
                    'title': name,
                    'category': current_cat or 'Unknown',
                    'source_line': i + 1,
                    'ingredient_tables': 0,
                    'ingredient_rows': 0,
                    'instruction_steps': 0,
                    'has_notes': False,
                    'has_recommendations': False,
                    'raw_lines': [],
                }
                i += 1
                continue

        if current_recipe:
            current_recipe['raw_lines'].append(stripped)
            if stripped.startswith('|') and '|' in stripped[1:]:
                cells = [c.strip() for c in stripped.split('|')[1:-1]]
                if cells and not all(c in ('', ':----', ':---:', '-----', '----- ') or re.match(r'^:?-+:?$', c) for c in cells):
                    if any(kw in cells[0].lower() for kw in ('ingredient', 'cake', 'custard', 'graham', 'crust', 'glaze', 'filling', 'frosting', 'meringue', 'ganache', 'caramel', 'topping')):
                        current_recipe['ingredient_tables'] += 1
                    else:
                        header_row = cells[0].lower()
                        if not any(kw in header_row for kw in ('flour', 'sugar', 'butter', 'egg', 'cream', 'salt', 'milk', 'vanilla', 'cocoa', 'oil', 'powder', 'soda', 'extract', 'water', 'vinegar', 'sour', 'champagne', 'baileys', 'dulce', 'clover', 'coconut', 'mango', 'peanut', 'lime', 'orange', 'pistach', 'pecan', 'almond', 'sprinkle', 'banana', 'matcha', 'chocolate', 'condensed', 'honey', 'oat', 'graham', 'gelatin', 'cornstarch', 'nutella', 'hazelnut', 'pumpkin', 'blueberry', 'cranberry', 'passion', 'balsamic', 'strawberry', 'apple', 'cinnamon', 'ginger', 'clove', 'nutmeg', 'rum', 'coffee', 'espresso', 'praline', 'caramel')):
                            pass
                        else:
                            current_recipe['ingredient_rows'] += 1
            match_step = re.match(r'^\d+\.', stripped)
            if match_step:
                current_recipe['instruction_steps'] += 1
            if 'note' in stripped.lower() and (stripped.startswith('**') or stripped.startswith('Note')):
                current_recipe['has_notes'] = True
            if 'recommend' in stripped.lower() or 'pair' in stripped.lower():
                current_recipe['has_recommendations'] = True

        i += 1

    if current_recipe:
        recipes.append(current_recipe)

    return categories, recipes


# ── 2. Parse vault files ─────────────────────────────────────────────────────

def parse_vault_file(path):
    text = path.read_text()
    lines = text.splitlines()
    has_frontmatter = lines[0].strip() == '---' if lines else False
    body_start = 0
    if has_frontmatter:
        for j, l in enumerate(lines[1:], 1):
            if l.strip() == '---':
                body_start = j + 1
                break

    body = '\n'.join(lines[body_start:])
    body_lines = lines[body_start:]

    ingredient_tables = 0
    ingredient_rows = 0
    instruction_steps = 0
    has_notes = False
    has_recommendations = False
    has_ingredients_heading = False
    has_instructions_heading = False
    wikilinks = re.findall(r'\[\[([^\]]+)\]\]', body)

    in_table = False
    for line in body_lines:
        s = line.strip()
        if s.lower().startswith('## ingredient'):
            has_ingredients_heading = True
        if s.lower().startswith('## instruction'):
            has_instructions_heading = True
        if s.startswith('|') and '|' in s[1:]:
            cells = [c.strip() for c in s.split('|')[1:-1]]
            if cells and not all(re.match(r'^:?-+:?$', c) or c == '' for c in cells):
                if any(kw in cells[0].lower() for kw in ('ingredient',)):
                    ingredient_tables += 1
                elif any(c for c in cells if c and not re.match(r'^:?-+:?$', c)):
                    ingredient_rows += 1
        match_step = re.match(r'^\d+\.', s)
        if match_step:
            instruction_steps += 1
        if 'note' in s.lower() and (s.startswith('##') or s.startswith('**Note')):
            has_notes = True
        if 'recommend' in s.lower() or 'pairing' in s.lower():
            has_recommendations = True

    body_text_len = len(body.strip())

    return {
        'has_frontmatter': has_frontmatter,
        'has_ingredients_heading': has_ingredients_heading,
        'has_instructions_heading': has_instructions_heading,
        'ingredient_tables': ingredient_tables,
        'ingredient_rows': ingredient_rows,
        'instruction_steps': instruction_steps,
        'has_notes': has_notes,
        'has_recommendations': has_recommendations,
        'wikilinks': wikilinks,
        'body_length': body_text_len,
    }


# ── 3. Category mapping ─────────────────────────────────────────────────────

SOURCE_TO_VAULT_CATEGORY = {
    'Cakes': 'Cakes',
    'Cupcakes': 'Cupcakes',
    'Buttercreams': 'Frostings',
    'Pies': 'Pies',
    'Sauces': 'Sauces',
    'Tarts': 'Tarts',
    'Dough': 'Doughs',
    'Cookies': 'Cookies',
    'Cookie Crusts': 'Cookie Crusts',
    'Cheesecake': 'Cheesecakes',
    'Blondies': 'Blondies',
    'Macarons': 'Macarons',
    'Eclairs': 'Eclairs',
    'Miscellaneous': 'Miscellaneous',
    'Healthy Recipes': 'Healthy Recipes',
}

TITLE_REMAP = {
    'Vanilla Buttercream': 'Vanilla Buttercream',
    'Vanilla American Buttercream': 'Vanilla Buttercream',
    'Baileys/Espresso Rum Buttercream': 'Baileys Espresso Rum Buttercream',
}


# ── 4. Run audit ─────────────────────────────────────────────────────────────

def find_vault_file(title, vault_cat):
    """Try to find a vault file matching a source recipe title."""
    candidates = []
    if vault_cat:
        cat_dir = VAULT / vault_cat
        if cat_dir.is_dir():
            for f in cat_dir.iterdir():
                if f.suffix == '.md':
                    candidates.append(f)
    for f in VAULT.rglob('*.md'):
        if f not in candidates and 'Index' not in f.stem and '_templates' not in str(f):
            candidates.append(f)

    mapped_title = TITLE_REMAP.get(title, title)
    for f in candidates:
        if f.stem.lower() == mapped_title.lower():
            return f
    for f in candidates:
        if f.stem.lower().replace('-', ' ') == mapped_title.lower().replace('-', ' '):
            return f
    for f in candidates:
        if mapped_title.lower() in f.stem.lower() or f.stem.lower() in mapped_title.lower():
            return f
    return None


def classify(src, vault_info):
    """Classify a recipe's vault status."""
    issues = []
    if vault_info is None:
        return 'missing', ['No vault file found']
    if vault_info['body_length'] < 20:
        return 'empty', ['Vault file has no meaningful content']

    if src['instruction_steps'] > 0 and vault_info['instruction_steps'] == 0:
        issues.append(f"Source has {src['instruction_steps']} instruction steps, vault has 0")
    elif src['instruction_steps'] > 0 and vault_info['instruction_steps'] < src['instruction_steps'] * 0.5:
        issues.append(f"Source has {src['instruction_steps']} steps, vault has {vault_info['instruction_steps']}")

    if src['ingredient_tables'] > 0 and vault_info['ingredient_tables'] == 0 and vault_info['ingredient_rows'] == 0:
        issues.append('Source has ingredient table(s) but vault has none')

    if not vault_info['has_ingredients_heading'] and src['ingredient_tables'] > 0:
        issues.append('Missing ## Ingredients heading')
    if not vault_info['has_instructions_heading'] and src['instruction_steps'] > 0:
        issues.append('Missing ## Instructions heading')

    if issues:
        return 'partial', issues
    return 'complete', []


def main():
    print("Parsing source...")
    categories, source_recipes = parse_source(SOURCE)
    print(f"  Found {len(categories)} categories, {len(source_recipes)} recipes in source")

    # Collect vault files
    vault_files = {}
    for f in VAULT.rglob('*.md'):
        if 'Index' not in f.stem and '_templates' not in str(f) and '.obsidian' not in str(f):
            rel = f.relative_to(VAULT)
            cat = rel.parts[0] if len(rel.parts) > 1 else 'root'
            vault_files[f.stem] = {'path': f, 'category': cat}

    print(f"  Found {len(vault_files)} recipe files in vault")

    # Audit each source recipe
    manifest_rows = []
    issues_by_recipe = {}
    matched_vault_files = set()

    for src in source_recipes:
        vault_cat = SOURCE_TO_VAULT_CATEGORY.get(src['category'], src['category'])
        vault_path = find_vault_file(src['title'], vault_cat)

        vault_info = None
        vault_rel = ''
        if vault_path:
            vault_info = parse_vault_file(vault_path)
            vault_rel = str(vault_path.relative_to(VAULT))
            matched_vault_files.add(vault_path.stem)

        status, issues = classify(src, vault_info)

        manifest_rows.append({
            'source_title': src['title'],
            'source_category': src['category'],
            'source_line': src['source_line'],
            'source_ingredient_tables': src['ingredient_tables'],
            'source_instruction_steps': src['instruction_steps'],
            'source_has_notes': src['has_notes'],
            'source_has_recommendations': src['has_recommendations'],
            'vault_file': vault_rel,
            'vault_category': vault_cat,
            'vault_ingredient_tables': vault_info['ingredient_tables'] if vault_info else '',
            'vault_ingredient_rows': vault_info['ingredient_rows'] if vault_info else '',
            'vault_instruction_steps': vault_info['instruction_steps'] if vault_info else '',
            'vault_body_length': vault_info['body_length'] if vault_info else '',
            'vault_wikilinks': len(vault_info['wikilinks']) if vault_info else '',
            'status': status,
            'issues': '; '.join(issues),
        })

        if issues:
            issues_by_recipe[src['title']] = {
                'category': src['category'],
                'status': status,
                'issues': issues,
                'source_line': src['source_line'],
                'vault_file': vault_rel,
            }

    # Find vault files with no source match
    unmatched_vault = []
    for stem, info in vault_files.items():
        if stem not in matched_vault_files:
            unmatched_vault.append({'title': stem, 'category': info['category'], 'path': str(info['path'].relative_to(VAULT))})

    # ── Write CSV manifest ────────────────────────────────────────────────
    csv_path = AUDIT / 'source-manifest.csv'
    fields = list(manifest_rows[0].keys()) if manifest_rows else []
    with open(csv_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(manifest_rows)
    print(f"\nWrote {csv_path} ({len(manifest_rows)} rows)")

    # ── Write gap report ──────────────────────────────────────────────────
    report_path = AUDIT / 'content-gap-report.md'
    counts = {'complete': 0, 'partial': 0, 'missing': 0, 'empty': 0}
    for row in manifest_rows:
        counts[row['status']] = counts.get(row['status'], 0) + 1

    with open(report_path, 'w') as f:
        f.write("# Lulusweets — Content Gap Report\n\n")
        f.write(f"Generated from Phase 1 audit.\n\n")
        f.write("## Summary\n\n")
        f.write(f"- **Source recipes parsed:** {len(source_recipes)}\n")
        f.write(f"- **Vault recipe files:** {len(vault_files)}\n")
        f.write(f"- **Source categories:** {', '.join(categories)}\n\n")
        f.write("| Status | Count |\n|--------|-------|\n")
        for s in ('complete', 'partial', 'empty', 'missing'):
            f.write(f"| {s.capitalize()} | {counts.get(s, 0)} |\n")
        f.write(f"\n## Images\n\n")
        img_dir = AUDIT / 'images'
        if img_dir.is_dir():
            imgs = sorted(img_dir.iterdir())
            f.write(f"- **{len(imgs)} images** extracted from the PDF source.\n")
            f.write("- Images need to be manually mapped to recipes (page numbers provide approximate association).\n\n")

        f.write("\n## Category Mapping\n\n")
        f.write("| Source Category | Vault Category | Notes |\n")
        f.write("|----------------|----------------|-------|\n")
        for src_cat, vault_cat in SOURCE_TO_VAULT_CATEGORY.items():
            note = ''
            if src_cat != vault_cat:
                note = 'Renamed'
            f.write(f"| {src_cat} | {vault_cat} | {note} |\n")

        if issues_by_recipe:
            f.write("\n## Recipes with Issues\n\n")
            for status in ('missing', 'empty', 'partial'):
                recs = [(t, info) for t, info in issues_by_recipe.items() if info['status'] == status]
                if recs:
                    f.write(f"\n### {status.capitalize()}\n\n")
                    for title, info in sorted(recs):
                        f.write(f"**{title}** ({info['category']}, line {info['source_line']})")
                        if info['vault_file']:
                            f.write(f" → `{info['vault_file']}`")
                        f.write("\n")
                        for issue in info['issues']:
                            f.write(f"  - {issue}\n")
                        f.write("\n")

        if unmatched_vault:
            f.write("\n## Vault Files Without Source Match\n\n")
            f.write("These vault files exist but were not matched to any source recipe:\n\n")
            for item in sorted(unmatched_vault, key=lambda x: x['path']):
                f.write(f"- `{item['path']}` ({item['title']})\n")

        f.write("\n## Known Structural Defects\n\n")
        f.write("### Champagne Buttercream / Dulce de Leche boundary\n")
        f.write("Source lines 931-956: Champagne Buttercream contains two ingredient tables.\n")
        f.write("The second table (lines 943-950) contains Dulce de Leche Buttercream's ingredients.\n")
        f.write("Dulce de Leche Buttercream heading (line 956) has no content — immediately followed by Coconut Buttercream.\n")
        f.write("**Action:** Split the second table into Dulce de Leche Buttercream's vault file.\n\n")

        f.write("### Healthy Recipes\n")
        f.write("Confirmed empty in the original source (line 2333). No content to recover.\n\n")

        f.write("### Conversion artifacts\n")
        f.write("- Malformed anchor IDs (e.g. `{#heading-1}`, `{#heading=h.wnyagw}`)\n")
        f.write("- Empty `##` headings used as separators\n")
        f.write("- Hard-wrapped instruction lines split across multiple lines\n")
        f.write("- Inconsistent heading levels (some recipes use `**Title**` without `##`)\n")

    print(f"Wrote {report_path}")

    # Print summary
    print(f"\n{'='*60}")
    print(f"AUDIT SUMMARY")
    print(f"{'='*60}")
    print(f"Source: {len(source_recipes)} recipes in {len(categories)} categories")
    print(f"Vault:  {len(vault_files)} recipe files")
    print(f"Complete: {counts.get('complete',0)}  Partial: {counts.get('partial',0)}  Empty: {counts.get('empty',0)}  Missing: {counts.get('missing',0)}")
    if unmatched_vault:
        print(f"Unmatched vault files: {len(unmatched_vault)}")
    print(f"\nIssues found in {len(issues_by_recipe)} recipes")


if __name__ == '__main__':
    main()
