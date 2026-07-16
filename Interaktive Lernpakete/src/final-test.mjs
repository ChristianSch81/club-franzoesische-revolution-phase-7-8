const minimumQuestions = [
  {
    id: "m1",
    prompt: "Was kennzeichnet den Absolutismus unter Ludwig XIV.?",
    options: [
      "Der König teilte seine Macht gleichberechtigt mit einem gewählten Parlament.",
      "Der König beanspruchte die höchste staatliche Gewalt und berief sich auf das Gottesgnadentum.",
      "Alle drei Stände besaßen dieselben politischen Rechte."
    ],
    answer: 1,
    feedback: "Im Absolutismus beanspruchte der König die zentrale Herrschaftsgewalt und legitimierte sie unter anderem durch das Gottesgnadentum."
  },
  {
    id: "m2",
    prompt: "Welches Ziel verfolgten bedeutende Denker der Aufklärung?",
    options: [
      "Herrschaft sollte durch Vernunft, Rechte und die Teilung staatlicher Gewalt begrenzt werden.",
      "Die Vorrechte von Adel und Klerus sollten erweitert werden.",
      "Politische Entscheidungen sollten ausschließlich von der Kirche getroffen werden."
    ],
    answer: 0,
    feedback: "Aufklärer forderten Vernunft, individuelle Rechte und eine Begrenzung beziehungsweise Teilung staatlicher Macht."
  },
  {
    id: "m3",
    prompt: "Welcher Stand trug vor 1789 den größten Teil der Steuerlast?",
    options: [
      "Der Erste Stand",
      "Der Zweite Stand",
      "Der Dritte Stand"
    ],
    answer: 2,
    feedback: "Der Dritte Stand umfasste den größten Teil der Bevölkerung und trug den Hauptteil der Steuern."
  },
  {
    id: "m4",
    prompt: "Warum befand sich Frankreich 1788/1789 in einer schweren Krise?",
    options: [
      "Der Staat war hoch verschuldet, Lebensmittel waren teuer und die Ständeordnung wurde als ungerecht empfunden.",
      "Frankreich verfügte über zu hohe Steuereinnahmen und zu große Getreidevorräte.",
      "Adel und Klerus verlangten die sofortige Einführung einer Republik."
    ],
    answer: 0,
    feedback: "Staatsverschuldung, Versorgungskrise und soziale Ungleichheit verstärkten sich gegenseitig."
  },
  {
    id: "m5",
    prompt: "Was geschah beim Ballhausschwur im Juni 1789?",
    options: [
      "Die Abgeordneten des Dritten Standes versprachen, bis zur Ausarbeitung einer Verfassung zusammenzubleiben.",
      "Ludwig XVI. erklärte sich zum Kaiser der Franzosen.",
      "Die Sansculotten lösten die Nationalversammlung auf."
    ],
    answer: 0,
    feedback: "Der Ballhausschwur stärkte die Nationalversammlung und richtete sich auf die Schaffung einer Verfassung."
  },
  {
    id: "m6",
    prompt: "Welche Bedeutung hatte der Sturm auf die Bastille am 14. Juli 1789?",
    options: [
      "Er wurde zum Symbol für den Widerstand gegen königliche Willkür und den Beginn der revolutionären Umwälzung.",
      "Er stellte die absolute Herrschaft Ludwigs XVI. vollständig wieder her.",
      "Er beendete unmittelbar alle Kriege in Europa."
    ],
    answer: 0,
    feedback: "Die Bastille galt als Symbol königlicher Willkür; ihr Fall entwickelte große politische und symbolische Wirkung."
  },
  {
    id: "m7",
    prompt: "Welche Aussage gehört zur Erklärung der Menschen- und Bürgerrechte von 1789?",
    options: [
      "Menschen werden frei und gleich an Rechten geboren.",
      "Nur Adelige besitzen ein Recht auf persönliche Freiheit.",
      "Der König steht grundsätzlich über jedem Gesetz."
    ],
    answer: 0,
    feedback: "Freiheit und rechtliche Gleichheit gehören zu den zentralen Ansprüchen der Erklärung von 1789."
  },
  {
    id: "m8",
    prompt: "Welche Staatsform schuf die französische Verfassung von 1791?",
    options: [
      "Eine konstitutionelle Monarchie mit eingeschränkter Macht des Königs",
      "Eine uneingeschränkte absolute Monarchie",
      "Eine moderne parlamentarische Demokratie mit allgemeinem Frauenwahlrecht"
    ],
    answer: 0,
    feedback: "Die Verfassung begrenzte die königliche Macht, ließ die Monarchie jedoch zunächst bestehen."
  },
  {
    id: "m9",
    prompt: "Mit welcher Person ist die Terrorherrschaft besonders verbunden?",
    options: [
      "Maximilien de Robespierre",
      "Ludwig XIV.",
      "Klemens von Metternich"
    ],
    answer: 0,
    feedback: "Robespierre prägte als führendes Mitglied des Wohlfahrtsausschusses die Phase der Terrorherrschaft."
  },
  {
    id: "m10",
    prompt: "Wie gelangte Napoleon Bonaparte 1799 an die politische Macht?",
    options: [
      "Durch einen Staatsstreich",
      "Durch die Wahl zum Vertreter des Ersten Standes",
      "Durch den Wiener Kongress"
    ],
    answer: 0,
    feedback: "Napoleons Staatsstreich vom 18. Brumaire beendete 1799 das Direktorium."
  }
];

