function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function createProgressConfig(packages) {
  return {
    application: "club-franzoesische-revolution-phase-7-8",
    version: 1,
    finalTestStorageKey: "franzrev-abschlusstest",
    packages: packages.map((pkg) => ({
      id: pkg.id,
      number: pkg.number,
      title: pkg.title,
      storageKey: `franzrev-interaktiv:${pkg.id}`,
      totals: Object.fromEntries(
        ["M", "R", "E"].map((level) => [
          level,
          pkg.tasks.filter((task) => task.levels.includes(level)).length
        ])
      )
    }))
  };
}

export function serializeProgressConfig(packages) {
  return JSON.stringify(createProgressConfig(packages)).replace(/</g, "\\u003c");
}

function ring(radius, className, id) {
  return `<circle class="dashboard-ring-track" cx="100" cy="100" r="${radius}" pathLength="100"></circle>
            <circle id="${id}" class="dashboard-ring-value ${className}" cx="100" cy="100" r="${radius}" pathLength="100" stroke-dasharray="0 100"></circle>`;
}

function packageProgressCard(pkg) {
  const number = String(pkg.number).padStart(2, "0");
  return `<article class="package-progress-card">
          <svg class="package-progress-ring" viewBox="0 0 64 64" role="img" aria-labelledby="package-progress-title-${pkg.id} package-progress-desc-${pkg.id}">
            <title id="package-progress-title-${pkg.id}">Lernfortschritt Paket ${number}</title>
            <desc id="package-progress-desc-${pkg.id}">Noch keine Aufgaben bearbeitet.</desc>
            <circle class="package-ring-track" cx="32" cy="32" r="25" pathLength="100"></circle>
            <circle id="package-ring-${pkg.id}" class="package-ring-value" cx="32" cy="32" r="25" pathLength="100" stroke-dasharray="0 100"></circle>
            <text id="package-ring-text-${pkg.id}" class="package-ring-text" x="32" y="36" text-anchor="middle">0%</text>
          </svg>
          <div>
            <p class="package-progress-number">Paket ${number}</p>
            <h3>${escapeHtml(pkg.title)}</h3>
            <p id="package-progress-detail-${pkg.id}" class="package-progress-detail">Noch keine Aufgaben bearbeitet.</p>
          </div>
        </article>`;
}

export function renderProgressDashboard(packages, finalTestHref) {
  const packageCards = packages.map(packageProgressCard).join("\n");
  return `<section class="progress-dashboard" aria-labelledby="progress-dashboard-title">
      <div class="progress-dashboard-heading">
        <div>
          <p class="progress-dashboard-eyebrow">Persönliche Auswertung</p>
          <h2 id="progress-dashboard-title">Mein Lernstand</h2>
          <p>Der Außenring zeigt das Ergebnis des Abschlusstests. Die Innenringe zeigen die Richtigkeit der bereits bearbeiteten Übungsaufgaben in M8, R8 und E8.</p>
        </div>
        <div class="progress-actions" aria-label="Fortschritt verwalten">
          <a class="dashboard-button dashboard-button-primary" href="${escapeHtml(finalTestHref)}">Abschlusstest öffnen</a>
          <button id="export-progress" class="dashboard-button" type="button">Export</button>
          <button id="import-progress" class="dashboard-button" type="button">Import</button>
          <input id="import-progress-file" type="file" accept="application/json,.json" hidden>
        </div>
      </div>

      <div class="progress-dashboard-main">
        <div class="overall-chart-wrap">
          <svg class="overall-progress-chart" viewBox="0 0 200 200" role="img" aria-labelledby="overall-chart-title overall-chart-description">
            <title id="overall-chart-title">Gesamter Lern- und Testerfolg</title>
            <desc id="overall-chart-description">Abschlusstest und Übungsrichtigkeit nach Mindest-, Regel- und Expertenstandard.</desc>
            ${ring(84, "ring-test", "dashboard-ring-test")}
            ${ring(65, "ring-m", "dashboard-ring-M")}
            ${ring(46, "ring-r", "dashboard-ring-R")}
            ${ring(27, "ring-e", "dashboard-ring-E")}
            <text id="dashboard-center-value" class="dashboard-center-value" x="100" y="97" text-anchor="middle">0%</text>
            <text class="dashboard-center-label" x="100" y="112" text-anchor="middle">Test</text>
          </svg>
        </div>

        <div class="progress-legend" aria-label="Legende und Ergebnisse">
          <div class="progress-legend-row">
            <span class="progress-swatch ring-test" aria-hidden="true"></span>
            <div><strong>Abschlusstest</strong><span id="dashboard-test-detail">Noch nicht begonnen</span></div>
            <span id="dashboard-test-value" class="progress-value">0%</span>
          </div>
          <div class="progress-legend-row">
            <span class="progress-swatch ring-m" aria-hidden="true"></span>
            <div><strong>M8 Übungen</strong><span id="dashboard-M-detail">0 von 0 bearbeitet</span></div>
            <span id="dashboard-M-value" class="progress-value">0%</span>
          </div>
          <div class="progress-legend-row">
            <span class="progress-swatch ring-r" aria-hidden="true"></span>
            <div><strong>R8 Übungen</strong><span id="dashboard-R-detail">0 von 0 bearbeitet</span></div>
            <span id="dashboard-R-value" class="progress-value">0%</span>
          </div>
          <div class="progress-legend-row">
            <span class="progress-swatch ring-e" aria-hidden="true"></span>
            <div><strong>E8 Übungen</strong><span id="dashboard-E-detail">0 von 0 bearbeitet</span></div>
            <span id="dashboard-E-value" class="progress-value">0%</span>
          </div>
          <p id="progress-management-status" class="progress-management-status" role="status" aria-live="polite"></p>
        </div>
      </div>

      <div class="package-progress-heading">
        <h3>Übungsstand nach Lernpaket</h3>
        <p>Der Prozentwert bezeichnet den Anteil erfolgreicher Lösungen an den bereits bearbeiteten Aufgaben.</p>
      </div>
      <div class="package-progress-grid">
        ${packageCards}
      </div>

      <aside class="progress-backup-help" aria-labelledby="progress-backup-title">
        <div class="progress-backup-heading">
          <p class="progress-dashboard-eyebrow">Fortschritt sichern</p>
          <h3 id="progress-backup-title">So nimmst du deinen Lernstand mit</h3>
          <p>Deine Ergebnisse werden nur in diesem Browser gespeichert. Mit einer Sicherungsdatei kannst du deinen gesamten Lernstand aufbewahren oder auf einem anderen Gerät wiederherstellen.</p>
        </div>
        <div class="progress-backup-steps">
          <section>
            <p class="progress-backup-step"><span aria-hidden="true">1</span> Exportieren und sichern</p>
            <p>Wähle oben <strong>Export</strong>. Dein Browser lädt eine kleine JSON-Datei mit den Ergebnissen aller Lernpakete und des Abschlusstests herunter. Bewahre sie an einem Ort auf, den du wiederfindest.</p>
          </section>
          <section>
            <p class="progress-backup-step"><span aria-hidden="true">2</span> Importieren und fortsetzen</p>
            <p>Wähle oben <strong>Import</strong> und öffne deine zuvor exportierte JSON-Datei. Bestätige anschließend das Ersetzen des aktuellen Lernstands.</p>
          </section>
        </div>
        <p class="progress-backup-note"><strong>Wichtig:</strong> Beim Import wird der momentan in diesem Browser gespeicherte Lernstand vollständig durch den Inhalt der Sicherungsdatei ersetzt.</p>
      </aside>
    </section>`;
}
