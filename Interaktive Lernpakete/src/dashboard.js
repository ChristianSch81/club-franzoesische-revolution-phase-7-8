(function () {
  "use strict";

  const LEVELS = ["M", "R", "E"];
  const byId = (id) => document.getElementById(id);
  const allowedStorageKeys = new Set([
    ...PROGRESS_CONFIG.packages.map((pkg) => pkg.storageKey),
    PROGRESS_CONFIG.finalTestStorageKey
  ]);

  function safeParse(value) {
    if (!value) return null;
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
    } catch (_error) {
      return null;
    }
  }

  function percent(points, maximum) {
    if (!maximum || points <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((points / maximum) * 100)));
  }

  function setRing(id, value) {
    const ring = byId(id);
    if (ring) ring.setAttribute("stroke-dasharray", `${value} ${100 - value}`);
  }

  function packageState(pkg) {
    const stored = safeParse(localStorage.getItem(pkg.storageKey)) || {};
    const attempted = new Set(Array.isArray(stored.attempted) ? stored.attempted.filter((key) => typeof key === "string") : []);
    const passed = new Set(Array.isArray(stored.passed) ? stored.passed.filter((key) => typeof key === "string") : []);
    passed.forEach((key) => attempted.add(key));

    const levels = {};
    LEVELS.forEach((level) => {
      const total = Number(pkg.totals[level]) || 0;
      const attemptedCount = Math.min(total, Array.from(attempted).filter((key) => key.startsWith(`${level}:`)).length);
      const passedCount = Math.min(attemptedCount, Array.from(passed).filter((key) => key.startsWith(`${level}:`)).length);
      levels[level] = { total, attempted: attemptedCount, passed: passedCount };
    });
    return levels;
  }

  function finalTestState() {
    const stored = safeParse(localStorage.getItem(PROGRESS_CONFIG.finalTestStorageKey)) || {};
    const scores = stored.scores && typeof stored.scores === "object" ? stored.scores : {};
    const result = { points: 0, maximum: 0, complete: true, started: false };

    ["M", "R", "E"].forEach((level) => {
      const section = scores[level] && typeof scores[level] === "object" ? scores[level] : {};
      const maximum = Number(section.maximum) || (level === "M" ? 10 : level === "R" ? 20 : 8);
      const points = Math.max(0, Math.min(maximum, Number(section.points) || 0));
      result.points += points;
      result.maximum += maximum;
      result.complete = result.complete && section.complete === true;
      result.started = result.started || points > 0 || section.complete === true;
    });

    return result;
  }

  function render() {
    const aggregate = Object.fromEntries(LEVELS.map((level) => [level, { total: 0, attempted: 0, passed: 0 }]));

    PROGRESS_CONFIG.packages.forEach((pkg) => {
      const levels = packageState(pkg);
      let total = 0;
      let attempted = 0;
      let passed = 0;

      LEVELS.forEach((level) => {
        total += levels[level].total;
        attempted += levels[level].attempted;
        passed += levels[level].passed;
        aggregate[level].total += levels[level].total;
        aggregate[level].attempted += levels[level].attempted;
        aggregate[level].passed += levels[level].passed;
      });

      const correctness = percent(passed, attempted);
      setRing(`package-ring-${pkg.id}`, correctness);
      byId(`package-ring-text-${pkg.id}`).textContent = `${correctness}%`;
      const detail = attempted
        ? `${attempted} von ${total} bearbeitet · ${passed} erfolgreich`
        : `0 von ${total} bearbeitet`;
      byId(`package-progress-detail-${pkg.id}`).textContent = detail;
      byId(`package-progress-desc-${pkg.id}`).textContent = `${correctness} Prozent richtig; ${detail}.`;
    });

    LEVELS.forEach((level) => {
      const data = aggregate[level];
      const correctness = percent(data.passed, data.attempted);
      setRing(`dashboard-ring-${level}`, correctness);
      byId(`dashboard-${level}-value`).textContent = `${correctness}%`;
      byId(`dashboard-${level}-detail`).textContent = `${data.attempted} von ${data.total} bearbeitet · ${data.passed} erfolgreich`;
    });

    const test = finalTestState();
    const testPercent = percent(test.points, test.maximum);
    setRing("dashboard-ring-test", testPercent);
    byId("dashboard-center-value").textContent = `${testPercent}%`;
    byId("dashboard-test-value").textContent = `${testPercent}%`;
    byId("dashboard-test-detail").textContent = test.started
      ? `${test.points} von ${test.maximum} Punkten${test.complete ? " · vollständig" : " · noch nicht vollständig"}`
      : "Noch nicht begonnen";
    byId("overall-chart-description").textContent =
      `Abschlusstest ${testPercent} Prozent. Mindeststandard ${percent(aggregate.M.passed, aggregate.M.attempted)} Prozent, Regelstandard ${percent(aggregate.R.passed, aggregate.R.attempted)} Prozent, Expertenstandard ${percent(aggregate.E.passed, aggregate.E.attempted)} Prozent richtige bearbeitete Übungsaufgaben.`;
  }

  function setStatus(message, isError) {
    const status = byId("progress-management-status");
    status.textContent = message;
    status.dataset.state = isError ? "error" : "ok";
  }

  function downloadExport() {
    const data = {};
    allowedStorageKeys.forEach((key) => {
      const value = safeParse(localStorage.getItem(key));
      if (value) data[key] = value;
    });

    const payload = {
      application: PROGRESS_CONFIG.application,
      version: PROGRESS_CONFIG.version,
      exportedAt: new Date().toISOString(),
      data
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `franzoesische-revolution-fortschritt-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("Der Fortschritt wurde als JSON-Datei exportiert.", false);
  }

  function validImportedValue(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    try {
      return JSON.stringify(value).length <= 1_500_000;
    } catch (_error) {
      return false;
    }
  }

  async function importProgress(file) {
    if (!file) return;
    if (file.size > 2_000_000) {
      setStatus("Die Importdatei ist größer als 2 MB.", true);
      return;
    }

    try {
      const payload = JSON.parse(await file.text());
      if (
        !payload ||
        payload.application !== PROGRESS_CONFIG.application ||
        payload.version !== PROGRESS_CONFIG.version ||
        !payload.data ||
        typeof payload.data !== "object" ||
        Array.isArray(payload.data)
      ) {
        throw new Error("Format");
      }

      const entries = Object.entries(payload.data).filter(([key, value]) => allowedStorageKeys.has(key) && validImportedValue(value));
      if (!entries.length && Object.keys(payload.data).length) throw new Error("Inhalt");
      if (!window.confirm("Der vorhandene Lernfortschritt wird durch die importierten Daten ersetzt. Fortfahren?")) return;

      allowedStorageKeys.forEach((key) => localStorage.removeItem(key));
      entries.forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value)));
      render();
      setStatus("Der Fortschritt wurde erfolgreich importiert.", false);
    } catch (_error) {
      setStatus("Diese Datei ist kein gültiger Fortschrittsexport.", true);
    } finally {
      byId("import-progress-file").value = "";
    }
  }

  byId("export-progress").addEventListener("click", downloadExport);
  byId("import-progress").addEventListener("click", () => byId("import-progress-file").click());
  byId("import-progress-file").addEventListener("change", (event) => importProgress(event.target.files && event.target.files[0]));
  window.addEventListener("pageshow", render);
  window.addEventListener("storage", render);
  render();
})();
