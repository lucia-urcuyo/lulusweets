# Vault Review Checklist

**Generated:** 2026-06-20
**Vault:** generated_recipe_vault/
**Status:** 98 recipes, 14 categories, 0 broken wikilinks, 0 validation issues

## Fixes Applied Since Phase 1

### Ingredient Displacement Fixes (from source conversion)
- [x] **Cupcakes (11 files):** Corrected ingredient tables for Vanilla, Chocolate, Yellow, Funfetti, Red Velvet, Banana, Matcha, Baileys Espresso Rum, Orange, Lime. Removed orphan table from Almond.
- [x] **Pies (3 files):** Corrected Pumpkin Pie, Pecan Praline Topping, Streusel Topping ingredient assignments.
- [x] **Frostings (2 files):** Split Dulce de Leche ingredients out of Champagne Buttercream into its own file.
- [x] **Sauces (2 files):** Added missing Pastry Cream ingredient table. Added shared instructions to Chocolate Ganache.
- [x] **Cheesecakes (1 file):** Added missing New York Style Cheesecake ingredient table.

### Structural Cleanup
- [x] Removed empty `recommended_pairings: []` from all 98 files
- [x] Simplified recipe template
- [x] Regenerated all 14 category index files
- [x] Created Home.md vault home page
- [x] Validated all 169+ wikilinks (0 broken)

## For Lucia to Review

### Content Accuracy (spot-check these)
- [ ] Vanilla Cupcakes — ingredients match your recipe
- [ ] Chocolate Cupcakes — ingredients match your recipe
- [ ] Matcha Cupcakes — ingredients match your recipe
- [ ] New York Style Cheesecake — ingredients: Cream Cheese 407.75, Heavy Cream 113, Sugar 156.75, Eggs 113 (2), Sour Cream 14.25, Half and Half 28.25, Vanilla 3.75
- [ ] Pastry Cream — ingredients: Heavy Cream 500, Egg Yolks 80, Corn Starch 20, Sugar 65, Vanilla 6, Butter 85, Salt 3
- [ ] Dulce de Leche Buttercream — ingredients correct and separate from Champagne Buttercream
- [ ] Pecan Praline Topping — Chopped Pecans 130, Brown Sugar 100, Honey 30
- [ ] Streusel Topping — Bread Flour 240, Cinnamon 1, Salt 3, Brown Sugar 84, Granulated Sugar 84, Cold Butter 180

### Structural Patterns (these are intentional, not bugs)
- [ ] 14 buttercream variants have **ingredients only** (no instructions) — they share Vanilla Buttercream's technique
- [ ] 13 assembly recipes have **instructions only** (no ingredients) — they reference components via [[wikilinks]]
- [ ] 2 macaron shell variants (Chocolate, Matcha) have **ingredients only** — they share Macaron Shells technique
- [ ] Caramel Sauce has **ingredients only** — no instructions in source document

### Decisions Needed
- [ ] **Tags:** Should recipes get tags? (e.g., `chocolate`, `fruit`, `nut`, `seasonal`)
- [ ] **Cake/Cupcake → Frosting pairings:** Which cakes pair with which frostings? (Not in source document — needs your knowledge)
- [ ] **Title field:** Add explicit `title` to frontmatter, or derive from filename?
- [ ] **Image mapping:** 49 images extracted from source — which recipe does each belong to?
- [ ] **Graham Cracker Crust instructions:** Steps are numbered 2-6 (no step 1 in source). Is step 1 "Preheat oven"?

### Open from Phase 1
- [ ] Healthy Recipes category — confirmed empty, no content to recover
