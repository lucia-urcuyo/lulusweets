# Lulusweets — Content Gap Report (Phase 1)

## Summary

| Metric | Count |
|--------|-------|
| Source recipes parsed | 96 (+ 2 missed by parser due to heading format) |
| Vault recipe files | 98 |
| Images extracted from PDF | 49 |
| Source categories | 15 (including empty Healthy Recipes) |

| Status | Count | Notes |
|--------|-------|-------|
| Complete | ~73 | Content and structure match source |
| Structural issues (heading/order) | ~20 | Content present but headings missing or sections reordered |
| Content misassignment | ~7 | Ingredient table belongs to wrong recipe |
| Empty vault file | 1 | Dulce de Leche Buttercream |
| Name mismatch only | 3 | Vault files exist but slash/accent mismatch prevents matching |

## CRITICAL: Cupcake Ingredient Tables Are Misaligned

The most serious finding. In the cupcakes section of the source document, ingredient tables
are **systematically displaced** from their correct recipes. The vault inherited this defect.

### Evidence

| Recipe (instructions match) | Ingredient table actually contains | Correct recipe for that table |
|-|-|-|
| Vanilla Cupcakes (line 439) | Cocoa Powder, Buttermilk, Hot Water | **Chocolate Cupcakes** |
| Chocolate Cupcakes (line 463) | Butter, Egg Yolk, Sour Cream, Milk | **Vanilla Cupcakes** |
| Yellow Cupcakes (line 489) | Almond Extract, Sprinkles | **Funfetti Cupcakes** |
| Funfetti Cupcakes (line 514) | Cocoa Powder, Vinegar, Hot Water | **Red Velvet Cupcakes** |
| Red Velvet Cupcakes (line 549) | Mashed Ripe Bananas | **Banana Cupcakes** |
| Banana Cupcakes (line 574) | Matcha | **Matcha Cupcakes** |
| Matcha Cupcakes (line 598) | *(no table)* | — |

The following cupcakes have correctly matched ingredients:
- Coconut Cupcakes (line 609) ✓
- Mango Cupcakes (line 636) ✓
- Almond Cupcakes (line 663) ✓

The following cupcakes have orphan ingredient tables that appear **before** their heading:
- Chocolate Baileys Espresso Rum Cupcakes — table at line 692 (after Almond instructions)
- Orange Cupcakes — table at line 723 (after Baileys instructions)
- Lime Cupcakes — table at line 752 (after Orange instructions)

**Action required:** Lucia must verify the correct ingredient-to-recipe mapping against the
original Google Doc. The vault files need their ingredient tables reassigned.

## Champagne Buttercream / Dulce de Leche Boundary Defect

Source lines 931–956: Champagne Buttercream contains **two** ingredient tables.
- Table 1 (lines 933–941): Champagne Buttercream's own ingredients ✓
- Table 2 (lines 943–950): Contains "Dulce de Leche" as an ingredient — belongs to **Dulce de Leche Buttercream**

Dulce de Leche Buttercream (line 956) has only a heading — no ingredients or instructions.
The vault file `Frostings/Dulce de Leche Buttercream.md` is empty (frontmatter only).
The vault file `Frostings/Champagne Buttercream.md` has both tables.

**Action:** Move the second ingredient table from Champagne Buttercream into Dulce de Leche
Buttercream's vault file. Neither recipe has instructions in the source — confirm with Lucia
whether buttercream instructions are the same as the standard American Buttercream method.

## Name Mismatches (Not Missing)

These 3 recipes were flagged as "missing" but exist in the vault under slightly different names:

| Source title | Vault filename | Issue |
|-|-|-|
| Chocolate Baileys/Espresso Rum Cake | Chocolate Baileys Espresso Rum Cake.md | Slash → space |
| Chocolate Baileys/Espresso Rum Cupcakes | Chocolate Baileys Espresso Rum Cupcakes.md | Slash → space |
| Chocolate Baileys/Espresso Rum Ganache | Chocolate Baileys Espresso Rum Ganache.md | Slash → space |

These 2 source recipes weren't detected by the parser because their headings use `**Title**`
without `##`:

