import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const required = [
  "index.html",
  "app.js",
  "styles.css",
  "manifest.webmanifest",
  "sw.js",
  "icon.svg",
  "data/recipes.json"
];

for (const file of required) await access(path.join(dist, file));

const payload = JSON.parse(await readFile(path.join(dist, "data", "recipes.json"), "utf8"));
const slugs = new Set();
const titles = new Set();
const problems = [];

if (payload.recipeCount !== 99) {
  problems.push(`Expected 99 recipes, found ${payload.recipeCount}.`);
}
if (!payload.categories.length) problems.push("No categories generated.");

for (const recipe of payload.recipes) {
  if (!recipe.title || !recipe.slug || !recipe.category || !recipe.html) {
    problems.push(`Recipe missing required output fields: ${recipe.sourcePath}`);
  }
  if (slugs.has(recipe.slug)) problems.push(`Duplicate slug: ${recipe.slug}`);
  if (titles.has(recipe.title.toLowerCase())) problems.push(`Duplicate title: ${recipe.title}`);
  slugs.add(recipe.slug);
  titles.add(recipe.title.toLowerCase());

  if (recipe.html.includes("[[")) problems.push(`Unrendered wikilink in ${recipe.title}`);
  for (const related of recipe.related) {
    if (!payload.recipes.some((candidate) => candidate.slug === related.slug)) {
      problems.push(`Broken relationship: ${recipe.title} -> ${related.title}`);
    }
  }
}

const searchCases = [
  ["chocolate", (recipe) => recipe.searchText.includes("chocolate")],
  ["cream cheese", (recipe) => recipe.searchText.includes("cream cheese")],
  ["macaron", (recipe) => recipe.searchText.includes("macaron")],
  ["pecan", (recipe) => recipe.searchText.includes("pecan")]
];
for (const [query, predicate] of searchCases) {
  if (!payload.recipes.some(predicate)) problems.push(`Search fixture has no match for "${query}".`);
}

if (problems.length) {
  console.error(problems.map((problem) => `- ${problem}`).join("\n"));
  process.exit(1);
}

const unresolvedCount = payload.recipes.reduce(
  (total, recipe) => total + recipe.unresolvedLinks.length,
  0
);
console.log(
  `Validated ${payload.recipeCount} recipes, ${payload.categories.length} categories, ` +
    `${payload.recipes.reduce((total, recipe) => total + recipe.related.length, 0)} relationships, ` +
    `${unresolvedCount} unresolved source links.`
);