const regularQuestions = [
  {
    id: "r1",
    operator: "Erkläre",
    prompt: "Erkläre, weshalb der Konflikt um die Abstimmung in den Generalständen zur Gründung der Nationalversammlung führte.",
    support: "Stelle einen Ursache-Wirkungs-Zusammenhang her und verwende die Begriffe Generalstände, Dritter Stand, Abstimmung nach Ständen und Nationalversammlung.",
    criteria: [
      "Ich erkläre den Nachteil des Dritten Standes bei einer Abstimmung nach Ständen.",
      "Ich beschreibe die Forderung nach Abstimmung nach Köpfen beziehungsweise angemessener Vertretung.",
      "Ich stelle den Zusammenhang zur Erklärung des Dritten Standes als Nationalversammlung her.",
      "Ich formuliere eine nachvollziehbare Ursache-Wirkungs-Kette mit historischen Fachbegriffen."
    ]
  },
  {
    id: "r2",
    operator: "Analysiere",
    prompt: "Analysiere das Verfassungsschaubild von 1791. Arbeite die Verteilung der staatlichen Gewalten, die Stellung des Königs und die Grenzen der politischen Beteiligung heraus.",
    support: "Beziehe Pfeile, Beschriftungen und Personengruppen des Schaubilds als Belege ein.",
    image: "constitution",
    criteria: [
      "Ich unterscheide Legislative, Exekutive und Judikative und ordne ihnen Institutionen zu.",
      "Ich erkläre die Stellung des Königs einschließlich Ernennung der Minister und aufschiebendem Veto.",
      "Ich beschreibe das indirekte und an Steuerzahlungen gebundene Wahlrecht.",
      "Ich erläutere, dass Frauen und ärmere Bevölkerungsgruppen politisch ausgeschlossen blieben."
    ]
  },
  {
    id: "r3",
    operator: "Erläutere",
    prompt: "Erläutere den Widerspruch zwischen dem Anspruch der Menschenrechtserklärung und der politischen Wirklichkeit der Revolution.",
    support: "Verbinde eine Aussage der Menschenrechtserklärung mit mindestens zwei Beispielen politischer oder gesellschaftlicher Ausgrenzung.",
    criteria: [
      "Ich benenne Freiheit und rechtliche Gleichheit als zentrale Ansprüche.",
      "Ich erkläre die eingeschränkte politische Beteiligung von Frauen.",
      "Ich berücksichtige die Benachteiligung nicht vermögender Bürger beim Wahlrecht.",
      "Ich erläutere ausdrücklich den Widerspruch zwischen allgemeinem Anspruch und begrenzter Umsetzung."
    ]
  },
  {
    id: "r4",
    operator: "Analysiere",
    prompt: "Analysiere Ursachen und Folgen der Terrorherrschaft von 1793/1794.",
    support: "Unterscheide äußere Bedrohungen, innere Konflikte und die Folgen für politische Gegner und Bevölkerung.",
    criteria: [
      "Ich berücksichtige Krieg und die Angst vor einem Sturz der Revolution.",
      "Ich beschreibe innere Konflikte und die Macht des Wohlfahrtsausschusses.",
      "Ich erläutere Verfolgungen, Revolutionstribunale und Hinrichtungen als Folgen.",
      "Ich erkläre, weshalb die Terrorherrschaft den eigenen Freiheitsansprüchen widersprach."
    ]
  },
  {
    id: "r5",
    operator: "Beurteile",
    prompt: "Beurteile, ob Napoleon die Errungenschaften der Französischen Revolution eher bewahrte oder beendete.",
    support: "Formuliere ein Sachurteil, das mindestens ein Argument für Bewahrung und ein Argument für Beendigung gegeneinander abwägt.",
    criteria: [
      "Ich nenne eine bewahrte Errungenschaft, etwa Rechtsgleichheit, Verwaltung oder Code civil.",
      "Ich nenne eine Einschränkung, etwa Zensur, autoritäre Herrschaft oder Kaiserkrönung.",
      "Ich gewichte die Argumente und beziehe sie auf revolutionäre Ziele.",
      "Ich formuliere ein begründetes und differenziertes Gesamturteil."
    ]
  }
];

