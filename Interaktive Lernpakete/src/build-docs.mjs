import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { packages as packages13 } from "./packages-1-3.mjs";
import { packages as packages46 } from "./packages-4-6.mjs";
import { packages as packages710 } from "./packages-7-10.mjs";
import { renderProgressDashboard, serializeProgressConfig } from "./dashboard.mjs";
import { renderFinalTestDocument } from "./final-test.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const interactiveDir = resolve(here, "..");
const projectRoot = resolve(interactiveDir, "..");
const docsDir = join(projectRoot, "docs");
const packageDir = join(docsDir, "pakete");
const materialDir = join(docsDir, "material");
const assetDir = join(docsDir, "assets");
const dashboardStyles = await readFile(join(here, "dashboard.css"), "utf8");
const dashboardRuntime = await readFile(join(here, "dashboard.js"), "utf8");
const finalTestStyles = await readFile(join(here, "final-test.css"), "utf8");
const finalTestRuntime = await readFile(join(here, "final-test.js"), "utf8");

const schoolUrl = "https://asw-wutoeschingen.de";
const sourceFiles = new Map([
  [1, "1. Die Welt des _Sonnenkönigs_.pdf"],
  [2, "2. Die Idee der Aufklärung.pdf"],
  [3, "3. Die Ständeordnung.pdf"],
  [4, "4. Frankreich in der Krise.pdf"],
  [5, "5. Der Beginn der Revolution.pdf"],
  [6, "6. Die Erklärung der Menschenrechte.pdf"],
  [7, "7. Frankreich auf dem Weg zur Republik.pdf"],
  [8, "8. Die Napoleonische Herrschaft.pdf"],
  [9, "9. Vom Wiener Kongress zum Hambacher Fest.pdf"],
  [10, "10. Die Revolution von 1848.pdf"]
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

const allPackages = [...packages13, ...packages46, ...packages710].sort((a, b) => a.number - b.number);
assert(allPackages.length === 10, `Erwartet 10 Pakete, erhalten ${allPackages.length}.`);

const preparedPackages = allPackages.map((pkg) => ({
  ...pkg,
  filename: `paket-${String(pkg.number).padStart(2, "0")}-${slugify(pkg.slug)}.html`
}));

const pageStyles = `
:root {
  color-scheme: light dark;
  --page-width: 76rem;
  --ink: #2d241d;
  --muted: #66584d;
  --paper: rgba(255, 252, 247, 0.94);
  --paper-strong: #fffdf9;
  --header: rgba(208, 178, 141, 0.96);
  --header-border: #967353;
  --accent: #7c2d2d;
  --accent-dark: #5c1f1f;
  --blue: #234a73;
  --line: rgba(76, 54, 38, 0.22);
  --overlay: rgba(249, 246, 240, 0.58);
  --shadow: 0 0.7rem 2rem rgba(54, 38, 25, 0.13);
  --radius: 1rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --ink: #fbf3e8;
    --muted: #ddcfc0;
    --paper: rgba(42, 34, 28, 0.94);
    --paper-strong: #302720;
    --header: rgba(92, 67, 46, 0.97);
    --header-border: #b18b67;
    --accent: #d78b84;
    --accent-dark: #f0aaa2;
    --blue: #91b9df;
    --line: rgba(241, 222, 202, 0.22);
    --overlay: rgba(25, 21, 18, 0.72);
    --shadow: 0 0.7rem 2rem rgba(0, 0, 0, 0.3);
  }
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  min-height: 100vh;
  margin: 0;
  background-color: #eee5d9;
  background-image: linear-gradient(var(--overlay), var(--overlay)), url("assets/revolution.jpg");
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  color: var(--ink);
  font-family: "Segoe UI", Aptos, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(1rem, 0.25vw + 0.98rem, 1.125rem);
  line-height: 1.65;
}

a { color: inherit; }

a:focus-visible {
  outline: 0.2rem solid var(--blue);
  outline-offset: 0.22rem;
}

h1, h2, h3, p { margin-block-start: 0; }
h1, h2, h3, strong { font-weight: 650; }

.skip-link {
  position: absolute;
  inset-inline-start: 1rem;
  inset-block-start: -8rem;
  z-index: 10;
  padding: 0.65rem 1rem;
  border-radius: 0.5rem;
  background: var(--accent-dark);
  color: #fff;
}

.skip-link:focus { inset-block-start: 1rem; }

.site-header {
  border-block-end: 1px solid var(--header-border);
  background: var(--header);
  box-shadow: 0 0.3rem 1.2rem rgba(59, 39, 24, 0.12);
}

.header-inner,
.page,
.footer-inner {
  width: min(100% - 2rem, var(--page-width));
  margin-inline: auto;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding-block: 1.25rem;
}

.brand-copy { max-width: 58rem; }

.eyebrow {
  margin-block-end: 0.3rem;
  color: var(--accent-dark);
  font-size: 0.94rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.site-header h1 {
  margin-block-end: 0.45rem;
  font-size: clamp(2rem, 5vw, 3.55rem);
  line-height: 1.08;
  text-wrap: balance;
}

.subtitle {
  max-width: 66ch;
  margin: 0;
  color: #4c3828;
  font-size: clamp(1.05rem, 1.8vw, 1.25rem);
}

@media (prefers-color-scheme: dark) {
  .subtitle { color: #f2dfca; }
}

.asw-logo-link {
  display: grid;
  flex: 0 0 auto;
  width: 6.2rem;
  height: 5.6rem;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(72, 50, 32, 0.24);
  border-radius: 0.85rem;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0.35rem 1rem rgba(61, 40, 24, 0.12);
}

.asw-logo {
  display: block;
  width: 5.4rem;
  height: 4.9rem;
  object-fit: contain;
}

.tricolor {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 0.32rem;
}

.tricolor span:nth-child(1) { background: #244a79; }
.tricolor span:nth-child(2) { background: #f8f4ec; }
.tricolor span:nth-child(3) { background: #a83b3b; }

.page { padding-block: clamp(1.5rem, 4vw, 3rem); }

.intro-card {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(17rem, 0.7fr);
  gap: 1.5rem;
  align-items: center;
  margin-block-end: 2.2rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid #9bcfbd;
  border-inline-start: 0.42rem solid #2f8f73;
  border-radius: var(--radius);
  background: #eaf7f2;
  box-shadow: 0 0.35rem 1.1rem rgba(35, 105, 84, 0.1);
  backdrop-filter: blur(7px);
}

.intro-card h2 {
  margin-block-end: 0.65rem;
  font-size: clamp(1.55rem, 3vw, 2.2rem);
  line-height: 1.2;
  color: #176b56;
}

.intro-card p:last-child { margin-block-end: 0; }

@media (prefers-color-scheme: dark) {
  .intro-card {
    border-color: #467d6c;
    border-inline-start-color: #72c5a8;
    background: #19372f;
  }

  .intro-card h2 { color: #9de0c8; }
}

.level-path {
  display: grid;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.level-path li {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
  padding: 0.72rem 0.85rem;
  border: 1px solid var(--line);
  border-radius: 0.75rem;
  background: var(--paper-strong);
}

.level-code {
  display: grid;
  width: 2.7rem;
  height: 2.7rem;
  place-items: center;
  border-radius: 999px;
  background: var(--accent-dark);
  color: #fff;
  font-weight: 700;
}

.level-path strong,
.level-path span { display: block; }
.level-path li div span { color: var(--muted); }
.level-path .level-code { color: #fff; }

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-block-end: 1.1rem;
}

.section-heading h2 {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
}

.section-heading p { margin: 0; color: var(--muted); }

.package-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.package-card {
  display: grid;
  grid-template-columns: 4.25rem minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
  min-width: 0;
  padding: 1.2rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--paper);
  box-shadow: 0 0.35rem 1.2rem rgba(60, 42, 29, 0.09);
  backdrop-filter: blur(6px);
}

.package-number {
  display: grid;
  width: 4.1rem;
  height: 4.1rem;
  place-items: center;
  border-radius: 0.85rem;
  background: linear-gradient(145deg, var(--blue), #376b9d);
  color: #fff;
  font-size: 1.35rem;
  font-weight: 700;
  box-shadow: 0 0.3rem 0.8rem rgba(27, 60, 91, 0.2);
}

.package-content { min-width: 0; }

.package-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.package-card h3 {
  flex: 1 1 auto;
  margin-block-end: 0.5rem;
  font-size: clamp(1.18rem, 2vw, 1.42rem);
  line-height: 1.25;
  text-wrap: balance;
}

.package-preview-link {
  display: block;
  flex: 0 0 8.5rem;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 0.7rem;
  background: var(--paper-strong);
  box-shadow: 0 0.25rem 0.75rem rgba(54, 38, 25, 0.14);
}

.package-preview {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  transition: transform 180ms ease;
}

.package-preview-link:hover .package-preview {
  transform: scale(1.04);
}

.package-preview-link:focus-visible {
  outline: 0.2rem solid var(--blue);
  outline-offset: 0.2rem;
}

.package-description {
  margin-block-end: 0.75rem;
  color: var(--muted);
}

.package-link {
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.65rem 0.9rem;
  border-radius: 0.65rem;
  background: var(--accent-dark);
  color: #fff;
  font-weight: 650;
  text-decoration: none;
  transition: transform 150ms ease, background 150ms ease;
}

.package-link:hover {
  background: var(--accent);
  transform: translateY(-1px);
}

.site-footer {
  border-block-start: 1px solid var(--line);
  background: rgba(244, 235, 224, 0.92);
}

@media (prefers-color-scheme: dark) {
  .site-footer { background: rgba(39, 31, 26, 0.94); }
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.6rem 1.5rem;
  padding-block: 1.1rem;
  color: var(--muted);
}

.footer-inner p { margin: 0; }
.footer-author { color: var(--ink); font-weight: 650; }

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 860px) {
  .intro-card { grid-template-columns: 1fr; }
  .package-grid { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  body { background-attachment: scroll; }
  .header-inner { align-items: flex-start; }
  .asw-logo-link { width: 5rem; height: 4.6rem; }
  .asw-logo { width: 4.4rem; height: 4rem; }
  .package-card { grid-template-columns: 3.4rem minmax(0, 1fr); padding: 1rem; }
  .package-number { width: 3.25rem; height: 3.25rem; font-size: 1.05rem; }
  .package-preview-link { flex-basis: 6.7rem; }
  .section-heading { align-items: flex-start; flex-direction: column; }
}

@media (max-width: 410px) {
  .header-inner { flex-direction: column-reverse; }
  .asw-logo-link { align-self: flex-end; }
  .package-card { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .package-link,
  .package-preview { transition: none; }
}
`;

function cardFor(pkg) {
  const number = String(pkg.number).padStart(2, "0");
  const image = overviewImages.get(pkg.number);
  const imageMarkup = image
    ? `
              <a class="package-preview-link" href="pakete/${escapeHtml(pkg.filename)}" aria-label="${escapeHtml(pkg.title)} öffnen">
                <img class="package-preview" src="assets/${escapeHtml(image.file)}" alt="${escapeHtml(image.alt)}" width="204" height="136" loading="lazy">
              </a>`
    : "";
  return `<article class="package-card">
          <div class="package-number" aria-hidden="true">${number}</div>
          <div class="package-content">
            <p class="eyebrow">Paket ${number}</p>
            <div class="package-title-row">
              <h3>${escapeHtml(pkg.title)}</h3>${imageMarkup}
            </div>
            <p class="package-description">${escapeHtml(pkg.subtitle)}</p>
            <a class="package-link" href="pakete/${escapeHtml(pkg.filename)}">Lernpaket öffnen <span aria-hidden="true">→</span></a>
          </div>
        </article>`;
}

function indexDocument() {
  const dashboard = renderProgressDashboard(preparedPackages, "abschlusstest.html");
  const progressConfig = serializeProgressConfig(preparedPackages);
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Interaktive Lernpakete zur Französischen Revolution für Geschichte Phase 7/8">
  <title>Club Französische Revolution · Phase 7/8</title>
  <style>${pageStyles}
${dashboardStyles}</style>
</head>
<body>
  <a class="skip-link" href="#main">Zum Inhalt springen</a>
  <header class="site-header">
    <div class="header-inner">
      <div class="brand-copy">
        <p class="eyebrow">Geschichte · Phase 7/8</p>
        <h1>Die Französische Revolution</h1>
        <p class="subtitle">Zehn interaktive Lernpakete – vom Absolutismus bis zur Revolution von 1848.</p>
      </div>
      <a class="asw-logo-link" href="${schoolUrl}" target="_blank" rel="noopener" aria-label="Website der Alemannenschule Wutöschingen öffnen">
        <img class="asw-logo" src="assets/asw-logo.png" alt="Logo der Alemannenschule Wutöschingen">
      </a>
    </div>
    <div class="tricolor" aria-hidden="true"><span></span><span></span><span></span></div>
  </header>

  <main id="main" class="page">
    <section class="intro-card" aria-labelledby="intro-title">
      <div>
        <p class="eyebrow">Dein Lernweg</p>
        <h2 id="intro-title">Wähle ein Lernpaket und beginne mit M8</h2>
        <p>Bearbeite zunächst den Mindeststandard. Sobald du alle Aufgaben einer Stufe mindestens einmal geprüft und mindestens 80&nbsp;% erfolgreich abgeschlossen hast, wird die nächste Stufe freigeschaltet. Deine Ergebnisse bleiben lokal in deinem Browser gespeichert.</p>
      </div>
      <ol class="level-path" aria-label="Reihenfolge der Niveaustufen">
        <li><span class="level-code">M8</span><div><strong>Mindeststandard</strong><span>Grundwissen sichern</span></div></li>
        <li><span class="level-code">R8</span><div><strong>Regelstandard</strong><span>Zusammenhänge erklären</span></div></li>
        <li><span class="level-code">E8</span><div><strong>Expertenstandard</strong><span>Urteilen und übertragen</span></div></li>
      </ol>
    </section>

    ${dashboard}

    <section aria-labelledby="packages-title">
      <div class="section-heading">
        <h2 id="packages-title">Lernpakete</h2>
        <p>Wähle das Thema deiner Unterrichtseinheit.</p>
      </div>
      <div class="package-grid">
        ${preparedPackages.map(cardFor).join("\n        ")}
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <p class="footer-author">Autor: Christian Schwend</p>
      <p>Alemannenschule Wutöschingen</p>
    </div>
  </footer>
  <script>const PROGRESS_CONFIG = ${progressConfig};</script>
  <script>${dashboardRuntime}</script>
</body>
</html>`;
}

const packageBrandStyles = `
  body { font-size: 1.075rem; }
  .header-brand-row { display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-block-end:1rem; }
  .header-brand-row .series-title { margin:0; }
  .docs-asw-link { display:grid; flex:0 0 auto; width:5.5rem; height:4.8rem; place-items:center; overflow:hidden; border:1px solid var(--header-border); border-radius:.75rem; background:rgba(255,255,255,.9); }
  .docs-asw-logo { display:block; width:4.9rem; height:4.3rem; object-fit:contain; }
  .docs-asw-link:focus-visible { outline:.2rem solid var(--header-text); outline-offset:.2rem; }
  @media (max-width:480px) { body { font-size:1rem; } .header-brand-row { align-items:flex-start; } .docs-asw-link { width:4.7rem; height:4.2rem; } .docs-asw-logo { width:4.1rem; height:3.7rem; } }
`;

function transformPackageHtml(html, pkg) {
  const brandedHeader = `<div class="header-brand-row">
      <p class="series-title">Geschichte Phase 7/8: Die Französische Revolution</p>
      <a class="docs-asw-link" href="${schoolUrl}" target="_blank" rel="noopener" aria-label="Website der Alemannenschule Wutöschingen öffnen">
        <img class="docs-asw-logo" src="../assets/asw-logo.png" alt="Logo der Alemannenschule Wutöschingen">
      </a>
    </div>`;
  const transformed = html
    .replace("</style>", `${packageBrandStyles}</style>`)
    .replace(/<div class="header-brand-row">[\s\S]*?<\/div>/, brandedHeader)
    .replaceAll('href="index.html"', 'href="../index.html"')
    .replaceAll('href="../Pakete/', 'href="../material/');

  assert(transformed.includes("../assets/asw-logo.png"), `Paket ${pkg.number}: ASW-Logo fehlt.`);
  assert(transformed.includes('href="../index.html"'), `Paket ${pkg.number}: Rückweg zur Übersicht fehlt.`);
  assert(!transformed.includes('href="../Pakete/'), `Paket ${pkg.number}: nicht portabler PDF-Link verblieben.`);
  return transformed;
}

await mkdir(packageDir, { recursive: true });
await mkdir(materialDir, { recursive: true });
await mkdir(assetDir, { recursive: true });

for (const asset of ["revolution.jpg", "asw-logo.png"]) {
  const content = await readFile(join(assetDir, asset));
  assert(content.length > 0, `Asset fehlt oder ist leer: docs/assets/${asset}`);
}

for (const { file } of overviewImages.values()) {
  const source = join(interactiveDir, "assets", "overview", file);
  const content = await readFile(source);
  assert(content.length > 0, `Übersichtsbild fehlt oder ist leer: Interaktive Lernpakete/assets/overview/${file}`);
  await copyFile(source, join(assetDir, file));
}

await copyFile(
  join(interactiveDir, "assets", "abschluss", "verfassung-1791.png"),
  join(assetDir, "verfassung-1791.png")
);

for (const pkg of preparedPackages) {
  const sourceHtml = await readFile(join(interactiveDir, pkg.filename), "utf8");
  await writeFile(join(packageDir, pkg.filename), transformPackageHtml(sourceHtml, pkg), "utf8");

  const pdfName = sourceFiles.get(pkg.number);
  assert(pdfName, `Paket ${pkg.number}: PDF-Zuordnung fehlt.`);
  await copyFile(join(projectRoot, "Pakete", pdfName), join(materialDir, pdfName));
}

const indexHtml = indexDocument();
assert((indexHtml.match(/class="package-card"/g) || []).length === 10, "Übersicht enthält nicht zehn Paketkarten.");
assert((indexHtml.match(/class="package-preview"/g) || []).length === 10, "Übersicht enthält nicht zehn Paketbilder.");
assert(indexHtml.includes("assets/revolution.jpg"), "Hintergrundbild fehlt in der Übersicht.");
assert(indexHtml.includes(schoolUrl), "ASW-Link fehlt in der Übersicht.");

await writeFile(join(docsDir, "index.html"), indexHtml, "utf8");
await writeFile(join(docsDir, "abschlusstest.html"), renderFinalTestDocument({
  styles: finalTestStyles,
  runtime: finalTestRuntime,
  homeHref: "index.html",
  constitutionSrc: "assets/verfassung-1791.png",
  portraitSrc: "assets/paket-01-sonnenkoenig.jpg",
  logoSrc: "assets/asw-logo.png",
  schoolUrl
}), "utf8");
await writeFile(join(docsDir, ".nojekyll"), "", "utf8");

console.log(`docs erstellt: Übersicht, Abschlusstest, ${preparedPackages.length} Lernpakete, ${preparedPackages.length} PDF-Materialien und 12 Bild-Assets.`);
