(function () {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const storageKey = FINAL_TEST_DATA.storageKey;
  const allOpenQuestions = [...FINAL_TEST_DATA.regularQuestions, FINAL_TEST_DATA.expertQuestion];
  const state = {
    version: FINAL_TEST_DATA.version,
    minimumAnswers: {},
    minimumEvaluated: false,
    drafts: {},
    checks: {},
    openRubrics: [],
    scores: {}
  };
  let persistTimer = null;

  function safeObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function loadState() {
    try {
      const parsed = safeObject(JSON.parse(localStorage.getItem(storageKey) || "{}"));
      state.minimumAnswers = safeObject(parsed.minimumAnswers);
      state.minimumEvaluated = parsed.minimumEvaluated === true;
      state.drafts = safeObject(parsed.drafts);
      state.checks = safeObject(parsed.checks);
      state.openRubrics = Array.isArray(parsed.openRubrics) ? parsed.openRubrics.filter((id) => typeof id === "string") : [];
    } catch (_error) {
      // Der Test bleibt auch ohne verfügbare lokale Speicherung nutzbar.
    }
  }

  function minimumScore() {
    const points = state.minimumEvaluated
      ? FINAL_TEST_DATA.minimumQuestions.filter((question) => Number(state.minimumAnswers[question.id]) === question.answer).length
      : 0;
    return {
      points,
      maximum: FINAL_TEST_DATA.minimumQuestions.length,
      complete: state.minimumEvaluated
    };
  }

  function openScore(questions, minimumLength) {
    const maximum = questions.reduce((sum, question) => sum + question.criteria.length, 0);
    const points = questions.reduce((sum, question) => {
      const values = Array.isArray(state.checks[question.id]) ? state.checks[question.id] : [];
      return sum + values.filter(Boolean).length;
    }, 0);
    const complete = questions.every((question) =>
      typeof state.drafts[question.id] === "string" &&
      state.drafts[question.id].trim().length >= minimumLength &&
      state.openRubrics.includes(question.id)
    );
    return { points, maximum, complete };
  }

  function calculateScores() {
    return {
      M: minimumScore(),
      R: openScore(FINAL_TEST_DATA.regularQuestions, 40),
      E: openScore([FINAL_TEST_DATA.expertQuestion], 100)
    };
  }

  function percentage(points, maximum) {
    return maximum ? Math.round((points / maximum) * 100) : 0;
  }

  function updateScoreboard() {
    state.scores = calculateScores();
    let totalPoints = 0;
    let totalMaximum = 0;
    let complete = true;

    ["M", "R", "E"].forEach((level) => {
      const section = state.scores[level];
      totalPoints += section.points;
      totalMaximum += section.maximum;
      complete = complete && section.complete;
      byId(`score-${level}`).textContent = `${section.points} / ${section.maximum}`;
    });

    byId("score-total").textContent = `${percentage(totalPoints, totalMaximum)}%`;
    byId("test-completion-status").textContent = complete
      ? `Der Abschlusstest ist vollständig bearbeitet: ${totalPoints} von ${totalMaximum} Punkten.`
      : `Aktueller Stand: ${totalPoints} von ${totalMaximum} Punkten. Noch nicht alle Bereiche sind vollständig bearbeitet.`;
  }

  function persistNow(message) {
    updateScoreboard();
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        version: state.version,
        minimumAnswers: state.minimumAnswers,
        minimumEvaluated: state.minimumEvaluated,
        drafts: state.drafts,
        checks: state.checks,
        openRubrics: state.openRubrics,
        scores: state.scores,
        updatedAt: new Date().toISOString()
      }));
      byId("save-status").textContent = message || "Fortschritt lokal gespeichert.";
    } catch (_error) {
      byId("save-status").textContent = "Der Browser verhindert die dauerhafte lokale Speicherung.";
    }
  }

  function schedulePersist() {
    window.clearTimeout(persistTimer);
    persistTimer = window.setTimeout(() => persistNow("Entwurf lokal gespeichert."), 250);
  }

  function renderMinimumFeedback() {
    FINAL_TEST_DATA.minimumQuestions.forEach((question) => {
      const task = document.querySelector(`[data-minimum-question="${question.id}"]`);
      const feedback = byId(`feedback-${question.id}`);
      task.classList.remove("is-correct", "is-wrong");
      feedback.classList.remove("correct", "wrong");

      if (!state.minimumEvaluated) {
        feedback.hidden = true;
        return;
      }

      const correct = Number(state.minimumAnswers[question.id]) === question.answer;
      task.classList.add(correct ? "is-correct" : "is-wrong");
      feedback.classList.add(correct ? "correct" : "wrong");
      feedback.textContent = `${correct ? "Richtig." : "Noch nicht richtig."} ${question.feedback}`;
      feedback.hidden = false;
    });

    const score = minimumScore();
    byId("minimum-status").textContent = state.minimumEvaluated
      ? `${score.points} von ${score.maximum} Multiple-Choice-Aufgaben richtig. Du kannst Antworten verändern und erneut auswerten.`
      : "";
  }

  function restoreInputs() {
    FINAL_TEST_DATA.minimumQuestions.forEach((question) => {
      const saved = state.minimumAnswers[question.id];
      if (saved === undefined) return;
      const input = document.querySelector(`input[name="${question.id}"][value="${saved}"]`);
      if (input) input.checked = true;
    });

    allOpenQuestions.forEach((question) => {
      const textarea = byId(`draft-${question.id}`);
      textarea.value = typeof state.drafts[question.id] === "string" ? state.drafts[question.id] : "";
      const checks = Array.isArray(state.checks[question.id]) ? state.checks[question.id] : [];
      document.querySelectorAll(`[data-criterion="${question.id}"]`).forEach((input) => {
        input.checked = checks[Number(input.value)] === true;
      });
      if (state.openRubrics.includes(question.id)) {
        document.querySelector(`[data-rubric="${question.id}"]`).hidden = false;
      }
    });

    renderMinimumFeedback();
    updateScoreboard();
  }

  function evaluateMinimum() {
    const missing = FINAL_TEST_DATA.minimumQuestions.filter((question) => state.minimumAnswers[question.id] === undefined);
    if (missing.length) {
      byId("minimum-status").textContent = `Bitte beantworte zuerst alle zehn Aufgaben. Es fehlen noch ${missing.length}.`;
      byId(`feedback-${missing[0].id}`).closest(".minimum-task").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    state.minimumEvaluated = true;
    renderMinimumFeedback();
    persistNow("Der Mindeststandard wurde ausgewertet und gespeichert.");
  }

  function showRubric(questionId) {
    const question = allOpenQuestions.find((candidate) => candidate.id === questionId);
    if (!question) return;
    const minimumLength = questionId === FINAL_TEST_DATA.expertQuestion.id ? 100 : 40;
    const text = (state.drafts[questionId] || "").trim();
    if (text.length < minimumLength) {
      byId("save-status").textContent = `Schreibe zunächst eine ausführlichere Antwort mit mindestens ${minimumLength} Zeichen.`;
      byId(`draft-${questionId}`).focus();
      return;
    }
    document.querySelector(`[data-rubric="${questionId}"]`).hidden = false;
    if (!state.openRubrics.includes(questionId)) state.openRubrics.push(questionId);
    persistNow("Die Kriterien wurden geöffnet. Prüfe deine Antwort ehrlich selbst.");
  }

  document.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", () => {
      state.minimumAnswers[input.name] = input.value;
      if (state.minimumEvaluated) {
        state.minimumEvaluated = false;
        renderMinimumFeedback();
      }
      persistNow("Antwort lokal gespeichert.");
    });
  });

  document.querySelectorAll("[data-draft]").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      state.drafts[textarea.dataset.draft] = textarea.value;
      schedulePersist();
    });
  });

  document.querySelectorAll("[data-criterion]").forEach((input) => {
    input.addEventListener("change", () => {
      const id = input.dataset.criterion;
      const question = allOpenQuestions.find((candidate) => candidate.id === id);
      const values = Array.isArray(state.checks[id])
        ? state.checks[id].slice(0, question.criteria.length)
        : Array(question.criteria.length).fill(false);
      values[Number(input.value)] = input.checked;
      state.checks[id] = values;
      persistNow("Selbstprüfung lokal gespeichert.");
    });
  });

  document.querySelectorAll("[data-show-rubric]").forEach((button) => {
    button.addEventListener("click", () => showRubric(button.dataset.showRubric));
  });

  byId("evaluate-minimum").addEventListener("click", evaluateMinimum);
  window.addEventListener("beforeunload", () => persistNow());

  loadState();
  restoreInputs();
  persistNow("Antworten werden lokal gespeichert.");
})();
