import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const recipeRoot = path.join(root, "generated_recipe_vault");
const siteRoot = path.join(root, "site");
const distRoot = path.join(root, "dist");

const categoryOrder = [
  "Cakes",
  "Cupcakes",
  "Frostings",
  "Sauces",
  "Doughs",
  "Cookies",
  "Cookie Crusts",
  "Cheesecakes",
  "Pies",
  "Tarts",
  "Blondies",
  "Macarons",
  "Eclairs",
  "Healthy Recipes",
  "Miscellaneous"
];

const escapeHtml = (value = "") =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const slugify = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const stripMarkdown = (value = "") =>
  value
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, alias) => alias || target)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\\([\\*_.-])/g, "$1")
    .trim();

function parseFrontmatter(source) {
  if (!source.startsWith("---\n")) return { data: {}, body: source };
  const end = source.indexOf("\n---\n", 4);
  if (end < 0) return { data: {}, body: source };
  const raw = source.slice(4, end);
  const data = {};

  for (const line of raw.split("\n")) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    const value = rawValue.trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1).trim();
      data[key] = inner
        ? inner.split(",").map((part) => part.trim().replace(/^["']|["']$/g, ""))
        : [];
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }

  return { data, body: source.slice(end + 5).trim() };
}

async function collectMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const output = [];

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "Indexes" || entry.name === "_templates" || entry.name === ".obsidian") continue;
      output.push(...(await collectMarkdownFiles(absolute)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      if (path.resolve(directory) === path.resolve(recipeRoot) && entry.name === "Home.md") continue;
      output.push(absolute);
    }
  }

  return output;
}

function tokenizeInline(source, slugByTitle) {
  const tokens = [];
  let value = source.replace(/\\([\\*_.-])/g, "$1");
  const preserve = (html) => {
    const index = tokens.push(html) - 1;
    return `\u0000${index}\u0000`;
  };

  value = value.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, rawTarget, alias) => {
    const target = rawTarget.trim();
    const label = (alias || target).trim();
    const slug = slugByTitle.get(target.toLowerCase());
    if (!slug) return preserve(`<span class="missing-link">${escapeHtml(label)}</span>`);
    return preserve(
      `<a class="recipe-link" href="#/recipe/${encodeURIComponent(slug)}">${escapeHtml(label)}</a>`
    );
  });

  value = value.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, (_, label, url) =>
    preserve(
      `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`
    )
  );

  value = escapeHtml(value);
  value = value
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");

  return value.replace(/\u0000(\d+)\u0000/g, (_, index) => tokens[Number(index)]);
}

function isTableLine(line) {
  return /^\s*\|.*\|\s*$/.test(line);
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isAlignmentRow(cells) {
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell) || /^-+$/.test(cell));
}