const expertQuestion = {
  id: "e1",
  operator: "Interpretiere",
  prompt: "Interpretiere das Herrscherporträt Ludwigs XIV. von Hyacinthe Rigaud als Darstellung absolutistischer Macht.",
  support: "Arbeite in den Schritten Beschreiben, Untersuchen und Deuten. Belege deine Aussagen an konkreten Bildmerkmalen.",
  criteria: [
    "Ich nenne Bildart, dargestellte Person, Maler und Entstehungszeit.",
    "Ich beschreibe Haltung, Blick, Kleidung und Umgebung zunächst ohne Wertung.",
    "Ich untersuche Herrschaftszeichen wie Krönungsmantel, Lilien, Schwert, Säule und Thron.",
    "Ich untersuche Bildaufbau, Farben, Licht und die hervorgehobene Stellung des Königs.",
    "Ich deute, welche Eigenschaften und welches Herrschaftsverständnis vermittelt werden sollen.",
    "Ich ordne das Bild historisch in den Absolutismus und das Gottesgnadentum ein.",
    "Ich erläutere den Zweck und die beabsichtigte Wirkung des Porträts.",
    "Ich formuliere ein begründetes Gesamturteil über das Bild als Mittel politischer Selbstdarstellung."
  ]
};

export const finalTestData = {
  version: 1,
  storageKey: "franzrev-abschlusstest",
  minimumQuestions,
  regularQuestions,
  expertQuestion
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function minimumMarkup(question, index) {
  const options = question.options.map((option, optionIndex) => `<label class="test-option">
              <input type="radio" name="${question.id}" value="${optionIndex}">
              <span>${escapeHtml(option)}</span>
            </label>`).join("\n");
  return `<fieldset class="test-task minimum-task" data-minimum-question="${question.id}">
          <legend><span class="task-number">${index + 1}</span>${escapeHtml(question.prompt)}</legend>
          <div class="test-options">${options}</div>
          <p id="feedback-${question.id}" class="test-feedback" hidden></p>
        </fieldset>`;
}

function criteriaMarkup(question) {
  return question.criteria.map((criterion, index) => `<label class="criterion">
                <input type="checkbox" data-criterion="${question.id}" value="${index}">
                <span>${escapeHtml(criterion)}</span>
              </label>`).join("\n");
}

function regularMarkup(question, index, constitutionSrc) {
  const image = question.image === "constitution"
    ? `
          <figure class="test-figure">
            <img src="${escapeHtml(constitutionSrc)}" alt="Schaubild zur französischen Verfassung von 1791 mit König, Nationalversammlung, Gerichten und eingeschränktem Wahlrecht" width="1220" height="960">
            <figcaption>Verfassungsschema 1791, nach der Darstellung aus Lernpaket 7.</figcaption>
          </figure>`
    : "";
  return `<article class="test-task open-task" data-open-task="${question.id}">
          <div class="open-task-heading">
            <span class="operator">${escapeHtml(question.operator)}</span>
            <h3>${index + 1}. ${escapeHtml(question.prompt)}</h3>
          </div>
          <p class="task-support">${escapeHtml(question.support)}</p>${image}
          <label class="textarea-label" for="draft-${question.id}">Deine Antwort</label>
          <textarea id="draft-${question.id}" data-draft="${question.id}" rows="8" spellcheck="true"></textarea>
          <button class="test-button secondary" type="button" data-show-rubric="${question.id}">Kriterien zur Selbstprüfung anzeigen</button>
          <fieldset class="rubric" data-rubric="${question.id}" hidden>
            <legend>Selbstprüfung: Trifft dies auf deine Antwort zu?</legend>
            ${criteriaMarkup(question)}
          </fieldset>
        </article>`;
}

function logoMarkup(logoSrc, schoolUrl) {
  if (!logoSrc) return "";
  return `<a class="test-logo-link" href="${escapeHtml(schoolUrl)}" target="_blank" rel="noopener" aria-label="Website der Alemannenschule Wutöschingen öffnen">
          <img src="${escapeHtml(logoSrc)}" alt="Logo der Alemannenschule Wutöschingen">
        </a>`;
}

export function renderFinalTestDocument({
  styles,
  runtime,
  homeHref,
  constitutionSrc,
  portraitSrc,
  logoSrc = "",
  schoolUrl = "https://asw-wutoeschingen.de"
}) {
  const minimum = minimumQuestions.map(minimumMarkup).join("\n");
  const regular = regularQuestions.map((question, index) => regularMarkup(question, index, constitutionSrc)).join("\n");
  const serialized = JSON.stringify(finalTestData).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Interaktiver Abschlusstest zur Französischen Revolution für Geschichte Phase 7/8">
  <title>Abschlusstest · Französische Revolution</title>
  <style>${styles}</style>
</head>
<body>
  <a class="skip-link" href="#main">Zum Abschlusstest springen</a>
  <header class="test-header">
    <div class="test-header-inner">
      <div>
        <p class="series-title">Geschichte Phase 7/8: Die Französische Revolution</p>
        <h1>Abschlusstest</h1>
        <p>10 Multiple-Choice-Aufgaben, 5 operationalisierte Aufgaben und eine Bildinterpretation</p>
      </div>
      ${logoMarkup(logoSrc, schoolUrl)}
    </div>
  </header>

  <main id="main" class="test-page">
    <nav class="test-nav" aria-label="Seitennavigation">
      <a class="test-button secondary" href="${escapeHtml(homeHref)}">← Zur Übersicht</a>
      <span id="save-status" role="status" aria-live="polite">Antworten werden lokal gespeichert.</span>
    </nav>

    <section class="test-scoreboard" aria-labelledby="scoreboard-heading">
      <div>
        <p class="eyebrow">Aktueller Stand</p>
        <h2 id="scoreboard-heading">Auswertung des Abschlusstests</h2>
      </div>
      <div class="score-grid">
        <div><span>M8</span><strong id="score-M">0 / 10</strong></div>
        <div><span>R8</span><strong id="score-R">0 / 20</strong></div>
        <div><span>E8</span><strong id="score-E">0 / 8</strong></div>
        <div class="score-total"><span>Gesamt</span><strong id="score-total">0%</strong></div>
      </div>
      <p id="test-completion-status">Der Abschlusstest wurde noch nicht vollständig bearbeitet.</p>
    </section>

    <section class="test-section section-M" aria-labelledby="minimum-heading">
      <div class="section-heading">
        <div>
          <p class="level-label">M8 · Mindeststandard</p>
          <h2 id="minimum-heading">Grundwissen überprüfen</h2>
        </div>
        <p>Bei jeder Aufgabe ist genau eine Antwort richtig.</p>
      </div>
      <div class="task-stack">${minimum}</div>
      <button id="evaluate-minimum" class="test-button primary" type="button">Mindeststandard auswerten</button>
      <p id="minimum-status" class="section-status" role="status" aria-live="polite"></p>
    </section>

    <section class="test-section section-R" aria-labelledby="regular-heading">
      <div class="section-heading">
        <div>
          <p class="level-label">R8 · Regelstandard</p>
          <h2 id="regular-heading">Zusammenhänge erklären und beurteilen</h2>
        </div>
        <p>Formuliere vollständige Antworten. Öffne danach die Kriterien und prüfe deine Arbeit ehrlich selbst.</p>
      </div>
      <div class="task-stack">${regular}</div>
    </section>

    <section class="test-section section-E" aria-labelledby="expert-heading">
      <div class="section-heading">
        <div>
          <p class="level-label">E8 · Expertenstandard</p>
          <h2 id="expert-heading">Ein Herrscherbild interpretieren</h2>
        </div>
        <p>Arbeite nach der Methode des ersten Lernpakets.</p>
      </div>
      <article class="test-task open-task expert-task" data-open-task="${expertQuestion.id}">
        <div class="open-task-heading">
          <span class="operator">${escapeHtml(expertQuestion.operator)}</span>
          <h3>${escapeHtml(expertQuestion.prompt)}</h3>
        </div>
        <p class="task-support">${escapeHtml(expertQuestion.support)}</p>
        <div class="expert-layout">
          <figure class="test-figure portrait-figure">
            <img src="${escapeHtml(portraitSrc)}" alt="Herrscherporträt Ludwigs XIV. im Krönungsornat von Hyacinthe Rigaud" width="1057" height="1280">
            <figcaption>Ludwig XIV. im Krönungsornat, Hyacinthe Rigaud, 1701.</figcaption>
          </figure>
          <div class="method-box">
            <h4>Arbeitsschritte</h4>
            <ol>
              <li><strong>Beschreiben:</strong> Person, Haltung, Kleidung und Umgebung sachlich erfassen.</li>
              <li><strong>Untersuchen:</strong> Symbole, Farben, Bildaufbau, Licht und hervorgehobene Merkmale analysieren.</li>
              <li><strong>Deuten:</strong> Zweck, Wirkung und Herrschaftsaussage historisch einordnen.</li>
            </ol>
          </div>
        </div>
        <label class="textarea-label" for="draft-${expertQuestion.id}">Deine Bildinterpretation</label>
        <textarea id="draft-${expertQuestion.id}" data-draft="${expertQuestion.id}" rows="14" spellcheck="true"></textarea>
        <button class="test-button secondary" type="button" data-show-rubric="${expertQuestion.id}">Kriterien zur Selbstprüfung anzeigen</button>
        <fieldset class="rubric" data-rubric="${expertQuestion.id}" hidden>
          <legend>Selbstprüfung: Trifft dies auf deine Interpretation zu?</legend>
          ${criteriaMarkup(expertQuestion)}
        </fieldset>
      </article>
    </section>
  </main>

  <footer class="test-footer">
    <div>Autor: Christian Schwend</div>
  </footer>
  <script>const FINAL_TEST_DATA = ${serialized};</script>
  <script>${runtime}</script>
</body>
</html>`;
}
