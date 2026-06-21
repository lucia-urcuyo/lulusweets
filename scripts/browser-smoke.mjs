import { spawn } from "node:child_process";
import { rm, writeFile } from "node:fs/promises";

const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const appUrl = process.env.APP_URL || "http://127.0.0.1:4173/";
const debuggingPort = Number(process.env.CHROME_DEBUG_PORT || 9333);
const profilePath = "/private/tmp/lulusweets-smoke-profile";

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

await rm(profilePath, { recursive: true, force: true });

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-background-networking",
    `--remote-debugging-port=${debuggingPort}`,
    `--user-data-dir=${profilePath}`,
    appUrl
  ],
  { stdio: ["ignore", "ignore", "ignore"] }
);

async function waitForTarget() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debuggingPort}/json`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      // Chrome is still starting.
    }
    await sleep(100);
  }
  throw new Error("Chrome DevTools target did not become available.");
}

let socket;
let nextId = 1;
const pending = new Map();

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const response = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.text || `Evaluation failed: ${expression}`);
  }
  return response.result.value;
}

async function waitFor(expression, timeout = 6000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(`Boolean(${expression})`)) return;
    await sleep(100);
  }
  throw new Error(`Timed out waiting for ${expression}`);
}

try {
  const webSocketUrl = await waitForTarget();
  socket = new WebSocket(webSocketUrl);
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await waitFor(`document.querySelector("#recipe-search")`);

  const home = await evaluate(`({
    title: document.title,
    categories: document.querySelectorAll(".category-card").length,
    recipes: document.querySelectorAll(".recipe-card").length,
    clearHidden: document.querySelector("#clear-search").hidden
  })`);

  const search = await evaluate(`(async () => {
    const input = document.querySelector("#recipe-search");
    input.value = "cream cheese";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 80));
    return {
      heading: document.querySelector("#results-heading").textContent,
      count: document.querySelectorAll(".recipe-card").length,
      first: document.querySelector(".recipe-card h3")?.textContent || ""
    };
  })()`);

  await evaluate(`document.querySelector(".recipe-card").click()`);
  await waitFor(`document.querySelector(".recipe-page")`);
  const recipe = await evaluate(`({
    title: document.querySelector(".recipe-hero h1").textContent,
    ingredientTables: document.querySelectorAll(".recipe-content table").length,
    relatedCards: document.querySelectorAll(".mini-recipe-card").length
  })`);

  await evaluate(`window.location.hash = "#/category/macarons"`);
  await waitFor(`document.querySelector(".category-page")`);
  const category = await evaluate(`({
    title: document.querySelector(".category-page-header h1").textContent,
    count: document.querySelectorAll(".category-page .recipe-card").length
  })`);

  await evaluate(`navigator.serviceWorker.ready.then(() => true)`);
  await send("Network.emulateNetworkConditions", {
    offline: true,
    latency: 0,
    downloadThroughput: 0,
    uploadThroughput: 0,
    connectionType: "none"
  });
  await send("Page.reload", { ignoreCache: false });
  await sleep(1200);
  const offline = await evaluate(`({
    title: document.title,
    appVisible: Boolean(document.querySelector(".category-page, .recipe-page, .hero"))
  })`);
  await send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 0,
    downloadThroughput: -1,
    uploadThroughput: -1,
    connectionType: "wifi"
  });

  const screenshot = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(
    "/private/tmp/lulusweets-browser-smoke.png",
    Buffer.from(screenshot.data, "base64")
  );

  const failures = [];
  if (home.title !== "Lulusweets — My Recipe Collection") failures.push("Unexpected home title.");
  if (home.categories !== 14) failures.push(`Expected 14 category cards; found ${home.categories}.`);
  if (home.recipes !== 98) failures.push(`Expected 98 home recipe cards; found ${home.recipes}.`);
  if (!home.clearHidden) failures.push("Empty search clear button should be hidden.");
  if (search.count !== 6) failures.push(`Expected 6 cream-cheese results; found ${search.count}.`);
  if (!recipe.title) failures.push("Recipe navigation did not produce a title.");
  if (category.title !== "Macarons" || category.count !== 10) {
    failures.push(`Expected Macarons category with 10 recipes; found ${category.title}/${category.count}.`);
  }
  if (!offline.appVisible) failures.push("App was not visible after an offline reload.");

  if (failures.length) {
    throw new Error(failures.join("\n"));
  }

  console.log(
    JSON.stringify(
      {
        home,
        search,
        recipe,
        category,
        offline,
        screenshot: "/private/tmp/lulusweets-browser-smoke.png"
      },
      null,
      2
    )
  );
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
}
