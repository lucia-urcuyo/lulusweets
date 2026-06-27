const main = document.querySelector("#main");
const installButton = document.querySelector("#install-button");
const headerSearchButton = document.querySelector("#header-search-button");
const toast = document.querySelector("#toast");

const state = {
  data: null,
  query: "",
  category: "all",
  installPrompt: null
};

const categoryDetails = {
  cakes: { label: "Cakes", tone: "rose" },
  cupcakes: { label: "Cupcakes", tone: "peach" },
  "american-buttercreams": { label: "American Buttercreams", tone: "plum" },
  "buttercream-variations": { label: "Buttercream Variations", tone: "vanilla" },
  sauces: { label: "Sauces", tone: "amber" },
  doughs: { label: "Doughs", tone: "wheat" },
  cookies: { label: "Cookies", tone: "cocoa" },
  "cookie-crusts": { label: "Cookie Crusts", tone: "cocoa" },
  cheesecakes: { label: "Cheesecakes", tone: "vanilla" },
  pies: { label: "Pies", tone: "berry" },
  tarts: { label: "Tarts", tone: "fig" },
  blondies: { label: "Blondies", tone: "honey" },
  macarons: { label: "Macarons", tone: "lilac" },
  eclairs: { label: "Éclairs", tone: "coffee" },
  "healthy-recipes": { label: "Healthy Recipes", tone: "sage" },
  miscellaneous: { label: "Miscellaneous", tone: "slate" }
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const normalize = (value = "") =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const categoryInfo = (slug, name = "") =>
  categoryDetails[slug] || {
    label: name,
    tone: "slate"
  };

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function route() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [section, encodedValue] = raw.split("/");
  return {
    section: section || "home",
    value: encodedValue ? decodeURIComponent(encodedValue) : ""
  };
}

