(function () {
  "use strict";

  const LEVELS = {
    M: { name: "Mindeststandard", short: "M" },
    R: { name: "Regelstandard", short: "R" },
    E: { name: "Expertenstandard", short: "E" }
  };
  const LEVEL_SEQUENCE = ["M", "R", "E"];
  const PASS_RATIO = 0.8;

  const byId = (id) => document.getElementById(id);
  const storageKey = `franzrev-interaktiv:${PACKAGE.id}`;
  const knownIds = new Set(PACKAGE.tasks.map((task) => task.id));
  const knownKeys = new Set(PACKAGE.tasks.flatMap((task) => task.levels.map((level) => `${level}:${task.id}`)));
  const state = {
    level: null,
    current: 0,
    tasks: [],
    attempted: new Set(),
    passed: new Set(),
    drafts: {},
    showingSummary: false
  };

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "{}");
      if (Array.isArray(parsed.attempted)) {
        parsed.attempted.filter((key) => knownKeys.has(key)).forEach((key) => state.attempted.add(key));
      }
      if (Array.isArray(parsed.passed)) {
        parsed.passed.filter((key) => knownKeys.has(key)).forEach((key) => {
          state.passed.add(key);
          state.attempted.add(key);
        });
      } else if (Array.isArray(parsed.completed)) {
        // Ã„ltere, noch nicht niveaubezogene Fortschritte werden der niedrigsten
        // passenden Stufe zugeordnet. So bleibt Arbeit erhalten, ohne Stufen zu Ã¼berspringen.
        parsed.completed.filter((id) => knownIds.has(id)).forEach((id) => {
          const task = PACKAGE.tasks.find((candidate) => candidate.id === id);
          const level = LEVEL_SEQUENCE.find((candidate) => task.levels.includes(candidate));
          const key = `${level}:${id}`;
          state.attempted.add(key);
          state.passed.add(key);
        });
      }
      if (parsed.drafts && typeof parsed.drafts === "object") {
        Object.entries(parsed.drafts).forEach(([id, value]) => {
          if (knownIds.has(id) && typeof value === "string") state.drafts[id] = value;
        });
      }
    } catch (_error) {
      // Die Dateien funktionieren auch, wenn ein Browser file:-Speicherung unterbindet.
    }
  }

  function persistState() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        version: 2,
        attempted: Array.from(state.attempted),
        passed: Array.from(state.passed),
        drafts: state.drafts
      }));
    } catch (_error) {
      // Fortschritt bleibt in diesem Fall nur bis zum Schließen der Seite erhalten.
    }
  }

  function levelTasks(level) {
    return PACKAGE.tasks.filter((task) => task.levels.includes(level));
  }

  function taskCountFor(level) {
    return levelTasks(level).length;
  }

  function progressKey(level, task) {
    return `${level}:${task.id}`;
  }

  function requiredPasses(level) {
    return Math.ceil(taskCountFor(level) * PASS_RATIO);
  }

  function progressFor(level) {
    const tasks = levelTasks(level);
    const attempted = tasks.filter((task) => state.attempted.has(progressKey(level, task))).length;
    const passed = tasks.filter((task) => state.passed.has(progressKey(level, task))).length;
    return {
      total: tasks.length,
      attempted,
      passed,
      required: requiredPasses(level)
    };
  }

  function hasMastery(level) {
    const progress = progressFor(level);
    return progress.attempted === progress.total && progress.passed >= progress.required;
  }

  function previousLevel(level) {
    const index = LEVEL_SEQUENCE.indexOf(level);
    return index > 0 ? LEVEL_SEQUENCE[index - 1] : null;
  }

  function nextLevel(level) {
    const index = LEVEL_SEQUENCE.indexOf(level);
    return index >= 0 && index < LEVEL_SEQUENCE.length - 1 ? LEVEL_SEQUENCE[index + 1] : null;
  }

  function isLevelUnlocked(level) {
    const previous = previousLevel(level);
    return previous === null || (isLevelUnlocked(previous) && hasMastery(previous));
  }

  function isCurrentTaskAttempted(task) {
    return state.attempted.has(progressKey(state.level, task));
  }

  function isCurrentTaskPassed(task) {
    return state.passed.has(progressKey(state.level, task));
  }

  function updateLevelChooser() {
    LEVEL_SEQUENCE.forEach((level) => {
      const progress = progressFor(level);
      const unlocked = isLevelUnlocked(level);
      const mastered = hasMastery(level);
      const card = document.querySelector(`[data-level-card="${level}"]`);
      const button = document.querySelector(`[data-level="${level}"]`);
      const status = byId(`level-status-${level}`);
      const detail = byId(`level-detail-${level}`);
      const meter = byId(`level-progress-${level}`);

      card.classList.toggle("is-locked", !unlocked);
      card.setAttribute("aria-disabled", String(!unlocked));
      button.disabled = !unlocked;
      meter.max = progress.total;
      meter.value = progress.passed;

      if (unlocked) {
        status.textContent = mastered ? "80-%-Ziel erreicht" : "Freigeschaltet";
        detail.textContent = `${progress.attempted} von ${progress.total} bearbeitet · ${progress.passed} erfolgreich · ${progress.required} benötigt`;
        button.textContent = mastered ? `${level}8 wiederholen` : progress.attempted > 0 ? `${level}8 fortsetzen` : `${level}8 starten`;
      } else {
        const prerequisite = previousLevel(level);
        const prerequisiteProgress = progressFor(prerequisite);
        status.textContent = "Noch gesperrt";
        detail.textContent = `Zuerst ${prerequisite}8: ${prerequisiteProgress.attempted} von ${prerequisiteProgress.total} bearbeitet · ${prerequisiteProgress.passed} erfolgreich · ${prerequisiteProgress.required} benötigt`;
        button.textContent = `${level}8 noch gesperrt`;
      }
    });
  }

  function selectLevel(level) {
    if (!LEVELS[level] || !isLevelUnlocked(level)) {
      updateLevelChooser();
      return;
    }
    state.level = level;
    state.tasks = levelTasks(level);
    const firstUnattempted = state.tasks.findIndex((task) => !state.attempted.has(progressKey(level, task)));
    const firstUnpassed = state.tasks.findIndex((task) => !state.passed.has(progressKey(level, task)));
    state.current = firstUnattempted >= 0 ? firstUnattempted : firstUnpassed >= 0 ? firstUnpassed : 0;
    state.showingSummary = false;
    byId("level-chooser").hidden = true;
    byId("task-workspace").hidden = false;
    byId("active-level-label").textContent = LEVELS[level].name;
    byId("task-session").hidden = false;
    byId("completion-view").hidden = true;
    renderTask();
  }

  function showLevelChooser() {
    state.level = null;
    state.tasks = [];
    state.current = 0;
    byId("task-workspace").hidden = true;
    byId("level-chooser").hidden = false;
    updateLevelChooser();
  }

  function updateProgress() {
    const progress = progressFor(state.level);
    byId("attempt-progress").max = progress.total;
    byId("attempt-progress").value = progress.attempted;
    byId("attempt-progress-text").textContent = `${progress.attempted} von ${progress.total} Aufgaben mindestens einmal bearbeitet`;
    byId("task-progress").max = progress.total;
    byId("task-progress").value = progress.passed;
    byId("progress-text").textContent = `${progress.passed} von ${progress.total} Aufgaben erfolgreich · ${progress.required} für mindestens 80 % benötigt`;
  }

  function clearFeedback() {
    const feedback = byId("feedback");
    feedback.hidden = true;
    feedback.replaceChildren();
  }

  function showFeedback(kind, message) {
    const feedback = byId("feedback");
    const lead = document.createElement("strong");
    lead.textContent = kind === "success" ? "Erledigt: " : kind === "error" ? "Noch nicht: " : "Hinweis: ";
    const text = document.createElement("span");
    text.textContent = message;
    feedback.replaceChildren(lead, text);
    feedback.hidden = false;
  }

  function completeTask(task, message) {
    const masteredBefore = hasMastery(state.level);
    state.attempted.add(progressKey(state.level, task));
    state.passed.add(progressKey(state.level, task));
    persistState();
    updateProgress();
    updateLevelChooser();
    byId("next-task").disabled = false;
    let feedback = message || task.success || "Die Aufgabe ist erfolgreich abgeschlossen.";
    if (!masteredBefore && hasMastery(state.level)) {
      const following = nextLevel(state.level);
      feedback += following
        ? ` Das 80-%-Ziel ist erreicht: ${LEVELS[following].name} ist jetzt freigeschaltet.`
        : " Das 80-%-Ziel ist erreicht: Du hast den gesamten Lernpfad abgeschlossen.";
    }
    showFeedback("success", feedback);
  }

  function recordUnsuccessfulAttempt(task, message) {
    state.attempted.add(progressKey(state.level, task));
    persistState();
    updateProgress();
    updateLevelChooser();
    byId("next-task").disabled = false;
    showFeedback("error", `${message} Du kannst die Aufgabe jetzt erneut versuchen oder zunächst weitergehen.`);
  }

  function addCheckButton(container, label, handler) {
    const row = document.createElement("div");
    row.className = "action-row";
    row.style.marginBlockStart = "1rem";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button primary";
    button.textContent = label;
    button.addEventListener("click", handler);
    row.append(button);
    container.append(row);
  }

  function renderChoice(task, container) {
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = task.multiple ? "Wähle alle zutreffenden Antworten." : "Wähle eine Antwort.";
    fieldset.append(legend);
    const list = document.createElement("div");
    list.className = "option-list";

    task.options.forEach((option, index) => {
      const label = document.createElement("label");
      label.className = "option-row";
      const input = document.createElement("input");
      input.type = task.multiple ? "checkbox" : "radio";
      input.name = `choice-${task.id}`;
      input.value = String(index);
      const span = document.createElement("span");
      span.textContent = option.text;
      label.append(input, span);
      list.append(label);
    });

    fieldset.append(list);
    container.append(fieldset);
    addCheckButton(container, "Antwort prüfen", () => {
      const inputs = Array.from(list.querySelectorAll("input"));
      if (!inputs.some((input) => input.checked)) {
        showFeedback("error", "Wähle zuerst mindestens eine Antwort aus.");
        return;
      }
      const exact = inputs.every((input, index) => input.checked === Boolean(task.options[index].correct));
      if (exact) completeTask(task, task.success);
      else recordUnsuccessfulAttempt(task, task.hint || "Prüfe die Aussagen noch einmal am Material.");
    });
  }

  function renderMatch(task, container) {
    const instruction = document.createElement("p");
    instruction.textContent = "Ordne jeder Aussage den passenden Begriff zu.";
    container.append(instruction);
    const list = document.createElement("div");
    list.className = "match-list";

    task.items.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "match-row";
      const label = document.createElement("label");
      const selectId = `match-${task.id}-${index}`;
      label.setAttribute("for", selectId);
      label.textContent = item.prompt;
      const select = document.createElement("select");
      select.id = selectId;
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Bitte auswählen";
      select.append(placeholder);
      task.choices.forEach((choice) => {
        const option = document.createElement("option");
        option.value = choice;
        option.textContent = choice;
        select.append(option);
      });
      row.append(label, select);
      list.append(row);
    });

    container.append(list);
    addCheckButton(container, "Zuordnung prüfen", () => {
      const selects = Array.from(list.querySelectorAll("select"));
      if (selects.some((select) => !select.value)) {
        showFeedback("error", "Vervollständige zuerst alle Zuordnungen.");
        return;
      }
      const correct = selects.filter((select, index) => select.value === task.items[index].answer).length;
      if (correct === task.items.length) completeTask(task, task.success);
      else recordUnsuccessfulAttempt(task, `${correct} von ${task.items.length} Zuordnungen passen. ${task.hint || "Prüfe die übrigen noch einmal."}`);
    });
  }

  function hashText(text) {
    let hash = 0;
    for (let index = 0; index < text.length; index += 1) hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
    return Math.abs(hash);
  }

  function shuffled(items, seedText) {
    const result = items.slice();
    let seed = hashText(seedText) || 1;
    for (let index = result.length - 1; index > 0; index -= 1) {
      seed = (seed * 9301 + 49297) % 233280;
      const swap = Math.floor((seed / 233280) * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    if (result.length > 1 && result.every((item, index) => item === items[index])) result.push(result.shift());
    return result;
  }

  function syncSortButtons(list) {
    const rows = Array.from(list.children);
    rows.forEach((row, index) => {
      row.querySelector("[data-move='up']").disabled = index === 0;
      row.querySelector("[data-move='down']").disabled = index === rows.length - 1;
    });
  }

  function moveSortRow(list, row, offset) {
    const rows = Array.from(list.children);
    const index = rows.indexOf(row);
    const target = rows[index + offset];
    if (!target) return;
    if (offset < 0) list.insertBefore(row, target);
    else list.insertBefore(target, row);
    syncSortButtons(list);
  }

  function renderOrder(task, container) {
    const instruction = document.createElement("p");
    instruction.id = `sort-instructions-${task.id}`;
    instruction.textContent = "Bringe die Karten in die richtige Reihenfolge: am Griff ☰ ziehen oder mit den Schaltflächen verschieben.";
    container.append(instruction);
    const list = document.createElement("ol");
    list.className = "sort-list";
    const liveStatus = document.createElement("p");
    liveStatus.className = "sr-only";
    liveStatus.setAttribute("role", "status");
    liveStatus.setAttribute("aria-live", "polite");
    let dragState = null;

    function announcePosition(row) {
      const position = Array.from(list.children).indexOf(row) + 1;
      liveStatus.textContent = `Karte an Position ${position} von ${list.children.length} verschoben.`;
    }

    function finishPointerDrag(event) {
      if (!dragState || (event && event.pointerId !== dragState.pointerId)) return;
      const active = dragState;
      dragState = null;
      active.row.classList.remove("dragging");
      try {
        if (active.handle.hasPointerCapture(active.pointerId)) active.handle.releasePointerCapture(active.pointerId);
      } catch (_error) {
        // Bei einem bereits verlorenen Pointer-Capture ist keine weitere Aktion nötig.
      }
      syncSortButtons(list);
      announcePosition(active.row);
    }

    shuffled(task.items, task.id).forEach((item) => {
      const row = document.createElement("li");
      row.className = "sort-row";
      row.dataset.item = item;
      row.setAttribute("aria-describedby", instruction.id);

      const handle = document.createElement("span");
      handle.className = "sort-handle";
      handle.dataset.dragHandle = "true";
      handle.setAttribute("aria-hidden", "true");
      handle.textContent = "☰";
      const text = document.createElement("span");
      text.className = "sort-text";
      text.textContent = item;
      const actions = document.createElement("span");
      actions.className = "sort-actions";
      const up = document.createElement("button");
      up.type = "button";
      up.className = "button small";
      up.dataset.move = "up";
      up.textContent = "Nach oben";
      up.addEventListener("click", () => {
        moveSortRow(list, row, -1);
        announcePosition(row);
      });
      const down = document.createElement("button");
      down.type = "button";
      down.className = "button small";
      down.dataset.move = "down";
      down.textContent = "Nach unten";
      down.addEventListener("click", () => {
        moveSortRow(list, row, 1);
        announcePosition(row);
      });
      actions.append(up, down);
      row.append(handle, text, actions);

      handle.addEventListener("pointerdown", (event) => {
        if (!event.isPrimary || dragState || (event.pointerType === "mouse" && event.button !== 0)) return;
        dragState = { row, handle, pointerId: event.pointerId };
        try {
          handle.setPointerCapture(event.pointerId);
        } catch (_error) {
          // Die Verschiebeschaltflächen bleiben auch ohne Pointer-Capture nutzbar.
        }
        row.classList.add("dragging");
        event.preventDefault();
      });

      handle.addEventListener("pointermove", (event) => {
        if (!dragState || dragState.row !== row || dragState.pointerId !== event.pointerId) return;
        event.preventDefault();
        const previousIndex = Array.from(list.children).indexOf(row);
        const otherRows = Array.from(list.children).filter((candidate) => candidate !== row);
        const target = otherRows.find((candidate) => {
          const rectangle = candidate.getBoundingClientRect();
          return event.clientY < rectangle.top + rectangle.height / 2;
        });
        if (target) list.insertBefore(row, target);
        else list.append(row);
        if (Array.from(list.children).indexOf(row) !== previousIndex) syncSortButtons(list);
      });

      handle.addEventListener("pointerup", finishPointerDrag);
      handle.addEventListener("pointercancel", finishPointerDrag);
      handle.addEventListener("lostpointercapture", finishPointerDrag);
      list.append(row);
    });

    container.append(list, liveStatus);
    syncSortButtons(list);
    addCheckButton(container, "Reihenfolge prüfen", () => {
      const current = Array.from(list.children).map((row) => row.dataset.item);
      const exact = current.every((item, index) => item === task.items[index]);
      if (exact) completeTask(task, task.success);
      else recordUnsuccessfulAttempt(task, task.hint || "Nutze Zeitangaben und Ursache-Folge-Beziehungen als Hinweise.");
    });
  }

  function renderText(task, container) {
    if (Array.isArray(task.planning) && task.planning.length) {
      const heading = document.createElement("h3");
      heading.textContent = "Planungshilfe";
      const list = document.createElement("ul");
      list.className = "planning-list";
      task.planning.forEach((step) => {
        const item = document.createElement("li");
        item.textContent = step;
        list.append(item);
      });
      container.append(heading, list);
    }

    if (task.starter) {
      const starter = document.createElement("div");
      starter.className = "starter-box";
      const label = document.createElement("strong");
      label.textContent = "Satzstarter: ";
      const text = document.createElement("span");
      text.textContent = task.starter;
      starter.append(label, text);
      container.append(starter);
    }

    const label = document.createElement("label");
    label.className = "field-label";
    label.setAttribute("for", `text-${task.id}`);
    label.textContent = "Deine Ausarbeitung";
    const textarea = document.createElement("textarea");
    textarea.id = `text-${task.id}`;
    textarea.value = state.drafts[task.id] || "";
    const counter = document.createElement("p");
    counter.className = "counter";
    const updateCounter = () => {
      counter.textContent = `${textarea.value.trim().length} von mindestens ${task.minChars} Zeichen`;
      state.drafts[task.id] = textarea.value;
      persistState();
    };
    textarea.addEventListener("input", updateCounter);
    updateCounter();
    container.append(label, textarea, counter);

    const criteriaFieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = "Prüfe dein Arbeitsprodukt";
    const criteriaList = document.createElement("div");
    criteriaList.className = "criteria-list";
    (task.criteria || []).forEach((criterion, index) => {
      const row = document.createElement("label");
      row.className = "criterion-row";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = String(index);
      const text = document.createElement("span");
      text.textContent = criterion;
      row.append(input, text);
      criteriaList.append(row);
    });
    criteriaFieldset.append(legend, criteriaList);
    container.append(criteriaFieldset);

    addCheckButton(container, "Arbeitsprodukt abschließen", () => {
      const length = textarea.value.trim().length;
      const criteria = Array.from(criteriaList.querySelectorAll("input"));
      const allChecked = criteria.every((input) => input.checked);
      if (length < task.minChars) {
        showFeedback("error", `Ergänze noch mindestens ${task.minChars - length} Zeichen.`);
        return;
      }
      if (!allChecked) {
        showFeedback("error", "Bestätige alle Kriterien erst, nachdem du deinen Text entsprechend geprüft hast.");
        return;
      }
      completeTask(task, task.success || "Das Arbeitsprodukt erfüllt die formalen Kriterien. Vergleicht es nun mit Material oder Lösung.");
    });
  }

  function renderAnswer(task) {
    const container = byId("answer-area");
    container.replaceChildren();
    if (task.kind === "choice") renderChoice(task, container);
    else if (task.kind === "match") renderMatch(task, container);
    else if (task.kind === "order") renderOrder(task, container);
    else if (task.kind === "text") renderText(task, container);
  }

  function renderTask() {
    const task = state.tasks[state.current];
    if (!task) return;
    state.showingSummary = false;
    byId("task-session").hidden = false;
    byId("completion-view").hidden = true;
    const taskTag = task.tag || `${state.level}8`;
    byId("task-tag").textContent = taskTag.startsWith("(") ? taskTag : `(${taskTag})`;
    byId("task-position").textContent = `Aufgabe ${state.current + 1} von ${state.tasks.length}`;
    byId("task-title").textContent = `${task.number ? `Aufgabe ${task.number}: ` : ""}${task.title}`;
    byId("task-prompt").textContent = task.prompt;

    const materialBox = byId("material-box");
    if (task.material) {
      byId("task-material").textContent = task.material;
      materialBox.hidden = false;
    } else {
      materialBox.hidden = true;
    }

    clearFeedback();
    renderAnswer(task);
    byId("prev-task").disabled = state.current === 0;
    byId("next-task").disabled = !isCurrentTaskAttempted(task);
    byId("next-task").textContent = state.current === state.tasks.length - 1 ? "Abschluss anzeigen" : "Nächste Aufgabe";
    updateProgress();
    if (isCurrentTaskPassed(task)) {
      showFeedback("info", "Diese Aufgabe wurde bereits erfolgreich abgeschlossen. Du kannst sie erneut bearbeiten oder weitergehen.");
    } else if (isCurrentTaskAttempted(task)) {
      showFeedback("info", "Diese Aufgabe wurde bereits geprüft, zählt aber noch nicht als erfolgreich. Du kannst sie erneut versuchen oder weitergehen.");
    }
  }

  function showSummary() {
    const progress = progressFor(state.level);
    const mastered = hasMastery(state.level);
    const missingAttempts = progress.total - progress.attempted;
    const missingPasses = Math.max(0, progress.required - progress.passed);
    const following = nextLevel(state.level);
    state.showingSummary = true;
    byId("task-session").hidden = true;
    byId("completion-view").hidden = false;
    byId("completion-title").textContent = mastered
      ? `${LEVELS[state.level].name}: 80-%-Ziel erreicht`
      : `${LEVELS[state.level].name}: Zwischenstand`;

    if (mastered) {
      byId("completion-text").textContent = following
        ? `Alle ${progress.total} Aufgaben wurden mindestens einmal bearbeitet, ${progress.passed} davon erfolgreich. ${LEVELS[following].name} ist jetzt freigeschaltet.`
        : `Alle ${progress.total} Aufgaben wurden mindestens einmal bearbeitet, ${progress.passed} davon erfolgreich. Du hast den gesamten Lernpfad abgeschlossen.`;
    } else {
      const parts = [];
      if (missingAttempts > 0) parts.push(`${missingAttempts} Aufgabe${missingAttempts === 1 ? "" : "n"} noch mindestens einmal prüfen`);
      if (missingPasses > 0) parts.push(`${missingPasses} weitere Aufgabe${missingPasses === 1 ? "" : "n"} erfolgreich lösen`);
      byId("completion-text").textContent = `Aktuell: ${progress.attempted} von ${progress.total} bearbeitet und ${progress.passed} erfolgreich. Für die Freischaltung musst du ${parts.join(" und ")}.`;
    }

    const nextButton = byId("start-next-level");
    nextButton.hidden = !(mastered && following);
    if (mastered && following) {
      nextButton.dataset.nextLevel = following;
      nextButton.textContent = `${LEVELS[following].name} starten`;
    }
  }

  function bindEvents() {
    document.querySelectorAll("[data-level]").forEach((button) => {
      button.addEventListener("click", () => selectLevel(button.dataset.level));
    });
    byId("change-level").addEventListener("click", showLevelChooser);
    byId("prev-task").addEventListener("click", () => {
      if (state.current > 0) {
        state.current -= 1;
        renderTask();
      }
    });
    byId("next-task").addEventListener("click", () => {
      if (state.current < state.tasks.length - 1) {
        state.current += 1;
        renderTask();
      } else {
        showSummary();
      }
    });
    byId("review-level").addEventListener("click", () => {
      state.current = 0;
      renderTask();
    });
    byId("choose-level-after").addEventListener("click", showLevelChooser);
    byId("start-next-level").addEventListener("click", (event) => {
      selectLevel(event.currentTarget.dataset.nextLevel);
    });
    byId("reset-progress").addEventListener("click", () => {
      if (!window.confirm("Fortschritt und Textentwürfe dieses Pakets wirklich zurücksetzen?")) return;
      state.attempted.clear();
      state.passed.clear();
      state.drafts = {};
      persistState();
      showLevelChooser();
      const status = byId("reset-status");
      status.textContent = "Der Fortschritt dieses Pakets wurde zurückgesetzt.";
      status.hidden = false;
    });
  }

  function initializeCounts() {
    Object.keys(LEVELS).forEach((level) => {
      byId(`count-${level}`).textContent = `${taskCountFor(level)} Aufgaben`;
    });
  }

  loadState();
  persistState();
  initializeCounts();
  updateLevelChooser();
  bindEvents();
})();
