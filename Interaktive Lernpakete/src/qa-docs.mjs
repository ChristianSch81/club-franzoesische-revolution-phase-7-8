import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sourceDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(sourceDir, "..", "..");
const docsDir = path.join(projectDir, "docs");
const packageDir = path.join(docsDir, "pakete");
const materialDir = path.join(docsDir, "material");
const assetsDir = path.join(docsDir, "assets");

const fail = (message) => {
  console.error(`Docs-QA fehlgeschlagen: ${message}`);
  process.exit(1);
};

const htmlFiles = [
  path.join(docsDir, "index.html"),
  ...fs.readdirSync(packageDir)
    .filter((name) => name.endsWith(".html"))
    .sort()
    .map((name) => path.join(packageDir, name)),
];

if (htmlFiles.length !== 11) {
  fail(`11 HTML-Dateien erwartet, ${htmlFiles.length} gefunden.`);
}

const pdfFiles = fs.readdirSync(materialDir).filter((name) => name.endsWith(".pdf"));
if (pdfFiles.length !== 10) {
  fail(`10 PDF-Materialien erwartet, ${pdfFiles.length} gefunden.`);
}

for (const assetName of ["revolution.jpg", "asw-logo.png"]) {
  const assetPath = path.join(assetsDir, assetName);
  if (!fs.existsSync(assetPath) || fs.statSync(assetPath).size === 0) {
    fail(`Bilddatei fehlt oder ist leer: assets/${assetName}`);
  }
}

const schoolUrl = "https://asw-wutoeschingen.de";
const overview = fs.readFileSync(path.join(docsDir, "index.html"), "utf8");
const packageCards = overview.match(/class="package-card"/g) ?? [];

if (packageCards.length !== 10) fail("Die Übersicht enthält nicht genau 10 Paketkarten.");
if (overview.includes('class="level-counts"') || /M8\s*[·:]\s*\d/.test(overview)) {
  fail("Die Übersicht enthält noch Aufgabenzahlen nach Niveaustufe.");
}
if (!overview.includes('url("assets/revolution.jpg")')) fail("Das Hintergrundbild ist nicht eingebunden.");
const overlayMatch = overview.match(/--overlay:\s*rgba\([^;]+,\s*([\d.]+)\);/);
if (!overlayMatch || Number(overlayMatch[1]) > 0.7) {
  fail("Das Hintergrundbild wird von der hellen Überlagerung zu stark verdeckt.");
}
if (!overview.includes(schoolUrl)) fail("Die ASW-Webseite ist in der Übersicht nicht verlinkt.");
if (!overview.includes('src="assets/asw-logo.png"')) fail("Das ASW-Logo fehlt in der Übersicht.");
if (!overview.includes("font-size: clamp(1rem")) fail("Die lesbare Basisschriftgröße ist nicht abgesichert.");
if (!overview.includes("@media (max-width: 860px)")) fail("Die responsive Tablet-Darstellung fehlt.");

for (const htmlPath of htmlFiles.slice(1)) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const name = path.basename(htmlPath);
  if (!html.includes(schoolUrl)) fail(`ASW-Link fehlt in ${name}.`);
  if (!html.includes('src="../assets/asw-logo.png"')) fail(`ASW-Logo fehlt in ${name}.`);
  if (!html.includes('href="../index.html"')) fail(`Rücklink zur Übersicht fehlt in ${name}.`);
  if (!html.includes('href="../material/')) fail(`Materiallink fehlt in ${name}.`);
  if (!html.includes('class="button material-link"')) fail(`Grüner Materialbutton fehlt in ${name}.`);
  if (html.includes("Inputverlaufsplan")) fail(`Verlaufsplanung darf nicht in ${name} stehen.`);
  if (html.includes("Offline-Lernbegleiter zur Unterrichtsreihe")) fail(`Der entfernte Offline-Hinweis steht noch in ${name}.`);
}

for (const htmlPath of htmlFiles) {
  const html = fs.readFileSync(htmlPath, "utf8");
  if (/file:\/\/\/|C:\\Users\\/i.test(html)) {
    fail(`Absoluter lokaler Pfad in ${path.relative(docsDir, htmlPath)} gefunden.`);
  }

  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (/^(?:https?:|mailto:|#|data:)/i.test(reference)) continue;
    const cleanReference = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
    const resolved = path.resolve(path.dirname(htmlPath), cleanReference);
    if (!resolved.startsWith(docsDir + path.sep)) {
      fail(`Link verlässt docs: ${reference} in ${path.relative(docsDir, htmlPath)}.`);
    }
    if (!fs.existsSync(resolved)) {
      fail(`Linkziel fehlt: ${reference} in ${path.relative(docsDir, htmlPath)}.`);
    }
  }
}

console.log("Docs-QA bestanden: Übersicht, 10 Lernpakete, 10 PDFs, Bildassets, ASW-Link, responsive Typografie und alle lokalen Links geprüft.");