function icon(name) {
  const paths = {
    search:
      '<circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path>',
    arrow: '<path d="m5 12 14 0"></path><path d="m13 6 6 6-6 6"></path>',
    back: '<path d="m19 12-14 0"></path><path d="m11 18-6-6 6-6"></path>',
    close: '<path d="m6 6 12 12M18 6 6 18"></path>',
    book:
      '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"></path><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z"></path>',
    link: '<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"></path><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"></path>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ""}</svg>`;
}

function scoreRecipe(recipe, terms) {
  if (!terms.length) return 1;
  const title = normalize(recipe.title);
  const category = normalize(recipe.category);
  const ingredients = normalize(recipe.ingredients.join(" "));
  const relationships = normalize(
    [...recipe.related, ...recipe.usedBy].map((item) => item.title).join(" ")
  );
  const body = normalize(recipe.searchText);
  let score = 0;

  for (const term of terms) {
    if (!body.includes(term)) return 0;
    if (title === term) score += 160;
    else if (title.startsWith(term)) score += 110;
    else if (title.includes(term)) score += 85;
    if (category.includes(term)) score += 38;
    if (ingredients.includes(term)) score += 34;
    if (relationships.includes(term)) score += 30;
    score += 8;
  }
  return score;
}

function getResults() {
  const terms = normalize(state.query)
    .split(/\s+/)
    .filter(Boolean);

  return state.data.recipes
    .filter((recipe) => state.category === "all" || recipe.categorySlug === state.category)
    .map((recipe) => ({ recipe, score: scoreRecipe(recipe, terms) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.recipe.title.localeCompare(b.recipe.title))
    .map(({ recipe }) => recipe);
}

function matchDetails(recipe) {
  const terms = normalize(state.query)
    .split(/\s+/)
    .filter(Boolean);
  if (!terms.length) {
    if (recipe.ingredients.length) {
      return { label: "Key ingredients", text: recipe.ingredients.slice(0, 3).join(" · ") };
    }
    if (recipe.related.length) {
      return { label: "Uses", text: recipe.related.slice(0, 2).map((item) => item.title).join(" · ") };
    }
    return { label: "Preview", text: recipe.excerpt };
  }

  const matchingIngredients = recipe.ingredients.filter((ingredient) =>
    terms.some((term) => normalize(ingredient).includes(term))
  );
  if (matchingIngredients.length) {
    return { label: "Matched ingredients", text: matchingIngredients.slice(0, 3).join(" · ") };
  }

  const matchingLinks = [...recipe.related, ...recipe.usedBy].filter((item) =>
    terms.some((term) => normalize(item.title).includes(term))
  );
  if (matchingLinks.length) {
    return { label: "Matched related", text: matchingLinks.slice(0, 3).map((item) => item.title).join(" · ") };
  }

  if (terms.some((term) => normalize(recipe.title).includes(term))) {
    return { label: "Title match", text: recipe.excerpt };
  }

  return { label: "Preview", text: recipe.excerpt };
}

function recipeCard(recipe) {
  const detail = categoryInfo(recipe.categorySlug, recipe.category);
  const context = matchDetails(recipe);
  const metadata = recipe.ingredients.length
    ? `${recipe.ingredients.length} ingredients`
    : recipe.related.length
      ? `${recipe.related.length} components`
      : "Recipe";

  return `
    <a class="recipe-card" href="#/recipe/${encodeURIComponent(recipe.slug)}">
      <span class="recipe-card-accent tone-${detail.tone}" aria-hidden="true"></span>
      <div class="recipe-card-body">
        <span class="recipe-card-head">
          <span class="recipe-card-kicker">
            <span class="recipe-category">${escapeHtml(recipe.category)}</span>
            <small>${metadata}</small>
          </span>
        </span>
        <h3>${escapeHtml(recipe.title)}</h3>
        <p class="recipe-card-context">
          <span>${escapeHtml(context.label)}</span>
          ${escapeHtml(context.text)}
        </p>
      </div>
      <span class="recipe-card-arrow" aria-hidden="true">${icon("arrow")}</span>
    </a>
  `;
}

function categoryCard(category) {
  const detail = categoryInfo(category.slug, category.name);
  return `
    <button class="category-card tone-${detail.tone}" type="button" data-category="${category.slug}">
      <span class="category-card-copy">
        <strong>${escapeHtml(detail.label)}</strong>
        <small>${category.count} ${category.count === 1 ? "recipe" : "recipes"}</small>
      </span>
      <span class="category-arrow" aria-hidden="true">${icon("arrow")}</span>
    </button>
  `;
}

function updateResults() {
  const results = getResults();
  const heading = document.querySelector("#results-heading");
  const count = document.querySelector("#results-count");
  const grid = document.querySelector("#recipe-grid");
  const empty = document.querySelector("#empty-state");
  const clearButton = document.querySelector("#clear-search");
  const activeSearchBar = document.querySelector("#active-search-bar");
  const activeSearchText = document.querySelector("#active-search-text");

  if (!grid) return;
  const hasFilter = Boolean(state.query.trim()) || state.category !== "all";
  const activeCategory = state.data.categories.find((category) => category.slug === state.category);
  const activeTerms = [];
  if (state.query.trim()) activeTerms.push(`“${state.query.trim()}”`);
  if (activeCategory) activeTerms.push(activeCategory.name);

  heading.textContent = state.query.trim()
    ? `Results for “${state.query.trim()}”`
    : activeCategory
      ? activeCategory.name
      : "All recipes";
  count.textContent = `${results.length} ${results.length === 1 ? "recipe" : "recipes"}`;
  grid.innerHTML = results.map(recipeCard).join("");
  grid.hidden = results.length === 0;
  empty.hidden = results.length > 0;
  clearButton.hidden = !state.query;
  if (activeSearchBar && activeSearchText) {
    activeSearchBar.hidden = !hasFilter;
    activeSearchText.textContent = hasFilter
      ? `Showing ${results.length} ${results.length === 1 ? "recipe" : "recipes"} for ${activeTerms.join(" in ")}`
      : "";
  }

  document.querySelectorAll("[data-filter-category]").forEach((button) => {
    const isActive = button.dataset.filterCategory === state.category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.querySelector("#browse-section")?.classList.toggle("is-searching", hasFilter);
  document.querySelector("#category-section")?.classList.toggle("is-hidden-for-search", hasFilter);
}

function renderHome({ focusSearch = false } = {}) {
  main.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">My personal cookbook</p>
        <h1>Find something<br /><em>delicious.</em></h1>
        <p class="hero-description">
          Cakes, pastries, frostings, fillings, and everything worth making again.
        </p>
      </div>

      <div class="search-panel">
        <label class="search-field" for="recipe-search">
          <span class="search-icon">${icon("search")}</span>
          <input
            id="recipe-search"
            type="search"
            placeholder="Search recipes or ingredients…"
            autocomplete="off"
            value="${escapeHtml(state.query)}"
          />
          <button id="clear-search" type="button" aria-label="Clear search" ${state.query ? "" : "hidden"}>
            ${icon("close")}
          </button>
        </label>
      </div>
    </section>

    <section class="category-section" id="category-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Browse by category</p>
          <h2>The recipe box</h2>
        </div>
        <span>${state.data.recipeCount} recipes</span>
      </div>
      <div class="category-grid">
        ${state.data.categories.map(categoryCard).join("")}
      </div>
    </section>

    <section class="browse-section" id="browse-section">
      <div class="section-heading results-heading-row">
        <div>
          <p class="eyebrow">Cookbook</p>
          <h2 id="results-heading">All recipes</h2>
        </div>
        <span id="results-count"></span>
      </div>

      <div class="filter-strip" aria-label="Recipe categories">
        <button class="filter-chip is-active" type="button" data-filter-category="all" aria-pressed="true">
          <span>All</span>
          <span class="filter-chip-count">${state.data.recipeCount}</span>
        </button>
        ${state.data.categories
          .map(
            (category) =>
              `<button class="filter-chip" type="button" data-filter-category="${category.slug}" aria-pressed="false">
                <span>${escapeHtml(category.name)}</span>
                <span class="filter-chip-count">${category.count}</span>
              </button>`
          )
          .join("")}
      </div>

      <div class="active-search-bar" id="active-search-bar" hidden>
        <span id="active-search-text"></span>
        <button class="active-search-clear" type="button" data-reset-search>Clear</button>
      </div>

      <div class="recipe-grid" id="recipe-grid"></div>
      <div class="empty-state" id="empty-state" hidden>
        <span>${icon("book")}</span>
        <h3>No recipes found</h3>
        <p>Try a different ingredient, recipe name, or category.</p>
        <button class="secondary-button" type="button" data-reset-search>Clear search</button>
      </div>
    </section>
  `;

  document.querySelector("#recipe-search").addEventListener("input", (event) => {
    state.query = event.target.value;
    updateResults();
  });
  document.querySelector("#clear-search").addEventListener("click", () => resetSearch(true));
  document.querySelectorAll("[data-filter-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.filterCategory;
      updateResults();
    });
  });
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      updateResults();
      document.querySelector("#browse-section").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.querySelectorAll("[data-reset-search]").forEach((button) => {
    button.addEventListener("click", () => resetSearch(true));
  });

  updateResults();
  if (focusSearch) {
    requestAnimationFrame(() => document.querySelector("#recipe-search")?.focus());
  }
}

function resetSearch(focus = false) {
  state.query = "";
  state.category = "all";
  const input = document.querySelector("#recipe-search");
  if (input) input.value = "";
  updateResults();
  if (focus) input?.focus();
}

function miniRecipeCard(item, label) {
  const recipe = state.data.recipes.find((candidate) => candidate.slug === item.slug);
  if (!recipe) return "";
  const detail = categoryInfo(recipe.categorySlug, recipe.category);
  return `
    <a class="mini-recipe-card" href="#/recipe/${encodeURIComponent(recipe.slug)}">
      <span>
        <small>${escapeHtml(label || recipe.category)}</small>
        <strong>${escapeHtml(recipe.title)}</strong>
      </span>
      ${icon("arrow")}
    </a>
  `;
}

const recipeJumpSections = [
  { key: "ingredients", label: "Ingredients", heading: "Ingredients" },
  { key: "instructions", label: "Instructions", heading: "Instructions" },
  { key: "notes", label: "Notes", heading: "Notes" },
  { key: "recommended-pairings", label: "Pairings", heading: "Recommended Pairings" }
];

const sectionSlug = (value = "") =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function hasRecipeHeading(recipe, heading) {
  return recipe.html.includes(`<h2>${heading}</h2>`);
}

function recipeJumpNav(recipe) {
  const sections = recipeJumpSections.filter((section) => hasRecipeHeading(recipe, section.heading));
  if (recipe.related.length || recipe.usedBy.length) {
    sections.push({ key: "related", label: "Related" });
  }
  if (sections.length < 2) return "";

  return `
    <nav class="recipe-jump-nav" aria-label="Recipe sections">
      ${sections
        .map(
          (section) =>
            `<button class="recipe-jump-chip" type="button" data-recipe-jump="${section.key}">${section.label}</button>`
        )
        .join("")}
    </nav>
  `;
}

function wireRecipeJumpNav() {
  document.querySelectorAll(".recipe-content h2").forEach((heading) => {
    heading.id = `recipe-section-${sectionSlug(heading.textContent)}`;
  });

  const relatedPanel = document.querySelector(".recipe-aside");
  if (relatedPanel) relatedPanel.id = "recipe-section-related";

  document.querySelectorAll("[data-recipe-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(`#recipe-section-${button.dataset.recipeJump}`);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderRecipe(slug) {
  const recipe = state.data.recipes.find((candidate) => candidate.slug === slug);
  if (!recipe) {
    renderNotFound();
    return;
  }
  const detail = categoryInfo(recipe.categorySlug, recipe.category);
  document.title = `${recipe.title} — Lulusweets`;

  main.innerHTML = `
    <article class="recipe-page">
      <div class="recipe-toolbar">
        <a class="back-link" href="#/">${icon("back")} Back to cookbook</a>
        <a class="category-pill tone-${detail.tone}" href="#/category/${recipe.categorySlug}">
          ${escapeHtml(recipe.category)}
        </a>
      </div>

      <header class="recipe-hero">
        <div>
          <p class="eyebrow">${escapeHtml(recipe.category)}</p>
          <h1>${escapeHtml(recipe.title)}</h1>
          <div class="recipe-meta">
            ${
              recipe.ingredients.length
                ? `<span>${recipe.ingredients.length} listed ingredients</span>`
                : "<span>Composed recipe</span>"
            }
            ${
              recipe.related.length
                ? `<span>${recipe.related.length} linked ${recipe.related.length === 1 ? "component" : "components"}</span>`
                : ""
            }
          </div>
          ${recipeJumpNav(recipe)}
        </div>
      </header>

      <div class="recipe-layout">
        <div class="recipe-content">${recipe.html}</div>
        <aside class="recipe-aside">
          ${
            recipe.related.length
              ? `
                <section class="related-panel">
                  <p class="eyebrow">Make it with</p>
                  <h2>Related recipes</h2>
                  <div class="mini-card-list">
                    ${recipe.related.map((item) => miniRecipeCard(item)).join("")}
                  </div>
                </section>
              `
              : ""
          }
          ${
            recipe.usedBy.length
              ? `
                <section class="related-panel">
                  <p class="eyebrow">Used in</p>
                  <h2>Recipes using this</h2>
                  <div class="mini-card-list">
                    ${recipe.usedBy.map((item) => miniRecipeCard(item)).join("")}
                  </div>
                </section>
              `
              : ""
          }
        </aside>
      </div>
    </article>
  `;
  wireRecipeJumpNav();
  main.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderCategory(slug) {
  const category = state.data.categories.find((candidate) => candidate.slug === slug);
  if (!category) {
    renderNotFound();
    return;
  }
  const recipes = state.data.recipes.filter((recipe) => recipe.categorySlug === slug);
  const detail = categoryInfo(category.slug, category.name);
  document.title = `${category.name} — Lulusweets`;
  state.query = "";
  state.category = "all";

  main.innerHTML = `
    <section class="category-page">
      <div class="recipe-toolbar">
        <a class="back-link" href="#/">${icon("back")} Back to cookbook</a>
      </div>
      <header class="category-page-header">
        <div>
          <p class="eyebrow">Recipe category</p>
          <h1>${escapeHtml(category.name)}</h1>
          <p>${recipes.length} ${recipes.length === 1 ? "recipe" : "recipes"} in the collection</p>
        </div>
      </header>
      <div class="recipe-grid">
        ${recipes.map(recipeCard).join("")}
      </div>
    </section>
  `;
  main.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderNotFound() {
  document.title = "Not found — Lulusweets";
  main.innerHTML = `
    <section class="not-found">
      <span class="loading-mark">L</span>
      <p class="eyebrow">Lost recipe</p>
      <h1>That page isn’t in the recipe box.</h1>
      <a class="primary-button" href="#/">Return to the cookbook</a>
    </section>
  `;
}

function renderRoute(options = {}) {
  if (!state.data) return;
  const current = route();
  if (current.section === "recipe") renderRecipe(current.value);
  else if (current.section === "category") renderCategory(current.value);
  else {
    document.title = "Lulusweets — My Recipe Collection";
    renderHome(options);
  }
}

headerSearchButton.addEventListener("click", () => {
  if (route().section !== "home") {
    window.location.hash = "#/";
    window.setTimeout(() => document.querySelector("#recipe-search")?.focus(), 50);
  } else {
    document.querySelector("#recipe-search")?.focus();
    document.querySelector(".search-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

window.addEventListener("hashchange", () => renderRoute());
window.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    headerSearchButton.click();
  }
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  state.installPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!state.installPrompt) return;
  state.installPrompt.prompt();
  const choice = await state.installPrompt.userChoice;
  if (choice.outcome === "accepted") showToast("Lulusweets was added to your device.");
  state.installPrompt = null;
  installButton.hidden = true;
});

window.addEventListener("appinstalled", () => {
  installButton.hidden = true;
  showToast("Cookbook installed.");
});

async function boot() {
  try {
    const response = await fetch("./data/recipes.json");
    if (!response.ok) throw new Error(`Recipe data returned ${response.status}`);
    state.data = await response.json();
    renderRoute();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        showToast("Offline mode could not be enabled.");
      });
    }
  } catch (error) {
    console.error(error);
    main.innerHTML = `
      <section class="not-found">
        <span class="loading-mark">L</span>
        <p class="eyebrow">Cookbook unavailable</p>
        <h1>The recipes could not be opened.</h1>
        <p>Please refresh the page and try again.</p>
        <button class="primary-button" type="button" onclick="window.location.reload()">Refresh</button>
      </section>
    `;
  }
}

boot();
