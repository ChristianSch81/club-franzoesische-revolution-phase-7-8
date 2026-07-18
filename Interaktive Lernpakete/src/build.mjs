import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { packages as packages13 } from "./packages-1-3.mjs";
import { packages as packages46 } from "./packages-4-6.mjs";
import { packages as packages710 } from "./packages-7-10.mjs";
import { renderProgressDashboard, serializeProgressConfig } from "./dashboard.mjs";
import { renderFinalTestDocument } from "./final-test.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = dirname(here);
const styles = await readFile(join(here, "styles.css"), "utf8");
const runtime = await readFile(join(here, "app.js"), "utf8");
const dashboardStyles = await readFile(join(here, "dashboard.css"), "utf8");
const dashboardRuntime = await readFile(join(here, "dashboard.js"), "utf8");
const finalTestStyles = await readFile(join(here, "final-test.css"), "utf8");
const finalTestRuntime = await readFile(join(here, "final-test.js"), "utf8");
const expectedTaskCounts = new Map([[1, 14], [2, 6], [3, 7], [4, 7], [5, 7], [6, 7], [7, 8], [8, 7], [9, 8], [10, 8]]);
const expectedTaskNumbers = new Map([
  [1, [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15]],
  [2, [1, 2, 3, 4, 5, 6]],
  [3, [1, 2, 3, 4, 5, 6, 7]],
  [4, [1, 2, 3, 4, 5, 6, 7]],
  [5, [1, 2, 3, 4, 5, 6, 7]],
  [6, [1, 2, 3, 4, 5, 6, 7]],
  [7, [1, 2, 3, 4, 5, 6, 7, 8]],
  [8, [1, 2, 3, 4, 5, 6, 7]],
  [9, [1, 2, 3, 4, 5, 6, 7, 8]],
  [10, [1, 2, 3, 4, 5, 6, 7, 8]]
]);
const expectedLevelCounts = new Map([
  [1, { M: 6, R: 7, E: 3 }],
  [2, { M: 2, R: 3, E: 1 }],
  [3, { M: 5, R: 1, E: 1 }],
  [4, { M: 2, R: 4, E: 1 }],
  [5, { M: 3, R: 3, E: 1 }],
  [6, { M: 3, R: 3, E: 1 }],
  [7, { M: 6, R: 2, E: 1 }],
  [8, { M: 3, R: 2, E: 2 }],
  [9, { M: 4, R: 3, E: 1 }],
  [10, { M: 4, R: 3, E: 1 }]
]);
const validLevels = new Set(["M", "R", "E"]);
const validKinds = new Set(["choice", "match", "order", "text"]);

const sourceFiles = new Map([
  [1, "../Pakete/1. Die Welt des _Sonnenkönigs_.pdf"],
  [2, "../Pakete/2. Die Idee der Aufklärung.pdf"],
  [3, "../Pakete/3. Die Ständeordnung.pdf"],
  [4, "../Pakete/4. Frankreich in der Krise.pdf"],
  [5, "../Pakete/5. Der Beginn der Revolution.pdf"],
  [6, "../Pakete/6. Die Erklärung der Menschenrechte.pdf"],
  [7, "../Pakete/7. Frankreich auf dem Weg zur Republik.pdf"],
  [8, "../Pakete/8. Die Napoleonische Herrschaft.pdf"],
  [9, "../Pakete/9. Vom Wiener Kongress zum Hambacher Fest.pdf"],
  [10, "../Pakete/10. Die Revolution von 1848.pdf"]
]);

