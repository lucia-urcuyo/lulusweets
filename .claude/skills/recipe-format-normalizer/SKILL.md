---
name: recipe-format-normalizer
description: Rewrite pasted, dictated, OCR-extracted, or image-provided recipes into Lucia's simple, gram-normalized Lulusweets Markdown recipe format. Use when the user gives a recipe from text, notes, a website, screenshot, photo, or image and wants it cleaned up, shortened, normalized, or added to the Lulusweets cookbook.
---

# Recipe Format Normalizer

Turn messy recipe input into concise Lulusweets recipe Markdown.

## Output Format

```md
---
title: "Recipe Name"
category: "category"
---

## Ingredients

| Ingredients | Yield |
| :---- | :---: |
| Ingredient | Amount |

## Instructions

1. Short direct instruction.
2. Short direct instruction.

## Notes

- Optional note.
```

## Rules

- If the recipe is in an image, read the visible text first. Ask for a clearer image only if important
  amounts, times, or temperatures are unreadable.
- Remove ads, links, affiliate text, shopping/tool recommendations, SEO prose, duplicate wording, and
  long explanations.
- Keep title, yield, ingredients, amounts, temperatures, bake/chill/rest times, doneness cues, optional
  ingredients, and important texture notes.
- Use lowercase category frontmatter, such as `cookies`, `cakes`, `cupcakes`, `sauces`, `tarts`,
  `american buttercreams`, or `buttercream variations`.
- Convert ingredient amounts to grams by default, regardless of whether the source uses cups, ounces,
  tablespoons, teaspoons, milliliters, or mixed units.
- Use source-provided gram amounts first. If the source only gives volume or imperial units, convert
  with standard baking weights or the closest matching ingredient style already used in the
  Lulusweets vault.
- Write gram amounts as plain numbers in the ingredient table, matching existing recipes. Add `(g)` to
  the yield column only when it helps clarify the table.
- Keep count-based ingredients as counts when they are meant to stay whole, such as whole eggs, egg
  yolks, vanilla beans, whole fruit, or gelatin sheets. If an existing recipe style or source gives egg
  whites/yolks by weight, keep grams.
- Do not invent gram amounts for vague items like `to taste`, `as needed`, or an unspecified garnish;
  keep the original wording and add a brief note if needed.
- Mark optional ingredients in the ingredient name, e.g. `Ground Clove, optional`.
- Keep instructions direct and short enough to scan while baking.
- Put useful variations or timing notes in `## Notes`.
- Do not invent missing amounts, bake times, or temperatures.

## Compression Style

Verbose:

```txt
Combine butter with both sugars in a large mixing bowl and mix on medium speed for about 2 minutes
until smooth, creamy and a bit fluffy.
```

Lulusweets:

```md
1. Cream butter and sugars until smooth and fluffy.
```

Verbose:

```txt
Use a cookie scoop to portion dough and roll into smooth balls, then roll in granulated sugar.
```

Lulusweets:

```md
8. Scoop dough balls and roll each one in granulated sugar.
```

## When Adding To This Project

1. Add the recipe under `generated_recipe_vault/<Category>/`.
2. Update `generated_recipe_vault/Indexes/<Category> Index.md`.
3. Update `generated_recipe_vault/Home.md` counts and links.
4. Update recipe-count expectations in tests when the count changes.
5. Run `npm run check`; run `npm run smoke` when homepage/search counts changed.
