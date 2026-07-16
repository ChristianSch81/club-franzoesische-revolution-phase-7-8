import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = dirname(here);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function scriptsFrom(html) {
  return Array.from(html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi), (match) => match[1]);
}

class MockClassList {
  constructor() {
    this.values = new Set();
  }
  add(...names) { names.forEach((name) => this.values.add(name)); }
  remove(...names) { names.forEach((name) => this.values.delete(name)); }
  contains(name) { return this.values.has(name); }
}

class MockElement {
  constructor(id = "") {
    this.id = id;
    this.textContent = "";
    this.value = "";
    this.hidden = false;
    this.checked = false;
    this.dataset = {};
    this.attributes = {};
    this.listeners = {};
    this.classList = new MockClassList();
    this.files = [];
    this.closestElement = null;
  }
  addEventListener(type, listener) {
    (this.listeners[type] ||= []).push(listener);
  }
  async trigger(type, extra = {}) {
    for (const listener of this.listeners[type] || []) {
      await listener({ target: this, ...extra });
    }
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name]; }
  click() {
    this.clicked = true;
    return this.trigger("click");
  }
  remove() { this.removed = true; }
  focus() { this.focused = true; }
  scrollIntoView() { this.scrolled = true; }
  closest() { return this.closestElement; }
}