const overviewImages = new Map([
  [1, { file: "paket-01-sonnenkoenig.jpg", alt: "Porträt Ludwigs XIV. im Krönungsornat" }],
  [2, { file: "paket-02-aufklaerung.jpg", alt: "Gesellschaftlicher Salon im Zeitalter der Aufklärung" }],
  [3, { file: "paket-03-staendeordnung.png", alt: "Ein Bauer trägt sinnbildlich die Last von Klerus und Adel" }],
  [4, { file: "paket-04-frankreich-krise.jpg", alt: "Darstellung hungernder Menschen während der Versorgungskrise" }],
  [5, { file: "paket-05-beginn-revolution.jpg", alt: "Die Bastille während der Französischen Revolution" }],
  [6, { file: "paket-06-menschenrechte.jpg", alt: "Darstellung der Erklärung der Menschen- und Bürgerrechte" }],
  [7, { file: "paket-07-weg-republik.jpeg", alt: "Ludwig XVI. auf dem Weg zu seiner Hinrichtung" }],
  [8, { file: "paket-08-napoleon.jpg", alt: "Porträt Napoleons in Uniform" }],
  [9, { file: "paket-09-wiener-kongress.jpeg", alt: "Die europäischen Vertreter beim Wiener Kongress" }],
  [10, { file: "paket-10-revolution-1848.jpg", alt: "Barrikade während der Revolution von 1848" }]
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateTask(task, packageNumber, seenIds) {
  const prefix = `Paket ${packageNumber}, Aufgabe ${task?.id || "ohne ID"}`;
  assert(task && typeof task === "object", `${prefix}: Aufgabe ist kein Objekt.`);
  assert(nonEmptyString(task.id), `${prefix}: id fehlt.`);
  assert(!seenIds.has(task.id), `${prefix}: doppelte Aufgaben-ID ${task.id}.`);
  seenIds.add(task.id);
  assert(nonEmptyString(String(task.number ?? "")), `${prefix}: number fehlt.`);
  assert(nonEmptyString(task.tag), `${prefix}: tag fehlt.`);
  assert(Array.isArray(task.levels) && task.levels.length > 0, `${prefix}: levels fehlen.`);
  assert(new Set(task.levels).size === task.levels.length, `${prefix}: levels enthält Dubletten.`);
  task.levels.forEach((level) => assert(validLevels.has(level), `${prefix}: unbekanntes Niveau ${level}.`));
  assert(validKinds.has(task.kind), `${prefix}: unbekannter Aufgabentyp ${task.kind}.`);
  assert(nonEmptyString(task.title), `${prefix}: title fehlt.`);
  assert(nonEmptyString(task.prompt), `${prefix}: prompt fehlt.`);
  assert(typeof task.material === "string", `${prefix}: material muss eine Zeichenkette sein.`);
  assert(nonEmptyString(task.hint), `${prefix}: hint fehlt.`);
  assert(nonEmptyString(task.success), `${prefix}: success fehlt.`);

  if (task.kind === "choice") {
    assert(typeof task.multiple === "boolean", `${prefix}: multiple muss true oder false sein.`);
    assert(Array.isArray(task.options) && task.options.length >= 2, `${prefix}: mindestens zwei Optionen erforderlich.`);
    task.options.forEach((option, index) => {
      assert(nonEmptyString(option?.text), `${prefix}: Text in Option ${index + 1} fehlt.`);
      assert(typeof option.correct === "boolean", `${prefix}: correct in Option ${index + 1} fehlt.`);
    });
    const correctCount = task.options.filter((option) => option.correct).length;
    assert(correctCount >= 1, `${prefix}: keine richtige Antwort markiert.`);
    if (!task.multiple) assert(correctCount === 1, `${prefix}: Einfachauswahl braucht genau eine richtige Antwort.`);
  }

  if (task.kind === "match") {
    assert(Array.isArray(task.items) && task.items.length >= 2, `${prefix}: mindestens zwei Zuordnungen erforderlich.`);
    assert(Array.isArray(task.choices) && task.choices.length >= 2, `${prefix}: choices fehlen.`);
    assert(task.choices.every(nonEmptyString), `${prefix}: leere Auswahlmöglichkeit.`);
    task.items.forEach((item, index) => {
      assert(nonEmptyString(item?.prompt), `${prefix}: prompt in Zuordnung ${index + 1} fehlt.`);
      assert(nonEmptyString(item?.answer), `${prefix}: answer in Zuordnung ${index + 1} fehlt.`);
      assert(task.choices.includes(item.answer), `${prefix}: Antwort "${item.answer}" fehlt in choices.`);
    });
  }

  if (task.kind === "order") {
    assert(Array.isArray(task.items) && task.items.length >= 2, `${prefix}: mindestens zwei Reihenfolgekarten erforderlich.`);
    assert(task.items.every(nonEmptyString), `${prefix}: leere Reihenfolgekarte.`);
    assert(new Set(task.items).size === task.items.length, `${prefix}: Reihenfolge enthält identische Karten.`);
  }

  if (task.kind === "text") {
    assert(Number.isInteger(task.minChars) && task.minChars >= 30, `${prefix}: minChars muss mindestens 30 sein.`);
    assert(typeof task.starter === "string", `${prefix}: starter muss eine Zeichenkette sein.`);
    assert(Array.isArray(task.planning) && task.planning.length >= 1 && task.planning.every(nonEmptyString), `${prefix}: planning fehlt.`);
    assert(Array.isArray(task.criteria) && task.criteria.length >= 2 && task.criteria.every(nonEmptyString), `${prefix}: mindestens zwei Kriterien erforderlich.`);
  }
}

function validatePackage(pkg, seenIds) {
  assert(pkg && typeof pkg === "object", "Paket ist kein Objekt.");
  assert(Number.isInteger(pkg.number) && expectedTaskCounts.has(pkg.number), `Ungültige Paketnummer ${pkg.number}.`);
  assert(nonEmptyString(pkg.id), `Paket ${pkg.number}: id fehlt.`);
  assert(nonEmptyString(pkg.slug), `Paket ${pkg.number}: slug fehlt.`);
  assert(nonEmptyString(pkg.title), `Paket ${pkg.number}: title fehlt.`);
  assert(nonEmptyString(pkg.subtitle), `Paket ${pkg.number}: subtitle fehlt.`);
  assert(nonEmptyString(pkg.focus) || (Array.isArray(pkg.focus) && pkg.focus.length > 0), `Paket ${pkg.number}: focus fehlt.`);
  assert(Array.isArray(pkg.tasks), `Paket ${pkg.number}: tasks fehlt.`);
  assert(pkg.tasks.length === expectedTaskCounts.get(pkg.number), `Paket ${pkg.number}: erwartet ${expectedTaskCounts.get(pkg.number)} einzigartige Aufgaben, erhalten ${pkg.tasks.length}.`);
  pkg.tasks.forEach((task) => validateTask(task, pkg.number, seenIds));
  const actualNumbers = pkg.tasks.map((task) => Number(task.number)).sort((a, b) => a - b);
  const expectedNumbers = expectedTaskNumbers.get(pkg.number);
  assert(JSON.stringify(actualNumbers) === JSON.stringify(expectedNumbers), `Paket ${pkg.number}: Aufgabennummern weichen ab. Erwartet ${expectedNumbers.join(", ")}, erhalten ${actualNumbers.join(", ")}.`);
  const levelCounts = Object.fromEntries(["M", "R", "E"].map((level) => [level, pkg.tasks.filter((task) => task.levels.includes(level)).length]));
  assert(JSON.stringify(levelCounts) === JSON.stringify(expectedLevelCounts.get(pkg.number)), `Paket ${pkg.number}: Niveauverteilung weicht ab. Erwartet ${JSON.stringify(expectedLevelCounts.get(pkg.number))}, erhalten ${JSON.stringify(levelCounts)}.`);

  assert(Array.isArray(pkg.inputPlan) && pkg.inputPlan.length >= 4, `Paket ${pkg.number}: inputPlan fehlt oder ist zu kurz.`);
  let total = 0;
  pkg.inputPlan.forEach((phase, index) => {
    const prefix = `Paket ${pkg.number}, Verlaufsphase ${index + 1}`;
    assert(Number.isInteger(phase.minutes) && phase.minutes > 0, `${prefix}: minutes ungültig.`);
    total += phase.minutes;
    ["phase", "teacherInput", "learnerActivity", "materials", "differentiation"].forEach((field) => {
      assert(nonEmptyString(phase[field]), `${prefix}: ${field} fehlt.`);
    });
  });
  assert(total === 180, `Paket ${pkg.number}: Verlaufsplan umfasst ${total} statt 180 Minuten.`);
}

function slugify(value) {
  return value
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function serializedPackage(pkg) {
  const { inputPlan: _inputPlan, ...deliveredPackage } = pkg;
  return JSON.stringify(deliveredPackage)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function packageDocument(pkg) {
  const packageNumber = String(pkg.number).padStart(2, "0");
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Interaktive Aufgaben zu Paket ${packageNumber}: ${escapeHtml(pkg.title)}">
  <title>Paket ${packageNumber}: ${escapeHtml(pkg.title)} · Französische Revolution</title>
  <style>${styles}</style>
</head>
<body>
  <a class="skip-link" href="#main">Zum Inhalt springen</a>
  <header class="site-header">
    <div class="header-inner">
      <p class="series-title">Geschichte Phase 7/8: Die Französische Revolution</p>
      <div class="header-topline no-print">
        <a class="button ghost" href="index.html">← Paketübersicht</a>
        <a class="button material-link" href="${escapeHtml(pkg.sourceFile)}" target="_blank" rel="noopener">Analoges Lernpaket (PDF)</a>
      </div>
      <p class="eyebrow">Paket ${packageNumber} · Interaktiver Lernbegleiter</p>
      <h1>${escapeHtml(pkg.title)}</h1>
      <p class="subtitle">${escapeHtml(pkg.subtitle)}</p>
    </div>
  </header>

  <main id="main" class="page">
    <section id="tasks-view" aria-labelledby="tasks-heading">
      <div id="level-chooser">
        <h2 id="tasks-heading">Euer Lernpfad durch die Niveaustufen</h2>
        <p>Beginnt mit dem Mindeststandard. Die nächste Stufe wird freigeschaltet, wenn alle Aufgaben der vorherigen Stufe mindestens einmal bearbeitet und mindestens 80&nbsp;% erfolgreich abgeschlossen wurden. Fehlversuche können jederzeit verbessert werden.</p>
        <div class="level-grid">
          <article class="level-card" data-level-card="M">
            <div class="level-card-head">
              <span class="badge">M8</span>
              <span id="level-status-M" class="level-status">Freigeschaltet</span>
            </div>
            <h3>Mindeststandard</h3>
            <p>Grundbegriffe sichern, Materialien erschließen und zentrale Zusammenhänge wiedergeben.</p>
            <p id="count-M" class="muted"></p>
            <div class="level-meter">
              <label class="sr-only" for="level-progress-M">Erfolgreiche Aufgaben im Mindeststandard</label>
              <progress id="level-progress-M" value="0" max="1"></progress>
              <p id="level-detail-M" class="level-detail"></p>
            </div>
            <button class="button primary" type="button" data-level="M" aria-describedby="level-detail-M">M8 starten</button>
          </article>
          <article class="level-card is-locked" data-level-card="R" aria-disabled="true">
            <div class="level-card-head">
              <span class="badge">R8</span>
              <span id="level-status-R" class="level-status">Noch gesperrt</span>
            </div>
            <h3>Regelstandard</h3>
            <p>Hintergründe rekonstruieren, Quellen erklären und begründete Zusammenhänge herstellen.</p>
            <p id="count-R" class="muted"></p>
            <div class="level-meter">
              <label class="sr-only" for="level-progress-R">Erfolgreiche Aufgaben im Regelstandard</label>
              <progress id="level-progress-R" value="0" max="1"></progress>
              <p id="level-detail-R" class="level-detail"></p>
            </div>
            <button class="button primary" type="button" data-level="R" aria-describedby="level-detail-R" disabled>R8 noch gesperrt</button>
          </article>
          <article class="level-card is-locked" data-level-card="E" aria-disabled="true">
            <div class="level-card-head">
              <span class="badge">E8</span>
              <span id="level-status-E" class="level-status">Noch gesperrt</span>
            </div>
            <h3>Expertenstandard</h3>
            <p>Urteile bilden, Perspektiven vergleichen und historische Einsichten auf neue Fälle übertragen.</p>
            <p id="count-E" class="muted"></p>
            <div class="level-meter">
              <label class="sr-only" for="level-progress-E">Erfolgreiche Aufgaben im Expertenstandard</label>
              <progress id="level-progress-E" value="0" max="1"></progress>
              <p id="level-detail-E" class="level-detail"></p>
            </div>
            <button class="button primary" type="button" data-level="E" aria-describedby="level-detail-E" disabled>E8 noch gesperrt</button>
          </article>
        </div>
        <div class="chooser-actions">
          <button id="reset-progress" class="button ghost" type="button">Fortschritt dieses Pakets zurücksetzen</button>
          <p id="reset-status" class="muted" role="status" aria-live="polite" hidden></p>
        </div>
      </div>

      <div id="task-workspace" hidden>
        <div class="task-meta">
          <span id="active-level-label" class="badge"></span>
          <button id="change-level" class="button ghost" type="button">Niveaustufe wechseln</button>
        </div>

        <div id="task-session">
          <div class="progress-grid">
            <div class="progress-block">
              <label id="attempt-progress-text" for="attempt-progress"></label>
              <progress id="attempt-progress" value="0" max="1"></progress>
            </div>
            <div class="progress-block">
              <label id="progress-text" for="task-progress"></label>
              <progress id="task-progress" value="0" max="1"></progress>
            </div>
          </div>

          <article class="task-card">
            <div class="task-meta">
              <span id="task-tag" class="badge"></span>
              <span id="task-position" class="task-position"></span>
            </div>
            <h2 id="task-title"></h2>
            <p id="task-prompt"></p>
            <div id="material-box" class="material-box" hidden>
              <strong>Materialgrundlage</strong>
              <p id="task-material"></p>
            </div>
            <div id="answer-area" class="answer-area"></div>
            <div id="feedback" class="feedback" role="status" aria-live="polite" hidden></div>
          </article>

          <div class="task-nav">
            <button id="prev-task" class="button" type="button">← Vorherige Aufgabe</button>
            <button id="next-task" class="button primary" type="button">Nächste Aufgabe</button>
          </div>
        </div>

        <section id="completion-view" class="completion-box" hidden>
          <h2 id="completion-title"></h2>
          <p id="completion-text"></p>
          <p class="muted">Offene Arbeitsprodukte werden anhand der angegebenen Kriterien selbst geprüft; für eine inhaltliche Rückmeldung nutzt ihr Material, Lösung oder Lehrkraftfeedback.</p>
          <div class="action-row">
            <button id="review-level" class="button" type="button">Aufgaben noch einmal ansehen</button>
            <button id="choose-level-after" class="button" type="button">Zur Stufenübersicht</button>
            <button id="start-next-level" class="button primary" type="button" hidden>Nächste Niveaustufe starten</button>
          </div>
        </section>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <p class="footer-author">Autor: Christian Schwend</p>
    </div>
  </footer>
  <script>const PACKAGE = ${serializedPackage(pkg)};</script>
  <script>${runtime}</script>
</body>
</html>`;
}

function indexDocument(packages) {
  const totalTasks = packages.reduce((sum, pkg) => sum + pkg.tasks.length, 0);
  const dashboard = renderProgressDashboard(packages, "abschlusstest.html");
  const progressConfig = serializeProgressConfig(packages);
  const cards = packages.map((pkg) => {
    const number = String(pkg.number).padStart(2, "0");
    const focus = Array.isArray(pkg.focus) ? pkg.focus.join(" · ") : pkg.focus;
    const image = overviewImages.get(pkg.number);
    const imageMarkup = image
      ? `
        <a class="package-preview-link" href="${escapeHtml(pkg.filename)}" aria-label="${escapeHtml(pkg.title)} öffnen">
          <img class="package-preview" src="assets/overview/${escapeHtml(image.file)}" alt="${escapeHtml(image.alt)}" width="204" height="136" loading="lazy">
        </a>`
      : "";
    return `<article class="package-card">
      <p class="eyebrow">Paket ${number}</p>
      <div class="package-title-row">
        <h2>${escapeHtml(pkg.title)}</h2>${imageMarkup}
      </div>
      <p>${escapeHtml(pkg.subtitle)}</p>
      <p class="muted">${escapeHtml(focus)}</p>
      <div class="index-meta">
        <span class="badge">${pkg.tasks.length} Aufgaben</span>
      </div>
      <div class="action-row">
        <a class="button primary" href="${escapeHtml(pkg.filename)}">Paket öffnen</a>
      </div>
    </article>`;
  }).join("\n");

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Zehn interaktive Offline-Lernpakete zur Französischen Revolution für Geschichte Klasse 7/8">
  <title>Interaktive Lernpakete · Französische Revolution</title>
  <style>${styles}
${dashboardStyles}</style>
</head>
<body>
  <a class="skip-link" href="#main">Zum Inhalt springen</a>
  <header class="site-header">
    <div class="header-inner">
      <p class="series-title">Geschichte Phase 7/8: Die Französische Revolution</p>
      <h1>Interaktive Lernpakete</h1>
      <p class="subtitle">Zehn offline nutzbare Einheiten mit ${totalTasks} differenzierten Aufgaben für Mindest-, Regel- und Expertenstandard.</p>
    </div>
  </header>

  <main id="main" class="page">
    <section class="index-intro" aria-labelledby="start-heading">
      <h2 id="start-heading">So arbeitet ihr mit der Sammlung</h2>
      <p>Öffnet ein Paket und beginnt mit dem Mindeststandard. Sobald alle Aufgaben einer Stufe mindestens einmal bearbeitet und davon mindestens 80&nbsp;% erfolgreich abgeschlossen wurden, wird die nächste Stufe freigeschaltet. Zuordnungen, Auswahlaufgaben und Sortierkarten geben unmittelbare Rückmeldung; offene Aufgaben werden mit Kriterien selbst geprüft.</p>
    </section>

    <section class="standard-key" aria-label="Niveaustufen">
      <article class="key-item"><span class="badge">M8</span><h3>Mindeststandard</h3><p>Grundwissen sichern und zentrale Aussagen materialgestützt wiedergeben.</p></article>
      <article class="key-item"><span class="badge">R8</span><h3>Regelstandard</h3><p>Hintergründe rekonstruieren und Zusammenhänge begründet erklären.</p></article>
      <article class="key-item"><span class="badge">E8</span><h3>Expertenstandard</h3><p>Historische Urteile bilden, transferieren und eigene Produkte gestalten.</p></article>
    </section>

    ${dashboard}

    <section aria-labelledby="packages-heading">
      <h2 id="packages-heading">Paketübersicht</h2>
      <div class="package-grid">
        ${cards}
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <p class="footer-author">Autor: Christian Schwend</p>
    </div>
  </footer>
  <script>const PROGRESS_CONFIG = ${progressConfig};</script>
  <script>${dashboardRuntime}</script>
</body>
</html>`;
}

const allPackages = [...packages13, ...packages46, ...packages710].sort((a, b) => a.number - b.number);
assert(allPackages.length === 10, `Erwartet 10 Pakete, erhalten ${allPackages.length}.`);
assert(new Set(allPackages.map((pkg) => pkg.number)).size === 10, "Paketnummern sind nicht eindeutig.");
const seenIds = new Set();
allPackages.forEach((pkg) => validatePackage(pkg, seenIds));
assert(seenIds.size === 79, `Erwartet 79 einzigartige Aufgaben, erhalten ${seenIds.size}.`);

const preparedPackages = allPackages.map((pkg) => {
  const number = String(pkg.number).padStart(2, "0");
  const filename = `paket-${number}-${slugify(pkg.slug)}.html`;
  return { ...pkg, sourceFile: sourceFiles.get(pkg.number), filename };
});

for (const pkg of preparedPackages) {
  await writeFile(join(outputDir, pkg.filename), packageDocument(pkg), "utf8");
}
await writeFile(join(outputDir, "index.html"), indexDocument(preparedPackages), "utf8");
await writeFile(join(outputDir, "abschlusstest.html"), renderFinalTestDocument({
  styles: finalTestStyles,
  runtime: finalTestRuntime,
  homeHref: "index.html",
  constitutionSrc: "assets/abschluss/verfassung-1791.png",
  portraitSrc: "assets/overview/paket-01-sonnenkoenig.jpg",
  logoSrc: "assets/asw-logo.png"
}), "utf8");

console.log(`Erstellt: index.html, abschlusstest.html und ${preparedPackages.length} Paketdateien mit ${seenIds.size} Aufgaben.`);
for (const pkg of preparedPackages) {
  const counts = ["M", "R", "E"].map((level) => `${level}:${pkg.tasks.filter((task) => task.levels.includes(level)).length}`).join(" ");
  console.log(`Paket ${String(pkg.number).padStart(2, "0")}: ${pkg.tasks.length} Aufgaben (${counts}) → ${pkg.filename}`);
}
