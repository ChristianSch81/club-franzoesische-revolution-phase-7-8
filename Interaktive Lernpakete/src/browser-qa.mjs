const port = Number(process.argv[2] || 9333);
const baseDirectory = new URL("../", import.meta.url).href;
const packageFiles = [
  "paket-01-sonnenkoenig.html",
  "paket-02-aufklaerung.html",
  "paket-03-staendeordnung.html",
  "paket-04-frankreich-in-der-krise.html",
  "paket-05-beginn-der-revolution.html",
  "paket-06-erklaerung-der-menschenrechte.html",
  "paket-07-frankreich-auf-dem-weg-zur-republik.html",
  "paket-08-die-napoleonische-herrschaft.html",
  "paket-09-vom-wiener-kongress-zum-hambacher-fest.html",
  "paket-10-die-revolution-von-1848.html"
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
const target = targets.find((item) => item.type === "page");
assert(target?.webSocketDebuggerUrl, "Kein DevTools-Seitenziel gefunden.");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 1;
const pending = new Map();
const exceptions = [];
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(`${message.error.code}: ${message.error.message}`));
    else request.resolve(message.result);
    return;
  }
  if (message.method === "Runtime.exceptionThrown") {
    exceptions.push(message.params.exceptionDetails.text || "Unbekannte Browser-Ausnahme");
  }
});

function send(method, params = {}) {
  const id = nextId;
  nextId += 1;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const response = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || `Auswertung fehlgeschlagen: ${expression}`);
  return response.result.value;
}