function renderMarkdown(markdown, slugByTitle) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const output = [];
  let paragraph = [];
  let listType = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    output.push(`<p>${tokenizeInline(paragraph.join(" ").trim(), slugByTitle)}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    output.push(`</${listType}>`);
    listType = null;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      closeList();
      continue;
    }

    const heading = trimmed.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = Math.min(4, heading[1].length);
      const text = heading[2].replace(/\s+\{#[^}]+\}\s*$/, "");
      output.push(`<h${level}>${tokenizeInline(text, slugByTitle)}</h${level}>`);
      continue;
    }

    if (isTableLine(line)) {
      flushParagraph();
      closeList();
      const rows = [];
      while (index < lines.length && isTableLine(lines[index])) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }
      index -= 1;
      const cleaned = rows.filter((row) => !isAlignmentRow(row));
      if (!cleaned.length) continue;
      const [header, ...body] = cleaned;
      output.push('<div class="table-scroll"><table>');
      output.push(
        `<thead><tr>${header.map((cell) => `<th>${tokenizeInline(cell, slugByTitle)}</th>`).join("")}</tr></thead>`
      );
      if (body.length) {
        output.push("<tbody>");
        for (const row of body) {
          output.push(
            `<tr>${row.map((cell) => `<td>${tokenizeInline(cell, slugByTitle)}</td>`).join("")}</tr>`
          );
        }
        output.push("</tbody>");
      }
      output.push("</table></div>");
      continue;
    }

    const ordered = trimmed.match(/^(\d+)\\?[.)]\s+(.+)$/);
    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    if (ordered || unordered) {
      flushParagraph();
      const nextType = ordered ? "ol" : "ul";
      if (listType !== nextType) {
        closeList();
        output.push(`<${nextType}>`);
        listType = nextType;
      }
      const content = ordered ? ordered[2] : unordered[1];
      const valueAttribute = ordered ? ` value="${ordered[1]}"` : "";
      output.push(`<li${valueAttribute}>${tokenizeInline(content, slugByTitle)}</li>`);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  closeList();
  return output.join("\n");
}

function extractRelationships(body) {
  const found = new Set();
  for (const match of body.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) {
    if (!match[1].endsWith(" Index")) found.add(match[1].trim());
  }
  return [...found];
}

function extractIngredients(body) {
  const ingredients = new Set();
  const lines = body.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    if (!isTableLine(lines[index])) continue;
    const rows = [];
    while (index < lines.length && isTableLine(lines[index])) {
      rows.push(parseTableRow(lines[index]));
      index += 1;
    }
    index -= 1;
    for (const row of rows.slice(1)) {
      if (isAlignmentRow(row) || !row[0]) continue;
      const name = stripMarkdown(row[0]);
      if (
        name &&
        !/^(ingredients?|cake|custard|filling|crust|topping|buttercream|glaze)$/i.test(name)
      ) {
        ingredients.add(name);
      }
    }
  }
  return [...ingredients];
}

function plainText(body) {
  return stripMarkdown(
    body
      .replace(/^---[\s\S]*?---/m, "")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^\|?\s*:?-{3,}.*$/gm, "")
      .replace(/\|/g, " ")
      .replace(/\s+/g, " ")
  );
}

const files = await collectMarkdownFiles(recipeRoot);
const rawRecipes = [];

for (const file of files) {
  const source = await readFile(file, "utf8");
  const { data, body } = parseFrontmatter(source);
  const title = path.basename(file, ".md");
  const categoryFolder = path.basename(path.dirname(file));
  const category =
    categoryOrder.find((item) => item.toLowerCase() === String(data.category || "").toLowerCase()) ||
    categoryFolder;

  rawRecipes.push({
    title,
    slug: slugify(title),
    category,
    categorySlug: slugify(category),
    tags: Array.isArray(data.tags) ? data.tags : [],
    body,
    sourcePath: path.relative(root, file)
  });
}

rawRecipes.sort((a, b) => a.title.localeCompare(b.title));
const duplicateSlugs = rawRecipes
  .map((recipe) => recipe.slug)
  .filter((slug, index, all) => all.indexOf(slug) !== index);
if (duplicateSlugs.length) {
  throw new Error(`Duplicate recipe slugs: ${[...new Set(duplicateSlugs)].join(", ")}`);
}

const slugByTitle = new Map(rawRecipes.map((recipe) => [recipe.title.toLowerCase(), recipe.slug]));
const recipeByTitle = new Map(rawRecipes.map((recipe) => [recipe.title.toLowerCase(), recipe]));

const recipes = rawRecipes.map((recipe) => {
  const relationshipTitles = extractRelationships(recipe.body);
  const related = relationshipTitles
    .map((title) => recipeByTitle.get(title.toLowerCase()))
    .filter(Boolean)
    .map(({ title, slug, category }) => ({ title, slug, category }));
  const unresolvedLinks = relationshipTitles.filter(
    (title) => !recipeByTitle.has(title.toLowerCase())
  );
  const ingredients = extractIngredients(recipe.body);
  const text = plainText(recipe.body);

  return {
    title: recipe.title,
    slug: recipe.slug,
    category: recipe.category,
    categorySlug: recipe.categorySlug,
    tags: recipe.tags,
    ingredients,
    related,
    unresolvedLinks,
    usedBy: [],
    html: renderMarkdown(recipe.body, slugByTitle),
    searchText: [recipe.title, recipe.category, ingredients.join(" "), relationshipTitles.join(" "), text]
      .join(" ")
      .toLowerCase(),
    excerpt: text.slice(0, 220),
    sourcePath: recipe.sourcePath
  };
});

const recipeBySlug = new Map(recipes.map((recipe) => [recipe.slug, recipe]));
for (const recipe of recipes) {
  for (const related of recipe.related) {
    const target = recipeBySlug.get(related.slug);
    if (target) {
      target.usedBy.push({
        title: recipe.title,
        slug: recipe.slug,
        category: recipe.category
      });
    }
  }
}
for (const recipe of recipes) {
  recipe.usedBy.sort((a, b) => a.title.localeCompare(b.title));
}

const categories = categoryOrder
  .map((name) => ({
    name,
    slug: slugify(name),
    count: recipes.filter((recipe) => recipe.category === name).length
  }))
  .filter((category) => category.count > 0);

const payload = {
  generatedAt: new Date().toISOString(),
  recipeCount: recipes.length,
  categories,
  recipes
};

const serialized = JSON.stringify(payload);
const version = createHash("sha256").update(serialized).digest("hex").slice(0, 12);
payload.version = version;

await rm(distRoot, { recursive: true, force: true });
await mkdir(path.join(distRoot, "data"), { recursive: true });
await cp(siteRoot, distRoot, { recursive: true });
await writeFile(
  path.join(distRoot, "data", "recipes.json"),
  `${JSON.stringify(payload)}\n`,
  "utf8"
);

const serviceWorkerPath = path.join(distRoot, "sw.js");
const serviceWorker = await readFile(serviceWorkerPath, "utf8");
await writeFile(
  serviceWorkerPath,
  serviceWorker.replaceAll("__BUILD_VERSION__", version),
  "utf8"
);

console.log(`Built Lulusweets ${version}: ${recipes.length} recipes across ${categories.length} categories.`);
