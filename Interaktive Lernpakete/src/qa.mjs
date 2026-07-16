import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = dirname(here);
const expectedFiles = [
  "index.html",
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
const requiredPackageIds = [
  "main", "tasks-view", "level-chooser",
  "task-workspace", "active-level-label", "task-session", "completion-view", "task-progress",
  "progress-text", "attempt-progress", "attempt-progress-text", "task-tag", "task-position", "task-title", "task-prompt", "material-box",
  "task-material", "answer-area", "feedback", "prev-task", "next-task", "completion-title",
  "completion-text", "review-level", "choose-level-after", "start-next-level", "change-level",
  "reset-progress", "reset-status", "count-M", "count-R", "count-E",
  "level-status-M", "level-status-R", "level-status-E",
  "level-detail-M", "level-detail-R", "level-detail-E",
  "level-progress-M", "level-progress-R", "level-progress-E"
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function extractAttributes(html, attribute) {
  const matches = [];
  const regex = new RegExp(`${attribute}=["']([^"']+)["']`, "g");
  for (const match of html.matchAll(regex)) matches.push(match[1]);
  return matches;
}

function extractScripts(html) {
  return Array.from(html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi), (match) => match[1]);
}

for (const filename of expectedFiles) {
  const path = join(outputDir, filename);
  assert(existsSync(path), `${filename}: Datei fehlt.`);
  const html = await readFile(path, "utf8");
  const info = await stat(path);
  assert(info.size < 2_000_000, `${filename}: Datei ist größer als 2 MB.`);
  assert(/^<!doctype html>/i.test(html), `${filename}: doctype fehlt.`);
  assert(/<html\s+lang="de">/i.test(html), `${filename}: Sprache de fehlt.`);
  assert(/<meta\s+name="viewport"/i.test(html), `${filename}: viewport fehlt.`);
  assert(!/https?:\/\//i.test(html), `${filename}: enthält eine externe URL.`);
  assert(!/\bfetch\s*\(|XMLHttpRequest|WebSocket/i.test(html), `${filename}: enthält eine Netzwerkschnittstelle.`);
  assert((html.match(/Geschichte Phase 7\/8: Die Französische Revolution/g) || []).length === 1, `${filename}: Reihen-Kopfzeile fehlt oder ist doppelt.`);
  assert((html.match(/Autor: Christian Schwend/g) || []).length === 1, `${filename}: Autorennennung fehlt oder ist doppelt.`);
  if (filename === "index.html") {
    assert(!/M8:\s*\d+\s*·\s*R8:\s*\d+\s*·\s*E8:\s*\d+/.test(html), `${filename}: enthält noch Aufgabenzahlen nach Niveaustufe.`);
    assert((html.match(/class="package-preview"/g) || []).length === 9, `${filename}: neun Paketbilder erwartet.`);
  }
  if (filename.startsWith("paket-")) {
    assert((html.match(/class="button material-link"/g) || []).length === 1, `${filename}: grüner Link zum analogen Lernpaket fehlt oder ist doppelt.`);
  }
  assert(!/Alternativer Inputverlaufsplan|Inputverlaufsplan|Verlaufsplan|\binputPlan\b|plan-view|tab-plan/i.test(html), `${filename}: enthält noch Verlaufsplanung.`);

  const ids = extractAttributes(html, "id");
  assert(ids.length === new Set(ids).size, `${filename}: doppelte statische IDs.`);

  const scripts = extractScripts(html);
  scripts.forEach((script, index) => {
    try {
      new vm.Script(script, { filename: `${filename}:script-${index + 1}` });
    } catch (error) {
      throw new Error(`${filename}: JavaScript-Syntaxfehler: ${error.message}`);
    }
  });

  const hrefs = extractAttributes(html, "href");
  for (const href of hrefs) {
    if (href.startsWith("#") || /^\w+:/.test(href)) continue;
    const target = decodeURIComponent(href.split("#")[0]);
    assert(existsSync(resolve(outputDir, target)), `${filename}: lokales Linkziel fehlt: ${href}`);
  }

  if (filename === "index.html") {
    assert(scripts.length === 0, "index.html: unerwartetes JavaScript.");
    const packageLinks = hrefs.filter((href) => /^paket-\d{2}-.*\.html$/.test(href));
    assert(new Set(packageLinks).size === 10, `index.html: erwartet Links zu 10 verschiedenen Paketen, erhalten ${new Set(packageLinks).size}.`);
    assert(packageLinks.length === 19, `index.html: erwartet 10 Schaltflächen- und 9 Bildlinks, erhalten ${packageLinks.length}.`);
    assert(html.includes("mindestens 80&nbsp;% erfolgreich"), "index.html: Erklärung des 80-%-Lernpfads fehlt.");
  } else {
    assert(scripts.length === 2, `${filename}: erwartet zwei eingebettete Skripte, erhalten ${scripts.length}.`);
    requiredPackageIds.forEach((id) => assert(ids.includes(id), `${filename}: erforderliche ID ${id} fehlt.`));
    assert((html.match(/<button[^>]*data-level="[MRE]"/g) || []).length === 3, `${filename}: drei Niveaustufen-Schaltflächen fehlen.`);
    assert((html.match(/<article[^>]*data-level-card="[MRE]"/g) || []).length === 3, `${filename}: drei Lernpfadkarten fehlen.`);
    assert((html.match(/data-level="[RE]"[^>]*disabled/g) || []).length === 2, `${filename}: R8 und E8 sind im Ausgangszustand nicht gesperrt.`);
    assert(html.includes("alle Aufgaben der vorherigen Stufe mindestens einmal bearbeitet"), `${filename}: Bearbeitungsbedingung des Lernpfads fehlt.`);
    assert(html.includes("const PACKAGE ="), `${filename}: eingebettete Paketdaten fehlen.`);
    const sandbox = {};
    vm.runInNewContext(`${scripts[0]}; this.__package = PACKAGE;`, sandbox);
    assert(sandbox.__package && Array.isArray(sandbox.__package.tasks), `${filename}: Paketdaten sind nicht auswertbar.`);
    assert(!Object.hasOwn(sandbox.__package, "inputPlan"), `${filename}: inputPlan ist weiterhin eingebettet.`);
    for (const level of ["M", "R", "E"]) {
      const total = sandbox.__package.tasks.filter((task) => task.levels.includes(level)).length;
      const required = Math.ceil(total * 0.8);
      assert(total > 0 && required > 0 && required <= total, `${filename}: ungültige 80-%-Schwelle für ${level}8.`);
    }
  }
}

const runtime = await readFile(join(here, "app.js"), "utf8");
const styles = await readFile(join(here, "styles.css"), "utf8");
assert(!/Inputverlaufsplan|Verlaufsplan|\binputPlan\b|plan-view|tab-plan/i.test(runtime), "app.js enthält noch Verlaufsplan-Runtime.");
assert(/const PASS_RATIO = 0\.8;/.test(runtime), "app.js: 80-%-Schwelle fehlt.");
assert(/progress\.attempted === progress\.total && progress\.passed >= progress\.required/.test(runtime), "app.js: Freischaltung prüft nicht Bearbeitung und Erfolgsquote.");
assert(/function recordUnsuccessfulAttempt/.test(runtime), "app.js: wiederholbare Fehlversuche fehlen.");
assert(/handle\.addEventListener\("pointerdown"/.test(runtime), "app.js: griffbasierte Pointer-Sortierung fehlt.");
assert(/event\.isPrimary/.test(runtime), "app.js: Pointer-Sortierung prüft den primären Zeiger nicht.");
assert(/lostpointercapture/.test(runtime), "app.js: Aufräumen bei verlorenem Pointer-Capture fehlt.");
assert(/Karte an Position \$\{position\}/.test(runtime), "app.js: Positionsansage der Sortierung fehlt.");
assert(!/addEventListener\("dragstart"|\.draggable\s*=\s*true/.test(runtime), "app.js: alte HTML5-Drag-and-drop-Logik ist noch aktiv.");
assert(/\.sort-handle\s*\{[\s\S]*?touch-action:\s*none;/.test(styles), "styles.css: touch-action none am Sortiergriff fehlt.");
assert(/\.sort-handle\s*\{[\s\S]*?min-height:\s*2\.75rem;/.test(styles), "styles.css: ausreichend große Touch-Zielfläche am Sortiergriff fehlt.");
const queriedIds = Array.from(runtime.matchAll(/byId\(["'`]([^"'`]+)["'`]\)/g), (match) => match[1]);
const dynamicIdPrefixes = new Set(["count-"]);
for (const id of queriedIds) {
  if (id.includes("${")) continue;
  const exists = requiredPackageIds.includes(id) || Array.from(dynamicIdPrefixes).some((prefix) => id.startsWith(prefix));
  assert(exists, `app.js fragt unbekannte statische ID ab: ${id}`);
}

console.log(`QA bestanden: ${expectedFiles.length} HTML-Dateien; Touch-Sortierung, 80-%-Lernpfad, Kopfzeile, Autor, planfreie Paketdaten, lokale Links, IDs, JavaScript-Syntax und Offline-Betrieb geprüft.`);