async function navigate(filename, width = 360, height = 900) {
  exceptions.length = 0;
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: true,
    screenWidth: width,
    screenHeight: height
  });
  await send("Page.navigate", { url: `${baseDirectory}${filename}` });
  for (let attempt = 0; attempt < 40; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    if (await evaluate("document.readyState")) {
      if (await evaluate("document.readyState === 'complete'")) break;
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
  assert(exceptions.length === 0, `${filename}: Browser-Ausnahme: ${exceptions.join("; ")}`);
}

async function pageMetrics() {
  return evaluate(`({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    bodyText: document.body.innerText.length
  })`);
}

await send("Page.enable");
await send("Runtime.enable");

await navigate("index.html", 320, 900);
let metrics = await pageMetrics();
assert(metrics.viewport === 320, `Index: erwartete 320px, erhalten ${metrics.viewport}px.`);
assert(!metrics.hasHorizontalOverflow, `Index: horizontaler Überlauf ${metrics.scrollWidth}/${metrics.viewport}.`);
assert(await evaluate("document.querySelectorAll('.package-card').length") === 10, "Index: nicht zehn Paketkarten.");
let chrome = await evaluate(`({
  series: document.querySelector('.series-title')?.textContent.trim(),
  author: document.querySelector('.footer-author')?.textContent.trim(),
  headerBackground: getComputedStyle(document.querySelector('.site-header')).backgroundColor
})`);
assert(chrome.series === "Geschichte Phase 7/8: Die Französische Revolution", "Index: Reihen-Kopfzeile fehlt.");
assert(chrome.author === "Autor: Christian Schwend", "Index: Autorennennung fehlt.");
assert(chrome.headerBackground !== "rgba(0, 0, 0, 0)", "Index: Kopfzeile hat keine Hintergrundfarbe.");

for (const filename of packageFiles) {
  await navigate(filename, 360, 900);
  metrics = await pageMetrics();
  assert(!metrics.hasHorizontalOverflow, `${filename}: horizontaler Überlauf ${metrics.scrollWidth}/${metrics.viewport}.`);
  const summary = await evaluate(`({
    levels: document.querySelectorAll('[data-level]').length,
    levelCards: document.querySelectorAll('[data-level-card]').length,
    taskCount: PACKAGE.tasks.length,
    title: document.querySelector('h1').textContent,
    hasInputPlan: Object.hasOwn(PACKAGE, 'inputPlan'),
    planNodes: document.querySelectorAll('#plan-view, .plan-phase, #tab-plan').length,
    series: document.querySelector('.series-title')?.textContent.trim(),
    author: document.querySelector('.footer-author')?.textContent.trim(),
    headerBackground: getComputedStyle(document.querySelector('.site-header')).backgroundColor,
    mUnlocked: !document.querySelector('[data-level="M"]').disabled,
    rLocked: document.querySelector('[data-level="R"]').disabled,
    eLocked: document.querySelector('[data-level="E"]').disabled,
    levelMeters: document.querySelectorAll('[id^="level-progress-"]').length
  })`);
  assert(summary.levels === 3 && summary.levelCards === 3 && summary.levelMeters === 3, `${filename}: Niveaustufen-Lernpfad unvollständig.`);
  assert(summary.taskCount > 0 && summary.title, `${filename}: Paketdaten fehlen.`);
  assert(summary.mUnlocked && summary.rLocked && summary.eLocked, `${filename}: Ausgangssperre M→R→E ist fehlerhaft.`);
  assert(!summary.hasInputPlan && summary.planNodes === 0, `${filename}: Verlaufsplanung ist noch in der Lernendenansicht enthalten.`);
  assert(summary.series === "Geschichte Phase 7/8: Die Französische Revolution", `${filename}: Reihen-Kopfzeile fehlt.`);
  assert(summary.author === "Autor: Christian Schwend", `${filename}: Autorennennung fehlt.`);
  assert(summary.headerBackground !== "rgba(0, 0, 0, 0)", `${filename}: Kopfzeile hat keine Hintergrundfarbe.`);
}

await navigate("paket-01-sonnenkoenig.html", 360, 900);
let result = await evaluate(`(() => {
  document.querySelector('[data-level="M"]').click();
  const task = PACKAGE.tasks.filter((item) => item.levels.includes('M'))[0];
  const inputs = Array.from(document.querySelectorAll('#answer-area input'));
  inputs.forEach((input, index) => { input.checked = Boolean(task.options[index].correct); });
  document.querySelector('#answer-area .button.primary').click();
  return {
    workspaceVisible: !document.getElementById('task-workspace').hidden,
    nextEnabled: !document.getElementById('next-task').disabled,
    progress: document.getElementById('task-progress').value,
    feedback: document.getElementById('feedback').textContent
  };
})()`);
assert(result.workspaceVisible && result.nextEnabled && result.progress === 1, "Choice-Interaktion schlägt fehl.");
assert(result.feedback.includes("Erledigt"), "Choice-Rückmeldung fehlt.");
metrics = await pageMetrics();
assert(!metrics.hasHorizontalOverflow, "Choice-Aufgabe erzeugt horizontalen Überlauf.");

await navigate("paket-02-aufklaerung.html", 360, 900);
result = await evaluate(`(() => {
  document.querySelector('[data-level="M"]').click();
  const task = PACKAGE.tasks.filter((item) => item.levels.includes('M'))[0];
  const selects = Array.from(document.querySelectorAll('#answer-area select'));
  selects.forEach((select, index) => { select.value = task.items[index].answer; });
  document.querySelector('#answer-area .button.primary').click();
  return {
    nextEnabled: !document.getElementById('next-task').disabled,
    progress: document.getElementById('task-progress').value,
    attempted: document.getElementById('attempt-progress').value,
    rLocked: document.querySelector('[data-level="R"]').disabled
  };
})()`);
assert(result.nextEnabled && result.progress === 1 && result.attempted === 1, "Zuordnungsinteraktion schlägt fehl.");
assert(result.rLocked, "R8 wird vor Bearbeitung aller M8-Aufgaben freigeschaltet.");

result = await evaluate(`(() => {
  document.getElementById('next-task').click();
  const mTasks = PACKAGE.tasks.filter((item) => item.levels.includes('M'));
  const task = mTasks[1];
  const selects = Array.from(document.querySelectorAll('#answer-area select'));
  selects.forEach((select, index) => { select.value = task.items[index].answer; });
  document.querySelector('#answer-area .button.primary').click();
  return {
    rUnlocked: !document.querySelector('[data-level="R"]').disabled,
    eLocked: document.querySelector('[data-level="E"]').disabled,
    attempted: document.getElementById('attempt-progress').value,
    passed: document.getElementById('task-progress').value
  };
})()`);
assert(result.rUnlocked && result.eLocked && result.attempted === 2 && result.passed === 2, "M8-Mastery schaltet R8 nicht korrekt frei.");

result = await evaluate(`(() => {
  document.getElementById('change-level').click();
  document.querySelector('[data-level="R"]').click();
  const rTasks = PACKAGE.tasks.filter((item) => item.levels.includes('R'));
  for (let index = 0; index < rTasks.length; index += 1) {
    const task = rTasks[index];
    const textarea = document.querySelector('#answer-area textarea');
    textarea.value = 'Eine materialgestützte historische Erklärung verbindet Ursache, Wirkung, Perspektive und einen begründeten Beleg. '.repeat(Math.ceil(task.minChars / 105) + 1);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelectorAll('#answer-area input[type="checkbox"]').forEach((input) => { input.checked = true; });
    document.querySelector('#answer-area .button.primary').click();
    if (index < rTasks.length - 1) document.getElementById('next-task').click();
  }
  const stored = JSON.parse(localStorage.getItem('franzrev-interaktiv:' + PACKAGE.id));
  return {
    eUnlocked: !document.querySelector('[data-level="E"]').disabled,
    version: stored.version,
    attemptedKeys: stored.attempted.length,
    passedKeys: stored.passed.length
  };
})()`);
assert(result.eUnlocked && result.version === 2, "R8-Mastery schaltet E8 nicht korrekt frei oder Fortschrittsformat fehlt.");
assert(result.attemptedKeys === 5 && result.passedKeys === 5, "Niveaubezogene Persistenz enthält unerwartete Werte.");

await navigate("paket-02-aufklaerung.html", 360, 900);
result = await evaluate(`(() => ({
  rUnlocked: !document.querySelector('[data-level="R"]').disabled,
  eUnlocked: !document.querySelector('[data-level="E"]').disabled,
  mProgress: document.getElementById('level-progress-M').value,
  rProgress: document.getElementById('level-progress-R').value
}))()`);
assert(result.rUnlocked && result.eUnlocked && result.mProgress === 2 && result.rProgress === 3, "Freischaltung bleibt nach Neuladen nicht erhalten.");

result = await evaluate(`(() => {
  window.confirm = () => true;
  document.getElementById('reset-progress').click();
  const stored = JSON.parse(localStorage.getItem('franzrev-interaktiv:' + PACKAGE.id));
  return {
    rLocked: document.querySelector('[data-level="R"]').disabled,
    eLocked: document.querySelector('[data-level="E"]').disabled,
    attemptedKeys: stored.attempted.length,
    passedKeys: stored.passed.length,
    resetStatus: document.getElementById('reset-status').textContent
  };
})()`);
assert(result.rLocked && result.eLocked && result.attemptedKeys === 0 && result.passedKeys === 0, "Fortschritt zurücksetzen sperrt den Lernpfad nicht erneut.");
assert(result.resetStatus.includes("zurückgesetzt"), "Bestätigung nach dem Zurücksetzen fehlt.");

await navigate("paket-03-staendeordnung.html", 360, 900);
result = await evaluate(`(() => {
  document.querySelector('[data-level="M"]').click();
  const tasks = PACKAGE.tasks.filter((item) => item.levels.includes('M'));

  const firstTask = tasks[0];
  const firstInputs = Array.from(document.querySelectorAll('#answer-area input'));
  const wrongIndex = firstTask.options.findIndex((option) => !option.correct);
  firstInputs[wrongIndex].checked = true;
  document.querySelector('#answer-area .button.primary').click();
  const canContinueAfterError = !document.getElementById('next-task').disabled;
  document.getElementById('next-task').click();

  for (let index = 1; index < tasks.length; index += 1) {
    const task = tasks[index];
    if (task.kind === 'choice') {
      const inputs = Array.from(document.querySelectorAll('#answer-area input'));
      inputs.forEach((input, optionIndex) => { input.checked = Boolean(task.options[optionIndex].correct); });
    } else if (task.kind === 'match') {
      const selects = Array.from(document.querySelectorAll('#answer-area select'));
      selects.forEach((select, itemIndex) => { select.value = task.items[itemIndex].answer; });
    } else if (task.kind === 'order') {
      const list = document.querySelector('.sort-list');
      const rows = Array.from(list.children);
      task.items.forEach((item) => list.append(rows.find((row) => row.dataset.item === item)));
    }
    document.querySelector('#answer-area .button.primary').click();
    if (index < tasks.length - 1) document.getElementById('next-task').click();
  }

  return {
    canContinueAfterError,
    attempted: document.getElementById('attempt-progress').value,
    passed: document.getElementById('task-progress').value,
    rUnlocked: !document.querySelector('[data-level="R"]').disabled
  };
})()`);
assert(result.canContinueAfterError, "Ein gültiger Fehlversuch erlaubt kein Weiterarbeiten.");
assert(result.attempted === 5 && result.passed === 4 && result.rUnlocked, "Exakt 80 % bei vollständig bearbeitetem M8 schalten R8 nicht frei.");

await navigate("paket-05-beginn-der-revolution.html", 360, 900);
result = await evaluate(`(() => {
  document.querySelector('[data-level="M"]').click();
  const task = PACKAGE.tasks.filter((item) => item.levels.includes('M'))[0];
  const list = document.querySelector('.sort-list');
  const firstRow = list.firstElementChild;
  const firstItem = firstRow.dataset.item;
  const handle = firstRow.querySelector('[data-drag-handle="true"]');
  const start = handle.getBoundingClientRect();
  const end = list.lastElementChild.getBoundingClientRect();
  handle.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    pointerId: 41,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    clientX: start.left + start.width / 2,
    clientY: start.top + start.height / 2
  }));
  handle.dispatchEvent(new PointerEvent('pointermove', {
    bubbles: true,
    pointerId: 41,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    clientX: start.left + start.width / 2,
    clientY: end.bottom + 10
  }));
  handle.dispatchEvent(new PointerEvent('pointerup', {
    bubbles: true,
    pointerId: 41,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    clientX: start.left + start.width / 2,
    clientY: end.bottom + 10
  }));
  const pointerMoved = list.lastElementChild.dataset.item === firstItem;
  const liveAnnouncement = document.querySelector('.sort-list + [aria-live="polite"]')?.textContent || '';
  const touchAction = getComputedStyle(handle).touchAction;
  const rows = Array.from(list.children);
  task.items.forEach((item) => list.append(rows.find((row) => row.dataset.item === item)));
  document.querySelector('#answer-area .button.primary').click();
  return {
    pointerMoved,
    liveAnnouncement,
    touchAction,
    itemCount: task.items.length,
    moveButtons: document.querySelectorAll('.sort-actions .button').length,
    nextEnabled: !document.getElementById('next-task').disabled,
    progress: document.getElementById('task-progress').value
  };
})()`);
assert(result.pointerMoved && result.touchAction === "none", "Griffbasierte Touch-Sortierung schlägt fehl.");
assert(result.liveAnnouncement.includes("Position") && result.moveButtons === result.itemCount * 2, "Positionsansage oder Verschiebeschaltflächen der Sortierung fehlen.");
assert(result.nextEnabled && result.progress === 1, "Prüfung der Sortierreihenfolge schlägt fehl.");

await navigate("paket-04-frankreich-in-der-krise.html", 360, 900);
result = await evaluate(`(() => {
  document.querySelector('[data-level="M"]').click();
  const check = document.querySelector('#answer-area .button.primary');
  check.click();
  const blocked = document.getElementById('next-task').disabled;
  const task = PACKAGE.tasks.filter((item) => item.levels.includes('M'))[0];
  const textarea = document.querySelector('#answer-area textarea');
  textarea.value = 'Ursache und Folge werden mit einem Materialbeleg verbunden. '.repeat(Math.ceil(task.minChars / 55) + 1);
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  document.querySelectorAll('#answer-area input[type="checkbox"]').forEach((input) => { input.checked = true; });
  check.click();
  return { blocked, nextEnabled: !document.getElementById('next-task').disabled, progress: document.getElementById('task-progress').value };
})()`);
assert(result.blocked && result.nextEnabled && result.progress === 1, "Kriterienbasierte Textinteraktion schlägt fehl.");

await navigate("paket-10-die-revolution-von-1848.html", 320, 900);
result = await evaluate(`({
  tasksVisible: !document.getElementById('tasks-view').hidden,
  planNodes: document.querySelectorAll('#plan-view, .plan-phase, #tab-plan').length,
  overflow: document.documentElement.scrollWidth > window.innerWidth
})`);
assert(result.tasksVisible && result.planNodes === 0, "Paket 10 enthält noch eine Verlaufsplan-Ansicht.");
assert(!result.overflow, "Paket 10 erzeugt bei 320px horizontalen Überlauf.");

assert(exceptions.length === 0, `Browser-Ausnahmen: ${exceptions.join("; ")}`);
console.log("Browser-QA bestanden: 320/360px ohne horizontalen Überlauf; alle zehn Pakete laden; griffbasierte Touch-Sortierung samt Schaltflächen, M→R→E-Freischaltung, Persistenz, Reset, Choice, Match und Textkriterien funktionieren.");

await send("Browser.close");
socket.close();