| Source title | Source line | Vault file |
|-|-|-|
| Funfetti Cake | 104 | Cakes/Funfetti Cake.md ✓ |
| Crème Brûlée Cake | 222 | Cakes/Crème Brûlée Cake.md ✓ |

**No recipes are actually missing from the vault.**

## Step-Count Discrepancies

The apparent step-count issues (Almond Cake "26 vs 10", Chocolate Cake "19 vs 9") are
artifacts of the parser failing to detect recipe boundaries at non-standard headings
(`**Title**` without `##`). Crème Brûlée Cake's 18 instruction steps got counted as part of
Almond Cake. The vault files have the correct step counts.

## Cupcakes Missing `## Ingredients` Heading

These vault files have ingredient tables but lack the `## Ingredients` section heading, making
them structurally inconsistent with other recipes. Many also have instructions BEFORE the
ingredient table (reversed from the standard order):

- Vanilla Cupcakes, Chocolate Cupcakes, Yellow Cupcakes, Funfetti Cupcakes,
  Red Velvet Cupcakes, Banana Cupcakes, Orange Cupcakes, Pastry Cream, Pecan Praline Topping

**Action:** Add `## Ingredients` headings and normalize section order after the content
misassignment is resolved.

## Missing `## Instructions` Heading

- Oat and Pecan Brittle Cookies — uses subsection headings (`### For the Pecan Brittle`,
  `### For the Cookies`) instead of a top-level `## Instructions`

## Healthy Recipes

**Confirmed empty** in the original source document (line 2333 — heading only, no content).
No content to recover. The empty `Healthy Recipes/` folder in the vault is correct.

## Category Mapping

| Source Category | Vault Category | Status |
|----------------|----------------|--------|
| Cakes | Cakes | ✓ |
| Cupcakes | Cupcakes | ✓ |
| Buttercreams | Frostings | Renamed ✓ |
| Pies | Pies | ✓ |
| Sauces | Sauces | ✓ |
| Tarts | Tarts | ✓ |
| Dough | Doughs | Renamed ✓ |
| Cookies | Cookies | ✓ |
| Cookie Crusts | Cookie Crusts | ✓ |
| Cheesecake | Cheesecakes | Renamed ✓ |
| Blondies | Blondies | ✓ |
| Macarons | Macarons | ✓ |
| Eclairs | Eclairs | ✓ |
| Miscellaneous | Miscellaneous | ✓ |
| Healthy Recipes | Healthy Recipes | Empty ✓ |

## Images

49 images extracted from the PDF to `audit/images/`. Images span 34 pages and include recipe
photos, diagrams, and decorative images. They need to be:

1. Manually identified and named by recipe
2. Mapped to vault files
3. Added to the canonical vault with a consistent naming convention

Page numbers provide approximate recipe association but need manual verification.

## Conversion Artifacts in Source

These are present in `Recipe.docx.md` and were inherited by the vault:

- Malformed anchor IDs (`{#heading-1}`, `{#heading=h.wnyagw}`)
- Empty `##` headings used as section separators
- Hard-wrapped instruction lines split across paragraphs
- Inconsistent heading levels (`**Title**` without `##` prefix)
- Instructions/ingredients order varies by section (cakes: ingredients first; some cupcakes:
  instructions first)

## Decisions Needed From Lucia

1. **Cupcake ingredient verification:** Confirm the correct ingredient-to-recipe mapping
   against the original Google Doc. The table above shows the suspected correct mapping based
   on ingredient analysis.
2. **Dulce de Leche Buttercream:** Confirm the second table in Champagne Buttercream belongs
   to Dulce de Leche. Are instructions needed, or do all buttercreams follow the same method?
3. **Yellow Cupcakes identity:** Yellow Cupcakes and Vanilla Cupcakes have very similar
   instructions. Confirm these are distinct recipes with different ingredient tables.
4. **Matcha Cupcakes ingredients:** Matcha Cupcakes has instructions but no ingredient table
   in the source (its table ended up under Banana Cupcakes). The table that was displaced
   includes: Cake Flour 135, Sugar 150, Baking Powder 6, Baking Soda 3, Salt 2, Whole Milk
   123, Vegetable Oil 112, Vanilla Extract 4, Eggs 114, Matcha 9. Confirm this is correct.
5. **Image mapping:** Which of the 49 extracted images belong to which recipes?