class MockStorage {
  constructor(initial = {}) {
    this.values = new Map(Object.entries(initial));
  }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

function evaluateDataScript(script, name) {
  const sandbox = {};
  vm.runInNewContext(`${script}; this.__value = ${name};`, sandbox);
  return sandbox.__value;
}

function dashboardEnvironment(config) {
  const elements = new Map();
  const get = (id) => {
    if (!elements.has(id)) elements.set(id, new MockElement(id));
    return elements.get(id);
  };
  [
    "export-progress", "import-progress", "import-progress-file", "progress-management-status",
    "dashboard-ring-test", "dashboard-ring-M", "dashboard-ring-R", "dashboard-ring-E",
    "dashboard-center-value", "dashboard-test-value", "dashboard-test-detail",
    "dashboard-M-value", "dashboard-M-detail", "dashboard-R-value", "dashboard-R-detail",
    "dashboard-E-value", "dashboard-E-detail", "overall-chart-description"
  ].forEach(get);
  config.packages.forEach((pkg) => {
    ["package-ring-", "package-ring-text-", "package-progress-detail-", "package-progress-desc-"]
      .forEach((prefix) => get(prefix + pkg.id));
  });

  const created = [];
  const document = {
    getElementById: get,
    createElement() {
      const element = new MockElement();
      created.push(element);
      return element;
    },
    body: { appendChild() {} }
  };
  const localStorage = new MockStorage({
    [config.packages[0].storageKey]: JSON.stringify({
      version: 2,
      attempted: ["M:eins", "M:zwei"],
      passed: ["M:eins"],
      drafts: {}
    }),
    [config.finalTestStorageKey]: JSON.stringify({
      scores: {
        M: { points: 10, maximum: 10, complete: true },
        R: { points: 20, maximum: 20, complete: true },
        E: { points: 8, maximum: 8, complete: true }
      }
    })
  });
  const window = {
    addEventListener() {},
    confirm: () => true
  };
  const urlApi = {
    createObjectURL: () => "blob:fortschritt",
    revokeObjectURL() {}
  };
  return { elements, get, created, document, localStorage, window, urlApi };
}

async function testDashboard() {
  const html = await readFile(join(outputDir, "index.html"), "utf8");
  const scripts = scriptsFrom(html);
  assert(scripts.length === 2, "Dashboard-Test: zwei Skripte erwartet.");
  const config = evaluateDataScript(scripts[0], "PROGRESS_CONFIG");
  const env = dashboardEnvironment(config);
  const sandbox = {
    PROGRESS_CONFIG: config,
    document: env.document,
    localStorage: env.localStorage,
    window: env.window,
    Blob,
    URL: env.urlApi,
    Date,
    JSON,
    Object,
    Array,
    Set,
    Number,
    Math
  };
  vm.runInNewContext(scripts[1], sandbox);

  assert(env.get("dashboard-ring-test").getAttribute("stroke-dasharray") === "100 0", "Dashboard-Test: Abschlusstest-Kreis zeigt nicht 100 %.");
  assert(env.get("dashboard-M-value").textContent === "50%", "Dashboard-Test: M8-Übungsrichtigkeit wurde nicht korrekt berechnet.");
  assert(env.get(`package-ring-text-${config.packages[0].id}`).textContent === "50%", "Dashboard-Test: Paketkreis wurde nicht korrekt berechnet.");

  await env.get("export-progress").trigger("click");
  const download = env.created.find((element) => element.download);
  assert(download && download.clicked && download.download.endsWith(".json"), "Dashboard-Test: Export erzeugt keine JSON-Datei.");

  const imported = {
    application: config.application,
    version: config.version,
    exportedAt: new Date().toISOString(),
    data: {
      [config.packages[1].storageKey]: {
        version: 2,
        attempted: ["R:eins"],
        passed: ["R:eins"],
        drafts: {}
      }
    }
  };
  const fileInput = env.get("import-progress-file");
  fileInput.files = [{
    size: 1000,
    text: async () => JSON.stringify(imported)
  }];
  await fileInput.trigger("change");
  assert(env.localStorage.getItem(config.packages[1].storageKey), "Dashboard-Test: Import stellt Paketfortschritt nicht wieder her.");
  assert(env.get("progress-management-status").textContent.includes("erfolgreich importiert"), "Dashboard-Test: Importstatus fehlt.");
}

function finalTestEnvironment(data) {
  const elements = new Map();
  const get = (id) => {
    if (!elements.has(id)) elements.set(id, new MockElement(id));
    return elements.get(id);
  };
  [
    "save-status", "score-M", "score-R", "score-E", "score-total",
    "test-completion-status", "minimum-status", "evaluate-minimum"
  ].forEach(get);

  const radios = [];
  const drafts = [];
  const criteria = [];
  const showButtons = [];
  const rubrics = new Map();
  const minimumTasks = new Map();

  data.minimumQuestions.forEach((question) => {
    const task = new MockElement(`task-${question.id}`);
    minimumTasks.set(question.id, task);
    const feedback = get(`feedback-${question.id}`);
    feedback.closestElement = task;
    question.options.forEach((_option, index) => {
      const input = new MockElement();
      input.name = question.id;
      input.value = String(index);
      radios.push(input);
    });
  });

  [...data.regularQuestions, data.expertQuestion].forEach((question) => {
    const textarea = get(`draft-${question.id}`);
    textarea.dataset.draft = question.id;
    drafts.push(textarea);
    const button = new MockElement();
    button.dataset.showRubric = question.id;
    showButtons.push(button);
    rubrics.set(question.id, new MockElement(`rubric-${question.id}`));
    question.criteria.forEach((_criterion, index) => {
      const input = new MockElement();
      input.dataset.criterion = question.id;
      input.value = String(index);
      criteria.push(input);
    });
  });

  const document = {
    getElementById: get,
    querySelectorAll(selector) {
      if (selector === 'input[type="radio"]') return radios;
      if (selector === "[data-draft]") return drafts;
      if (selector === "[data-criterion]") return criteria;
      if (selector === "[data-show-rubric]") return showButtons;
      const criterionMatch = selector.match(/^\[data-criterion="([^"]+)"\]$/);
      if (criterionMatch) return criteria.filter((input) => input.dataset.criterion === criterionMatch[1]);
      return [];
    },
    querySelector(selector) {
      const radioMatch = selector.match(/^input\[name="([^"]+)"\]\[value="([^"]+)"\]$/);
      if (radioMatch) return radios.find((input) => input.name === radioMatch[1] && input.value === radioMatch[2]) || null;
      const rubricMatch = selector.match(/^\[data-rubric="([^"]+)"\]$/);
      if (rubricMatch) return rubrics.get(rubricMatch[1]) || null;
      const taskMatch = selector.match(/^\[data-minimum-question="([^"]+)"\]$/);
      if (taskMatch) return minimumTasks.get(taskMatch[1]) || null;
      return null;
    }
  };
  const localStorage = new MockStorage();
  const window = {
    clearTimeout() {},
    setTimeout(callback) { callback(); return 1; },
    addEventListener() {}
  };
  return { get, radios, drafts, criteria, showButtons, document, localStorage, window };
}

async function testFinalTest() {
  const html = await readFile(join(outputDir, "abschlusstest.html"), "utf8");
  const scripts = scriptsFrom(html);
  assert(scripts.length === 2, "Abschlusstest-Test: zwei Skripte erwartet.");
  const data = evaluateDataScript(scripts[0], "FINAL_TEST_DATA");
  const env = finalTestEnvironment(data);
  const sandbox = {
    FINAL_TEST_DATA: data,
    document: env.document,
    localStorage: env.localStorage,
    window: env.window,
    JSON,
    Object,
    Array,
    Set,
    Number,
    Math,
    Date
  };
  vm.runInNewContext(scripts[1], sandbox);

  for (const question of data.minimumQuestions) {
    const radio = env.radios.find((input) => input.name === question.id && Number(input.value) === question.answer);
    radio.checked = true;
    await radio.trigger("change");
  }
  await env.get("evaluate-minimum").trigger("click");
  let stored = JSON.parse(env.localStorage.getItem(data.storageKey));
  assert(stored.scores.M.points === 10 && stored.scores.M.complete, "Abschlusstest-Test: M8 wird nicht automatisch mit 10/10 bewertet.");

  for (const question of [...data.regularQuestions, data.expertQuestion]) {
    const textarea = env.get(`draft-${question.id}`);
    textarea.value = "Eine ausführliche historische Antwort mit Belegen und begründetem Urteil. ".repeat(3);
    await textarea.trigger("input");
    const show = env.showButtons.find((button) => button.dataset.showRubric === question.id);
    await show.trigger("click");
    for (const input of env.criteria.filter((candidate) => candidate.dataset.criterion === question.id)) {
      input.checked = true;
      await input.trigger("change");
    }
  }

  stored = JSON.parse(env.localStorage.getItem(data.storageKey));
  assert(stored.scores.R.points === 20 && stored.scores.R.complete, "Abschlusstest-Test: R8-Selbstbewertung ergibt nicht 20/20.");
  assert(stored.scores.E.points === 8 && stored.scores.E.complete, "Abschlusstest-Test: E8-Selbstbewertung ergibt nicht 8/8.");
  assert(env.get("score-total").textContent === "100%", "Abschlusstest-Test: Gesamtanzeige erreicht nicht 100 %.");
}

await testDashboard();
await testFinalTest();

console.log("Interaktions-QA bestanden: Kreisberechnung, Paketstatistik, Export, Import, M8-Automatik sowie R8-/E8-Selbstbewertung und Speicherung geprüft.");
