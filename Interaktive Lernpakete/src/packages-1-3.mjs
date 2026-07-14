export const packages = [
  {
    id: "paket-01",
    number: 1,
    slug: "sonnenkoenig",
    title: "Die Welt des „Sonnenkönigs“",
    subtitle: "Absolutistische Herrschaft, Versailles und die Inszenierung Ludwigs XIV.",
    focus: "Herrschaftsrechte, Hofstaat, Versailles, Herrscherbild und demokratischer Bildtransfer",
    inputPlan: [
      {
        minutes: 15,
        phase: "Bildimpuls und Leitfrage",
        teacherInput: "Zeigt das Herrscherporträt Ludwigs XIV. zunächst ohne Bildtitel und stellt die Leitfrage: Wie kann ein Bild Macht sichtbar machen?",
        learnerActivity: "Notiert drei Beobachtungen, tauscht Hypothesen im Tandem aus und formuliert eine erste Vermutung zur Bildabsicht.",
        materials: "Inputfolie mit Ludwig XIV.; Porträt von Rigaud; digitales Beobachtungsfeld",
        differentiation: "M: Wortbank zu Haltung und Kleidung; R: Beobachtung und Wirkung trennen; E: eine alternative Bildabsicht formulieren."
      },
      {
        minutes: 20,
        phase: "Begriffsnetz Absolutismus",
        teacherInput: "Ordnet Ludwig XIV. knapp in das monarchisch geprägte Europa ein und klärt Absolutismus, Gottesgnadentum und ungeteilte Herrschaftsmacht.",
        learnerActivity: "Baut ein Begriffsnetz und bearbeitet die Aufgaben zu den Rechten des Königs und zu „Der Staat bin ich“.",
        materials: "Inputfolie Europa vor der Revolution; Sachtext „Der absolute Herrscher“; Aufgaben 1 und 3",
        differentiation: "M: vorgegebene Begriffskarten; R: Ursache-Wirkungs-Pfeile ergänzen; E: einen Widerspruch zu heutiger demokratischer Herrschaft benennen."
      },
      {
        minutes: 35,
        phase: "Quellenlabor: Rang und Sonnensymbol",
        teacherInput: "Modelliert an einem Bilddetail den Dreischritt Beobachtung - Beleg - Aussage, ohne die Gesamtdeutung vorzugeben.",
        learnerActivity: "Prüft Q1, Q3 und Q4, erklärt die Wahl der Sonne als Symbol und rekonstruiert aus dem Empfang der Gesandten den Rangabstand.",
        materials: "Q1 Empfang der Gesandten; Q3 Erklärung der Sonnensymbolik; Q4 Schaumünze; Aufgaben 2 und 4",
        differentiation: "M: Belege auswählen; R: mindestens drei Beleg-Wirkungs-Paare erklären; E: Grenzen der Quellen für die Deutung prüfen."
      },
      {
        minutes: 30,
        phase: "Versailles als Herrschaftsinstrument",
        teacherInput: "Gibt einen kurzen Orientierungsimpuls zu Hofstaat, Etikette, Parkanlage und der Bindung des Adels an Versailles.",
        learnerActivity: "Arbeitet arbeitsteilig zu Hofstaat, Leben am Hof, Park und zentraler Schlossachse und führt die Ergebnisse in einem Herrschaftsmodell zusammen.",
        materials: "Sachtexte zu Versailles und Adel; Q2 Tageszeremoniell; Luftbild; Aufgaben 5, 7, 9 und 10",
        differentiation: "M: Parkmerkmale und Pro-/Contra-Karten; R: Lexikonartikel oder Architekturbegründung; E: historisch belegter Adelsdialog."
      },
      {
        minutes: 35,
        phase: "Vergleich und europäische Vorbildwirkung",
        teacherInput: "Führt die Vergleichskriterien Achse, Symmetrie, Baukörper, Garten und Repräsentation ein.",
        learnerActivity: "Vergleicht Versailles mit Ludwigsburg und untersucht an einer Offline-Schlosskarte, wie Versailles andernorts aufgegriffen wurde.",
        materials: "Luftbilder Versailles und Ludwigsburg; Offline-Karten Herrenchiemsee, Schönbrunn und Peterhof; Aufgaben 11 und 12",
        differentiation: "M: Vergleichsmatrix mit Satzanfängen; R: zwei Bildbelege und eine Ursache-Wirkungs-Kette; E: zwischen Kopie, Vorbild und eigenständiger Adaption unterscheiden."
      },
      {
        minutes: 30,
        phase: "Herrscherbildanalyse und Transfer",
        teacherInput: "Erinnert an Beschreiben - Untersuchen - Deuten und macht transparent, dass Bildaussagen immer mit sichtbaren Details belegt werden müssen.",
        learnerActivity: "Analysiert das Porträt, beurteilt Rigauds Auftragserfüllung und entwirft ein demokratisches Porträt-Briefing als Kontrast.",
        materials: "Rigaud-Porträt; Methodenkasten; Infokasten zu Mantel, Lilien und Orden; Aufgaben 13 bis 15",
        differentiation: "M: Satzstarter und Symbolhilfe; R: Behauptung-Beleg-Wirkung; E: alternatives Deutungsangebot und begründeter Gegenwartstransfer."
      },
      {
        minutes: 15,
        phase: "Galerie, Rückmeldung und Sicherung",
        teacherInput: "Moderiert einen stillen Galeriegang und bündelt die Leitfrage: Wie machte Ludwig XIV. seine Macht sichtbar und wirksam?",
        learnerActivity: "Gibt kriterienbezogenes Partnerfeedback, überarbeitet einen Satz und formuliert ein Exit-Ticket mit zwei Belegen.",
        materials: "Digitale Produkte; Kriterienlisten; Exit-Ticket",
        differentiation: "M: Rückmeldeicons mit Satzanfängen; R: Zusammenhang präzisieren; E: eine Grenze der absolutistischen Inszenierung ergänzen."
      }
    ],
    tasks: [
      {
        id: "p1-a1",
        number: 1,
        tag: "M",
        levels: ["M"],
        kind: "choice",
        title: "Rechte des Königs",
        prompt: "Welche Befugnisse nennt der Sachtext für den absoluten König? Markiere alle passenden Aussagen.",
        material: "Im Abschnitt „Der absolute Herrscher“ wird beschrieben, welche Entscheidungen Ludwig XIV. selbst traf oder beeinflusste.",
        hint: "Achte auf Tätigkeiten, bei denen der König anordnet, bestimmt oder entscheidet.",
        success: "Richtig. Gesetzgebung, Steuern, Minister, Gerichte und Außenpolitik waren im Text der königlichen Macht zugeordnet.",
        multiple: true,
        options: [
          { text: "Gesetze erlassen", correct: true },
          { text: "die Höhe der Steuern bestimmen", correct: true },
          { text: "Ministern Anweisungen geben", correct: true },
          { text: "Entscheidungen der Gerichte beeinflussen", correct: true },
          { text: "über Krieg und Frieden entscheiden", correct: true },
          { text: "sich von einem Parlament kontrollieren lassen", correct: false },
          { text: "von unabhängigen Gerichten abgesetzt werden können", correct: false },
          { text: "sein Amt durch eine Volkswahl erhalten", correct: false }
        ]
      },
      {
        id: "p1-a2",
        number: 2,
        tag: "M",
        levels: ["M"],
        kind: "choice",
        title: "Die Sonne als Herrschaftssymbol",
        prompt: "Welche zwei Quellenbelege erklären tragfähig, weshalb Ludwig XIV. die Sonne als Symbol wählte?",
        material: "Q3 erklärt die Bedeutung der Sonne am Hof. Q4 zeigt eine Schaumünze mit Sonnensymbol. Q1 zeigt den Empfang ausländischer Gesandter.",
        hint: "Gesucht sind Belege für Glanz, Einzigartigkeit und die Beziehung zwischen König und Hofstaat.",
        success: "Genau. Q3 liefert die Erklärung des Vergleichs, Q4 belegt das verwendete Sonnensymbol und den Beinamen.",
        multiple: true,
        options: [
          { text: "Q3: Wie die Sonne den Sternen Licht gibt, soll der Glanz des Königs auf den Hof ausstrahlen.", correct: true },
          { text: "Q4: Die Münze verbindet Ludwig XIV. sichtbar mit der Sonne und dem Beinamen „Sonnenkönig“.", correct: true },
          { text: "Q1: Der Handkuss der Gesandten erklärt unmittelbar die Wahl der Sonne.", correct: false },
          { text: "Die Sonne wurde gewählt, weil Ludwig XIV. einen neuen Kalender erfand.", correct: false }
        ]
      },
      {
        id: "p1-a3",
        number: 3,
        tag: "M",
        levels: ["M"],
        kind: "choice",
        title: "„Der Staat bin ich“",
        prompt: "Welche Erklärung gibt die Bedeutung des Satzes im Material am besten wieder?",
        material: "Ludwig XIV. verstand sich als König „von Gottes Gnaden“ und musste seine Entscheidungen nach eigener Auffassung nur vor Gott rechtfertigen.",
        hint: "Prüfe, wer über dem König stand und wem er politisch verantwortlich war.",
        success: "Richtig. Der Satz fasst Ludwigs Anspruch auf ungeteilte, göttlich begründete Herrschaft zusammen.",
        multiple: false,
        options: [
          { text: "Der König beanspruchte die höchste staatliche Macht und sah sich außer vor Gott niemandem politisch verantwortlich.", correct: true },
          { text: "Der König durfte nur ausführen, was das Parlament zuvor beschlossen hatte.", correct: false },
          { text: "Der Satz bedeutet, dass alle Untertanen gleichberechtigt über den Staat entschieden.", correct: false }
        ]
      },
      {
        id: "p1-a4",
        number: 4,
        tag: "R",
        levels: ["R"],
        kind: "text",
        title: "Begegnung ausländischer Gesandter",
        prompt: "Beschreibe, wie die niederländischen Gesandten Ludwig XIV. in Q1 begegnen, und erkläre, welche Aussage über Rang und Macht dadurch entsteht.",
        material: "Q1 zeigt den sitzenden und bedeckten König. Die Gesandten stehen oder beugen sich; einer küsst die Hand des Königs.",
        hint: "Formuliere erst wertfrei, was du siehst. Deute anschließend Haltung, Sitzordnung und Handkuss.",
        success: "Dein Text ist bereit für die Kriterienprüfung. Kontrolliere, ob jede Deutung einen sichtbaren Bildbeleg besitzt.",
        minChars: 140,
        starter: "In Q1 ist zu sehen, dass … Dies zeigt einen Rangabstand, weil …",
        planning: [
          "Drei sichtbare Details notieren",
          "Jedem Detail eine mögliche Wirkung zuordnen",
          "Den Zusammenhang zwischen Verhalten und Herrschaft erklären"
        ],
        criteria: [
          "mindestens drei konkrete Bildbelege",
          "Beschreibung und Deutung erkennbar getrennt",
          "Aussage zu Rangabstand oder Überlegenheit",
          "vollständiger Zusammenhangssatz"
        ]
      },
      {
        id: "p1-a5",
        number: 5,
        tag: "R",
        levels: ["R"],
        kind: "text",
        title: "Lexikonartikel „Hofstaat“",
        prompt: "Verfasse einen knappen Lexikonartikel, der den Hofstaat definiert und erklärt, wie er Ludwig XIV. half, den Adel zu kontrollieren.",
        material: "Am Hof lebten Adlige und Bedienstete. Ämter, Titel, Pensionen, Unterhaltung und die Nähe zum König boten Vorteile; Etikette und teures Hofleben machten viele Adlige abhängig.",
        hint: "Ein Lexikonartikel braucht mehr als eine Definition: Erkläre auch die politische Funktion.",
        success: "Prüfe jetzt, ob dein Artikel Definition, Merkmale und die Wirkung auf Ludwigs Macht miteinander verbindet.",
        minChars: 220,
        starter: "Hofstaat, der: Gesamtheit der … In Versailles … Dadurch …",
        planning: [
          "Oberbegriff und Mitglieder",
          "Aufgaben und Leben am Hof",
          "Vorteile für Adlige",
          "Abhängigkeit als politische Wirkung"
        ],
        criteria: [
          "sachlich passende Definition",
          "mindestens drei Merkmale des Hoflebens",
          "Ursache-Wirkungs-Satz zur Bindung des Adels",
          "neutraler Lexikonstil"
        ]
      },
      {
        id: "p1-a6",
        number: 6,
        tag: "R",
        levels: ["R"],
        kind: "text",
        title: "Ludwig XIV. als heutiger Staatschef?",
        prompt: "Diskutiert zu zweit, ob ein Herrscher wie Ludwig XIV. zu einem heutigen demokratischen Staatsamt passen würde. Verfasst danach eine gemeinsame Stellungnahme.",
        material: "Ludwigs Herrschaft: ungeteilte Macht, Gottesgnadentum, Unterordnung des Hofes. Demokratie heute: Volkssouveränität, Gewaltenteilung, Rechtsbindung und politische Verantwortlichkeit.",
        hint: "Beurteilt nicht die Person nach heutigen Vorlieben, sondern vergleicht Herrschaftsmerkmale mit demokratischen Kriterien.",
        success: "Die Stellungnahme kann nun mit einem Lernpartner geprüft werden: Sind Urteil, Gegenargument und Materialbelege vorhanden?",
        minChars: 300,
        starter: "Ein Herrscher wie Ludwig XIV. wäre als heutiger demokratischer Staatschef …, weil … Zwar …, aber … Daher …",
        planning: [
          "Ludwigs Legitimation und Machtumfang",
          "demokratische Vergleichskriterien",
          "zwei begründete Argumente",
          "ein Gegenargument",
          "gemeinsames Urteil"
        ],
        criteria: [
          "mindestens zwei Materialbelege zu Ludwig XIV.",
          "Vergleich mit mindestens zwei Demokratiekriterien",
          "Reaktion auf ein Gegenargument",
          "nachvollziehbares Schlussurteil"
        ]
      },
      {
        id: "p1-a7",
        number: 7,
        tag: "E",
        levels: ["E"],
        kind: "text",
        title: "Rollenspiel zweier Adliger",
        prompt: "Gestalte ein kurzes Rollenspiel: Zwei Adlige beraten, ob sie am Hof in Versailles leben wollen. Beide Figuren sollen unterschiedliche Interessen vertreten und begründet entscheiden.",
        material: "Mögliche Vorteile: Nähe zum König, Ehre, Ämter, Titel, Pensionen und Unterhaltung. Mögliche Nachteile: Abhängigkeit, Schulden, strenge Etikette und Verlust eigener Macht.",
        hint: "Nutze das Material als historische Grundlage, aber schreibe den Dialog selbst. Die Figuren dürfen zu verschiedenen Ergebnissen kommen.",
        success: "Dein Expertenprodukt ist bereit für Rollenlesen und Kriterienfeedback; eine automatische Inhaltsnote ersetzt diese Prüfung nicht.",
        minChars: 450,
        starter: "Adlige A: Seit Wochen denke ich darüber nach, nach Versailles zu ziehen …\nAdliger B: Bevor du dich entscheidest, solltest du bedenken …",
        planning: [
          "Interesse und Ausgangslage von Figur A",
          "Interesse und Ausgangslage von Figur B",
          "mindestens zwei Pro- und zwei Contra-Belege",
          "Konflikt oder Gegenrede",
          "begründete Entscheidung beider Figuren"
        ],
        criteria: [
          "mindestens sechs abwechselnde Äußerungen",
          "historisch plausible Rollenperspektiven",
          "mindestens vier Materialbelege insgesamt",
          "Argumente reagieren aufeinander",
          "beide Entscheidungen sind begründet"
        ]
      },
      {
        id: "p1-a9",
        number: 9,
        tag: "M",
        levels: ["M"],
        kind: "choice",
        title: "Der Park von Versailles",
        prompt: "Welche Merkmale beschreiben den Park im Luftbild und Begleittext passend?",
        material: "Das Luftbild zeigt Schloss und Park aus der Höhe; der Begleittext nennt die genaue Planung, Alleen, Beete, Wasserbecken und Springbrunnen.",
        hint: "Achte auf Formen, Achsen, Wiederholungen und Wasserflächen.",
        success: "Richtig. Der Park wirkt groß, streng geplant, symmetrisch und durch Achsen, Beete sowie Wasseranlagen geordnet.",
        multiple: true,
        options: [
          { text: "großflächig", correct: true },
          { text: "streng und geometrisch geplant", correct: true },
          { text: "symmetrisch angelegt", correct: true },
          { text: "von einer langen Mittelachse geprägt", correct: true },
          { text: "mit ornamentalen Beeten und geraden Alleen gestaltet", correct: true },
          { text: "mit Wasserbecken und vielen Springbrunnen ausgestattet", correct: true },
          { text: "als ungeordnete Wildnis belassen", correct: false },
          { text: "von zufälligen, krummen Wegen ohne erkennbare Ordnung geprägt", correct: false }
        ]
      },
      {
        id: "p1-a10",
        number: 10,
        tag: "R",
        levels: ["R"],
        kind: "text",
        title: "Das Schlafzimmer im Zentrum",
        prompt: "Begründe, weshalb das königliche Schlafzimmer zentral im Hauptbau und auf der beherrschenden Achse von Versailles lag.",
        material: "Im Luftbild liegt das Schlafzimmer im Zentrum des Hauptbaus auf der Mittelachse von Schloss und Park. Am Hof war auch der Tagesbeginn des Königs Teil des Zeremoniells.",
        hint: "Verbinde die räumliche Lage mit der Sonnensymbolik und mit Ludwigs Stellung im Hofstaat. Behaupte nichts über eine unbelegte Himmelsrichtung.",
        success: "Prüfe, ob deine Begründung zwei räumliche Belege und die symbolische Aussage vom König als Zentrum enthält.",
        minChars: 160,
        starter: "Die Lage ist nicht zufällig: Im Luftbild … Symbolisch … Praktisch …",
        planning: [
          "Lage im Hauptbau",
          "Bezug zur Mittelachse",
          "Hofzeremoniell",
          "König als Zentrum wie die Sonne"
        ],
        criteria: [
          "mindestens zwei räumliche Bildbelege",
          "Verknüpfung mit Vorwissen zur Sonnensymbolik",
          "Erklärung von praktischer oder symbolischer Wirkung",
          "keine unbelegte Behauptung zum Sonnenaufgang"
        ]
      },
      {
        id: "p1-a11",
        number: 11,
        tag: "R",
        levels: ["R"],
        kind: "text",
        title: "Versailles und Ludwigsburg vergleichen",
        prompt: "Vergleiche die beiden Schlossanlagen und erkläre anschließend, weshalb Versailles besonders für regierende Fürsten und europäische Höfe zum Vorbild wurde.",
        material: "Beide Luftbilder zeigen repräsentative Schlossanlagen mit Flügeln, Höfen, Achsen und Gärten. Versailles ist größer und ausgedehnter; Pracht, Hofzeremoniell und Garten machten Rang und Macht sichtbar.",
        hint: "Ein Vergleich braucht Gemeinsamkeiten und Unterschiede nach denselben Kriterien. Leite daraus erst dann die Vorbildwirkung ab.",
        success: "Dein Vergleich ist bereit zur Prüfung: Stimmen die Bildbelege, und führt die Ursache-Wirkungs-Kette bis zu Prestige und Nachahmung?",
        minChars: 300,
        starter: "Beide Anlagen … Während Versailles …, zeigt Ludwigsburg … Versailles wurde zum Vorbild, weil … Dadurch …",
        planning: [
          "Gemeinsamkeit zu Achse oder Symmetrie",
          "Gemeinsamkeit zu Baukörper oder Garten",
          "Unterschied in Größe oder Bauform",
          "Pracht als sichtbares Prestige",
          "Nachahmung als politische Selbstdarstellung"
        ],
        criteria: [
          "mindestens zwei Gemeinsamkeiten",
          "mindestens ein belegter Unterschied",
          "vergleichende Formulierungen",
          "erklärte Ursache-Wirkungs-Kette zur Vorbildwirkung"
        ]
      },
      {
        id: "p1-a12",
        number: 12,
        tag: "R",
        levels: ["R"],
        kind: "text",
        title: "Versailles als Vorbild - Offline-Recherche",
        prompt: "Wähle eine Schlosskarte aus und verfasse ein Museumsetikett: Weshalb kann die Anlage als Nachahmung oder Adaption von Versailles gelten?",
        material: "Herrenchiemsee: von Ludwig II. ausdrücklich nach Versailler Vorbildern geplant, mit Spiegelsaal und formaler Gartenanlage (Bayerische Schlösserverwaltung). Schönbrunn: habsburgische Residenz mit axialer Barockanlage, Ehrenhof und geometrischem Garten (Schloss Schönbrunn). Peterhof: kaiserliche Residenz mit Terrassen, Achsen und großer Brunneninszenierung (Peterhof State Museum).",
        hint: "Nenne nicht nur einen Schlossnamen. Verbinde zwei konkrete Merkmale mit der Wirkung von Versailles und gib die Institution der Schlosskarte als Quelle an.",
        success: "Das Museumsetikett kann nun auf Quellenangabe, zwei Merkmalsbelege und eine begründete Einordnung geprüft werden.",
        minChars: 230,
        starter: "Schloss … in … | Quelle: …\nDie Anlage greift Versailles auf, indem … Ein zweites Merkmal ist … Daher …",
        planning: [
          "Schloss und Ort",
          "Institution als Quelle",
          "Versailles-Merkmal 1",
          "Versailles-Merkmal 2",
          "Einordnung als Nachahmung oder Adaption"
        ],
        criteria: [
          "vollständige Quellenangabe aus der Schlosskarte",
          "mindestens zwei konkrete Merkmalsvergleiche",
          "erklärte Repräsentationswirkung",
          "begründete, nicht bloß behauptete Einordnung"
        ]
      },
      {
        id: "p1-a13",
        number: 13,
        tag: "MRE8",
        levels: ["M", "R", "E"],
        kind: "text",
        title: "Herrscherbild in drei Schritten analysieren",
        prompt: "Analysiere Rigauds Porträt Ludwigs XIV. nach den Schritten Beschreiben - Untersuchen - Deuten. Belege deine Deutung mit mindestens drei sichtbaren Details.",
        material: "Hyacinthe Rigaud malte Ludwig XIV. 1701 im Krönungsornat. Sichtbar sind unter anderem Zepter, Schwert, Krone, Thron, Mantel mit Lilien, Orden, Podest, Vorhang, auffällige Haltung und gezielte Lichtführung.",
        hint: "M-Hilfe: Nutze die Satzstarter. R-Weg: Formuliere Behauptung - Bildbeleg - Wirkung. E-Erweiterung: Prüfe zusätzlich eine alternative oder begrenzende Deutung.",
        success: "Die Analyse ist ein offenes Lernprodukt. Prüfe sie mit den Kriterien und lass mindestens eine Deutung durch einen Lernpartner hinterfragen.",
        minChars: 360,
        starter: "Beschreiben: Das Porträt von … zeigt …\nUntersuchen: Auffällig ist …; dies wirkt …\nDeuten: Das Bild soll den Eindruck erzeugen, dass …, denn …",
        planning: [
          "Basisdaten und wertfreie Gesamtbeschreibung",
          "Haltung, Blick und Kleidung",
          "mindestens drei Herrschaftszeichen",
          "Licht, Bildzentrum oder Perspektive",
          "Bildabsicht mit Belegen",
          "E-Erweiterung: alternative Lesart oder Grenze"
        ],
        criteria: [
          "alle drei Analyseschritte erkennbar",
          "mindestens drei konkrete Bildbelege",
          "Wirkung von Symbolen oder Gestaltung erklärt",
          "Bildbotschaft als beabsichtigte Inszenierung formuliert",
          "Beschreibung und Wertung nicht vermischt"
        ]
      },
      {
        id: "p1-a14",
        number: 14,
        tag: "M8",
        levels: ["M"],
        kind: "text",
        title: "Hat Rigaud seinen Auftrag gut erfüllt?",
        prompt: "Beurteile, ob der Maler Ludwig XIV. erfolgreich als glanzvollen und mächtigen König inszeniert hat. Begründe dein Urteil mit mindestens zwei Bildbelegen.",
        material: "Rigaud kannte die Bedeutung von Krönungsmantel, Bourbonenlilien und Orden. Im Bild heben Größe, Licht, Farben, Haltung und Herrschaftszeichen den König hervor.",
        hint: "Du darfst „ja“, „teilweise“ oder „nein“ urteilen. Entscheidend sind passende Belege aus dem Bild.",
        success: "Prüfe: Ist dein Urteil eindeutig, und werden mindestens zwei Bildbelege in ihrer Wirkung erklärt?",
        minChars: 140,
        starter: "Der Maler hat seinen Auftrag … umgesetzt. Das erkennt man erstens an …, was … bewirkt. Zweitens …",
        planning: [
          "Urteil wählen",
          "Beleg aus Herrschaftszeichen",
          "Beleg aus Licht, Farbe, Haltung oder Perspektive",
          "Wirkung beider Belege"
        ],
        criteria: [
          "klares Urteil",
          "mindestens zwei konkrete Bildbelege",
          "Wirkung der Belege erklärt",
          "vollständige Begründung"
        ]
      },
      {
        id: "p1-a15",
        number: 15,
        tag: "E8",
        levels: ["E"],
        kind: "text",
        title: "Ein demokratisches Porträt-Briefing",
        prompt: "Entwirf ein Briefing für ein heutiges Porträt des Bundeskanzlers oder der Bundeskanzlerin. Begründe mindestens vier Bildelemente jeweils durch demokratische Aussage und Kontrast zu Ludwig XIV.",
        material: "Mögliche Elemente sind Bundesflagge, Bundesadler, Bundestag, Bürgerinnen und Bürger, Arbeitsplatz oder Verfassung. Die Regierungsgewalt beruht auf demokratischer Wahl und ist rechtlich sowie zeitlich begrenzt; das höchste Staatsamt hat der Bundespräsident oder die Bundespräsidentin.",
        hint: "Übernimm nicht einfach Ludwigs Machtsymbole. Transformiere die Bildsprache so, dass demokratische Legitimation und begrenzte Amtsmacht sichtbar werden.",
        success: "Das Briefing wird nicht automatisch inhaltlich benotet. Nutze das Kriterienraster für Selbst- und Partnerfeedback.",
        minChars: 420,
        starter: "Gesamtaussage des Porträts: …\n1. Element: … | demokratische Aussage: … | Kontrast zu Ludwig XIV.: …",
        planning: [
          "Zielaussage des modernen Porträts",
          "vier begründete Bildelemente",
          "demokratische Legitimation",
          "Begrenzung und Kontrolle von Macht",
          "Gesamtkontrast zum absolutistischen Porträt"
        ],
        criteria: [
          "mindestens vier eigenständig begründete Entscheidungen",
          "jedes Element mit demokratischer Aussage verknüpft",
          "mindestens drei klare Kontraste zu Ludwig XIV.",
          "fachlich korrekte Unterscheidung von Regierungs- und Staatsamt",
          "schlüssige Gesamtaussage"
        ]
      }
    ]
  },
  {
    id: "paket-02",
    number: 2,
    slug: "aufklaerung",
    title: "Die Ideen der Aufklärung",
    subtitle: "Freiheit, gleiche Rechte, Gewaltenteilung und Volkssouveränität",
    focus: "Kritik am Absolutismus, Rousseau, Gewaltenteilung, Grundgesetz und Widerstandsrecht",
    inputPlan: [
      {
        minutes: 15,
        phase: "Salon-Impuls: Freiheit oder Ketten?",
        teacherInput: "Zeigt das Salonbild und die Porträts von Kant, Rousseau und Voltaire. Stellt zwei kurze, gegensätzliche Aussagen zur gottgegebenen Ordnung und zur Freiheit gegenüber.",
        learnerActivity: "Positioniert sich begründet, sammelt Fragen an die alte Ordnung und ordnet erste Begriffe den Philosophen zu.",
        materials: "Inputfolie zum Zeitalter der Aufklärung; Salonbild; Philosophenporträts; digitales Stimmungsbarometer",
        differentiation: "M: Satzstarter für die Position; R: Ursache der Kritik erklären; E: Spannung zwischen universalem Anspruch und historischer Wirklichkeit formulieren."
      },
      {
        minutes: 20,
        phase: "Kompaktinput: Ideen verändern Herrschaft",
        teacherInput: "Erläutert Menschenrechte, Religionsfreiheit, Gewaltenteilung, Volkssouveränität und Widerstandsrecht als Reaktionen auf absolutistische Willkür.",
        learnerActivity: "Erstellt eine Problem-Idee-Wirkung-Tabelle und ergänzt je Idee ein Beispiel.",
        materials: "Sachtexte des Lernpakets; Begriffs- und Institutionskarten",
        differentiation: "M: vorgegebene Problemkarten; R: Zusammenhänge selbst verbinden; E: mögliche Zielkonflikte oder Grenzen notieren."
      },
      {
        minutes: 30,
        phase: "Grundlagenstationen",
        teacherInput: "Modelliert die Zuordnung von Legislative, Exekutive und Judikative an einem neutralen Beispiel.",
        learnerActivity: "Sortiert Kritik und Forderungen der Aufklärer und ordnet Staatsgewalten ihren Institutionen und Funktionen zu.",
        materials: "Aufgaben 1 und 2; Material zu Menschenrechten, Religionsfreiheit und Gewaltenteilung",
        differentiation: "M: geschlossene Sortierung mit Rückmeldung; R: Definitionssätze aus den Zuordnungen bilden; E: prüfen, wie gegenseitige Kontrolle Willkür begrenzt."
      },
      {
        minutes: 35,
        phase: "Bedrohung und historische Perspektive",
        teacherInput: "Zeigt, wie aus einer Forderung eine Bedrohung für den absolutistischen Machtanspruch werden konnte, ohne Rousseaus Aussagen pauschal mit Gewalt gleichzusetzen.",
        learnerActivity: "Baut eine Forderung-Bedrohung-Reaktion-Kette und verfasst anschließend einen historisch plausiblen Philosophenbrief.",
        materials: "Rousseau-Auszug und Kurzinfo; Aufgaben 3 und 4; Briefgerüst",
        differentiation: "M: Belege und Wirkungen zuordnen; R: Kausalerklärung und Brief mit drei Ideen; E: Ambivalenz von Verfolgung und öffentlicher Debatte reflektieren."
      },
      {
        minutes: 30,
        phase: "Grundgesetz-Labor I: Rechte vergleichen",
        teacherInput: "Führt kurz in den Unterschied zwischen historischem Anspruch, damaliger Umsetzung und heutiger Rechtsnorm ein.",
        learnerActivity: "Verbindet Aufklärungsideen mit Art. 1 bis 4 GG und schreibt drei Vergleichssätze mit konkreten Artikelbelegen.",
        materials: "GG-Auszüge auf Druckseite 4; Aufgabe 5; Belegkarten",
        differentiation: "M: passende Artikel markieren; R: Kontinuität in eigenen Sätzen erklären; E: universalen Anspruch und eingeschränkte historische Verwirklichung unterscheiden."
      },
      {
        minutes: 35,
        phase: "Grundgesetz-Labor II: Artikel 20",
        teacherInput: "Klärt die Struktur von Art. 20 Abs. 1 bis 4 und betont: Absatz 4 formuliert ein bedingtes Recht, keine Pflicht.",
        learnerActivity: "Ordnet Absätze den Ideen Volkssouveränität, Gewaltenteilung, Rechtsbindung und Widerstandsrecht zu und schreibt eine eigenständige Synthese.",
        materials: "Art. 20 auf Druckseite 5; Aufgabe 6; Mapping-Vorlage",
        differentiation: "M: Absatz-Idee-Zuordnung; R: pro Bezug ein Beleg-Erklärsatz; E: Gemeinsamkeiten und Veränderungen in einer Gesamtsynthese beurteilen."
      },
      {
        minutes: 15,
        phase: "Begriffsnetz und Exit-Urteil",
        teacherInput: "Bündelt die Leitfrage: Wie begrenzen aufklärerische Ideen politische Macht?",
        learnerActivity: "Überarbeitet das Begriffsnetz, gibt Partnerfeedback und beantwortet die Leitfrage mit zwei Begriffen und einem Beleg.",
        materials: "Digitale Arbeitsergebnisse; Kriterienkarten; Exit-Ticket",
        differentiation: "M: Satzrahmen; R: Ursache-Wirkungs-Erklärung; E: Bedeutung und Grenze einer Idee abwägen."
      }
    ],
    tasks: [
      {
        id: "p2-a1",
        number: 1,
        tag: "M8",
        levels: ["M"],
        kind: "match",
        title: "Kritik und Forderungen der Aufklärer",
        prompt: "Ordne jede Aussage der passenden Kategorie zu.",
        material: "Die Aufklärer kritisierten die absolutistische und durch Geburt festgelegte Ordnung. Sie gingen davon aus, dass Menschen frei geboren sind, gleiche Rechte besitzen und gesellschaftliche Regeln verändern können.",
        hint: "Unterscheide zwischen einem Problem der alten Ordnung, einer Forderung und einer Aussage, die der Aufklärung widerspricht.",
        success: "Richtig zugeordnet. Die Kritik an Geburt und Gottesgnadentum führte zu Forderungen nach Freiheit, Gleichheit und veränderbarer Ordnung.",
        items: [
          { prompt: "Der gesellschaftliche Stand wird durch Geburt festgelegt.", answer: "Kritik an der alten Ordnung" },
          { prompt: "König und Adel begründen ihre Vorrechte als gottgegeben.", answer: "Kritik an der alten Ordnung" },
          { prompt: "Alle Menschen sollen frei sein und gleiche Rechte besitzen.", answer: "Forderung der Aufklärung" },
          { prompt: "Von Menschen geschaffene Regeln können von Menschen verändert werden.", answer: "Forderung der Aufklärung" },
          { prompt: "Nur der König darf bestimmen, welche Rechte gelten.", answer: "Widerspricht der Aufklärung" }
        ],
        choices: ["Kritik an der alten Ordnung", "Forderung der Aufklärung", "Widerspricht der Aufklärung"]
      },
      {
        id: "p2-a2",
        number: 2,
        tag: "M8",
        levels: ["M"],
        kind: "match",
        title: "Gewaltenteilung und Widerstandsrecht",
        prompt: "Ordne jedem Begriff die fachlich passende Institution und Funktion zu.",
        material: "Nach Montesquieu soll staatliche Macht auf verschiedene Bereiche verteilt sein. Ein historisch verstandenes Widerstandsrecht richtet sich gegen Herrschaft, die die geteilte Ordnung oder Rechte des Volkes verletzt; es ist keine pauschale Erlaubnis zu Gewalt.",
        hint: "Frage jeweils: Wer beschließt, wer führt aus, wer prüft - und wogegen richtet sich Widerstand?",
        success: "Richtig. Geteilte Gewalten begrenzen Macht; Widerstand ist an die Verletzung der Ordnung und von Rechten gebunden.",
        items: [
          { prompt: "Legislative", answer: "Parlament beschließt Gesetze" },
          { prompt: "Exekutive", answer: "Regierung setzt Gesetze um" },
          { prompt: "Judikative", answer: "Unabhängige Gerichte prüfen die Einhaltung der Gesetze" },
          { prompt: "Widerstandsrecht", answer: "Widerstand gegen einen Herrscher, der Rechte oder die geteilte Ordnung verletzt" }
        ],
        choices: [
          "Parlament beschließt Gesetze",
          "Regierung setzt Gesetze um",
          "Unabhängige Gerichte prüfen die Einhaltung der Gesetze",
          "Widerstand gegen einen Herrscher, der Rechte oder die geteilte Ordnung verletzt"
        ]
      },
      {
        id: "p2-a3",
        number: 3,
        tag: "R8",
        levels: ["R"],
        kind: "text",
        title: "Warum Könige Aufklärer verhaften ließen",
        prompt: "Erkläre mithilfe von Rousseaus Aussagen, weshalb absolutistische Könige Aufklärer als politische Bedrohung wahrnehmen und verfolgen konnten.",
        material: "Jean-Jacques Rousseau beschreibt Menschen als frei geboren, kritisiert ihre „Ketten“ und denkt legitime Macht vom Volk her. Absolutistische Könige beanspruchten dagegen ungeteilte und göttlich begründete Herrschaft.",
        hint: "Baue eine Kette: Forderung der Aufklärung - bedrohter königlicher Anspruch - mögliche Reaktion des Herrschers.",
        success: "Prüfe, ob dein Text Rousseaus Idee, den absolutistischen Machtanspruch und die Verfolgung kausal miteinander verbindet.",
        minChars: 220,
        starter: "Rousseau fordert … Damit widerspricht er dem königlichen Anspruch … Ein absolutistischer König konnte deshalb fürchten, dass … und reagierte möglicherweise mit …",
        planning: [
          "Aussage zu Freiheit oder Volk",
          "absolutistischer Gegenanspruch",
          "befürchteter Machtverlust",
          "Verhaftung als rekonstruierte Reaktion"
        ],
        criteria: [
          "mindestens ein genauer Materialbeleg",
          "Gegensatz zwischen Aufklärung und Absolutismus erklärt",
          "vollständige Kausalkette",
          "Verfolgung als Herrscherreaktion, nicht als Rousseau-Zitat dargestellt"
        ]
      },
      {
        id: "p2-a4",
        number: 4,
        tag: "R8",
        levels: ["R"],
        kind: "text",
        title: "Brief eines Philosophen",
        prompt: "Schreibe aus der Perspektive eines Philosophen des 18. Jahrhunderts an einen befreundeten Philosophen. Erkläre begründet, weshalb du die Ideen der Aufklärung unterstützt.",
        material: "Zur Auswahl stehen eigener Verstand, Freiheit und gleiche Rechte, Menschenrechte, Religionsfreiheit, Gewaltenteilung und das Volk als Quelle legitimer Macht. Der Brief entsteht unter einer absolutistischen Herrschaft.",
        hint: "Verknüpfe jede ausgewählte Idee mit einem Problem der alten Ordnung. Bleibe in einer historischen Rollenperspektive.",
        success: "Der Brief ist bereit für Kriterien- und Partnerfeedback; seine historische Plausibilität wird nicht durch eine automatische Musterlösung ersetzt.",
        minChars: 380,
        starter: "Paris, im Jahr …\nMein lieber Freund,\nseit unseren letzten Gesprächen beschäftigt mich … Ich befürworte …, weil …",
        planning: [
          "Ort, Zeit und Rollenprofil",
          "drei Ideen der Aufklärung",
          "zu jeder Idee ein Problem der alten Ordnung",
          "mögliche Hoffnung oder Sorge",
          "Anrede und Briefschluss"
        ],
        criteria: [
          "erkennbare historische Rollenperspektive",
          "mindestens drei sachlich richtige Aufklärungsideen",
          "jede Idee nachvollziehbar begründet",
          "Zusammenhang mit absolutistischer Ordnung",
          "vollständige Briefform"
        ]
      },
      {
        id: "p2-a5",
        number: 5,
        tag: "R8",
        levels: ["R"],
        kind: "text",
        title: "Aufklärung und Grundgesetz vergleichen",
        prompt: "Vergleiche die Ideen der Aufklärung mit den Grundgesetz-Auszügen auf Druckseite 4. Erkläre mindestens drei Belegpaare in eigenen Vergleichssätzen.",
        material: "Art. 1: Menschenwürde und Bindung staatlicher Gewalt. Art. 2: freie Entfaltung, Leben und körperliche Unversehrtheit. Art. 3: Gleichheit vor dem Gesetz und Gleichberechtigung. Art. 4: Glaubens- und Religionsfreiheit. Die universalen Ideen wurden im 18. Jahrhundert politisch und rechtlich nicht für alle Menschen gleich verwirklicht.",
        hint: "Nenne Artikel, gemeinsames Recht und heutige Ausgestaltung. Unterscheide zwischen universalem Anspruch und damaliger Praxis.",
        success: "Prüfe deine drei Vergleichssätze: Jeder braucht eine Aufklärungsidee, einen Artikelbeleg und eine erklärte Verbindung.",
        minChars: 300,
        starter: "Die Aufklärer forderten … Art. … GG schützt diese Idee heute, indem …\nEin weiterer Zusammenhang besteht zwischen …",
        planning: [
          "Menschenwürde oder Menschenrechte - Art. 1",
          "Freiheit und Unversehrtheit - Art. 2",
          "Gleichheit - Art. 3",
          "Religionsfreiheit - Art. 4",
          "Anspruch und historische Umsetzung unterscheiden"
        ],
        criteria: [
          "mindestens drei korrekte Belegpaare",
          "Artikelnummern genannt",
          "Gemeinsamkeit jeweils erklärt",
          "universalen Anspruch nicht mit damaliger Verwirklichung gleichgesetzt"
        ]
      },
      {
        id: "p2-a6",
        number: 6,
        tag: "E8",
        levels: ["E"],
        kind: "text",
        title: "Artikel 20 und das Erbe der Aufklärung",
        prompt: "Setze Art. 20 Abs. 1 bis 4 auf Druckseite 5 in Beziehung zu Aufklärungsideen. Formuliere für mindestens drei Bezüge jeweils Idee - Artikelbeleg - heutige Ausgestaltung und schließe mit einer Gesamtsynthese.",
        material: "Abs. 1 bestimmt die demokratische und soziale Staatsordnung. Abs. 2 leitet Staatsgewalt vom Volk ab und nennt Wahlen, Abstimmungen sowie besondere Organe. Abs. 3 bindet Gesetzgebung, Regierung und Gerichte an Verfassung und Recht. Abs. 4 gewährt unter engen Bedingungen ein Widerstandsrecht, wenn jemand die Ordnung beseitigen will und andere Abhilfe nicht möglich ist.",
        hint: "Das Widerstandsrecht ist ein bedingtes Recht, keine Pflicht. Zeige neben Gemeinsamkeiten auch, wie die Ideen heute rechtlich ausgestaltet und begrenzt sind.",
        success: "Die Synthese ist ein Expertenprodukt. Nutze das Raster für Selbst- und Partnerprüfung; eine automatische Bewertung würde die Qualität der Begründung nicht erfassen.",
        minChars: 430,
        starter: "Die Aufklärungsidee … findet sich in Art. 20 Abs. … wieder: … Heute wird sie dadurch ausgestaltet, dass …\nInsgesamt …",
        planning: [
          "Volkssouveränität - Abs. 2",
          "Gewaltenteilung und besondere Organe - Abs. 2",
          "Rechtsbindung - Abs. 3",
          "bedingtes Widerstandsrecht - Abs. 4",
          "Gemeinsamkeit und Veränderung zusammenführen"
        ],
        criteria: [
          "mindestens drei präzise Idee-Beleg-Bezüge",
          "Absätze korrekt angegeben",
          "heutige rechtliche Ausgestaltung erklärt",
          "Widerstandsrecht als bedingtes Recht dargestellt",
          "eigenständige Gesamtsynthese mit Gemeinsamkeit und Veränderung"
        ]
      }
    ]
  },
  {
    id: "paket-03",
    number: 3,
    slug: "staendeordnung",
    title: "Die Ständeordnung",
    subtitle: "Privilegien, Steuerlast und politische Unterrepräsentation vor 1789",
    focus: "Gottesgnadentum, drei Stände, Finanzkrise, Generalstände und Karikaturanalyse",
    inputPlan: [
      {
        minutes: 15,
        phase: "Karikatur als Standbild",
        teacherInput: "Zeigt die Karikatur von 1789 ohne Erklärung und fragt: Wer trägt wen - wörtlich und übertragen?",
        learnerActivity: "Stellt die Figurenanordnung als Standbild nach, notiert sichtbare Details und formuliert eine erste Deutungshypothese.",
        materials: "Karikatur „Hoffen wir, dass dieses Spiel bald ein Ende nimmt“; digitales Beobachtungsfeld",
        differentiation: "M: Figuren- und Gegenstandskarten; R: Bilddetail und soziale Aussage verbinden; E: Titel und Entstehungsjahr in eine Hypothese einbeziehen."
      },
      {
        minutes: 20,
        phase: "Kompaktinput: Gottesgnade und drei Stände",
        teacherInput: "Klärt Ludwigs XVI. Gottesgnadentum, die Zusammensetzung der drei Stände, Privilegien und Steuerpflicht.",
        learnerActivity: "Baut eine Ständepyramide und markiert Bevölkerung, Privilegien, Lasten und politische Stimme.",
        materials: "Sachtext Druckseite 1; Stände- und Merkmalskarten",
        differentiation: "M: beschriftete Pyramidenfelder; R: Privileg-Folge-Pfeile; E: Widerspruch zwischen Bevölkerungsanteil und Macht als These."
      },
      {
        minutes: 30,
        phase: "Zuordnen und Benachteiligung belegen",
        teacherInput: "Modelliert, wie aus einer Zahl und einer Abstimmungsregel eine Begründung entsteht.",
        learnerActivity: "Bearbeitet die Aufgaben zu Machtgrundlage, Bevölkerungsgruppen und Benachteiligung und formuliert einen Belegsatz.",
        materials: "Aufgaben 1 bis 3; Sachtexte Druckseiten 1 und 2",
        differentiation: "M: geschlossene Zuordnung; R: zwei Belege zu einer Erklärung verknüpfen; E: Steuer-, Rechts- und Machtaspekte gewichten."
      },
      {
        minutes: 30,
        phase: "Staatsfinanzen und Generalstände",
        teacherInput: "Legt die Kette Ausgaben - Schulden/Zinsen - Missernten - sinkende Einnahmen und den Anlass der Einberufung offen.",
        learnerActivity: "Sortiert Ursachen der Zahlungsunfähigkeit, ordnet die Steuerlast zu und rekonstruiert Funktion und Abstimmung der Generalstände.",
        materials: "Aufgaben 4 und 5; Ursache-Wirkungs-Karten; drei Standesstimmen",
        differentiation: "M: Karten mit Oberbegriffen; R: vollständige Kausalkette und Funktionssatz; E: strukturelles Problem der Steuerordnung beurteilen."
      },
      {
        minutes: 30,
        phase: "Abstimmungssimulation und zwei Kreisdiagramme",
        teacherInput: "Erklärt transparent die Modellannahme: 98 Prozent dritter Stand; die übrigen zwei Prozent werden für das Diagramm vereinfacht aufgeteilt.",
        learnerActivity: "Simuliert Abstimmungen nach Ständen und nach Köpfen, plant beide Kreisdiagramme und erklärt die Unterrepräsentation.",
        materials: "Aufgabe 6; Stimmkarten; Diagrammvorlage; Prozentdaten",
        differentiation: "M: Diagrammsegmente vorgegeben; R: Diskrepanz in zwei Sätzen erklären; E: Folgen einer Abstimmung nach Köpfen oder Bevölkerungsanteil prüfen."
      },
      {
        minutes: 40,
        phase: "Karikaturwerkstatt: Beschreiben - Untersuchen - Deuten",
        teacherInput: "Erinnert an die Bildanalysemethode und verlangt für jede Deutung einen Bildbeleg; bietet keine fertige Gesamtdeutung an.",
        learnerActivity: "Setzt Hotspots, analysiert Figuren, Lastzettel, Körperhaltung, Übertreibung und Bildtitel und verfasst eine belegte Gesamtthese.",
        materials: "Karikatur mit Zoom; Sachtext zu 98 Prozent, Steuerlast und Abstimmung; Aufgabe 7",
        differentiation: "M: Satzstarter und Symbolkarten; R: Behauptung-Beleg-Wirkung zu drei Details; E: eigenständige vollständige Analyse mit Intention und historischem Veränderungshorizont."
      },
      {
        minutes: 15,
        phase: "Generalstände-Urteil und Sicherung",
        teacherInput: "Moderiert die Schlussfrage: War die Ordnung 1789 nur ungerecht oder auch politisch instabil?",
        learnerActivity: "Formuliert ein Urteil aus der Perspektive eines Standes, gibt Gegenfeedback und ergänzt ein Exit-Ticket mit Zahl, Regel und Folge.",
        materials: "Rollenkarte je Stand; digitale Produkte; Exit-Ticket",
        differentiation: "M: Urteilssatz mit Auswahlbelegen; R: Zahl-Regel-Folge erklären; E: Perspektivurteil und eigenes Sachurteil unterscheiden."
      }
    ],
    tasks: [
      {
        id: "p3-a1",
        number: 1,
        tag: "M8",
        levels: ["M"],
        kind: "choice",
        title: "Worauf beruht die Macht des Königs?",
        prompt: "Welche Aussage gibt die Begründung Ludwigs XVI. im Sachtext richtig wieder?",
        material: "Ludwig XVI. verstand sich als Herrscher „von Gottes Gnaden“. Er beanspruchte, Kraft und Recht zum Regieren von Gott erhalten zu haben.",
        hint: "Gesucht ist die vom König behauptete Quelle seiner Macht, nicht eine heutige Bewertung.",
        success: "Richtig. Der König leitete seinen Herrschaftsanspruch aus Gottes Gnade ab und stellte seinen Willen damit als göttlich legitimiert dar.",
        multiple: false,
        options: [
          { text: "Er beanspruchte, seine Macht von Gott erhalten zu haben; sein Wille sollte daher als göttlich legitimiert gelten.", correct: true },
          { text: "Er erhielt seine Macht durch eine Wahl aller drei Stände.", correct: false },
          { text: "Er durfte nur regieren, solange unabhängige Gerichte zustimmten.", correct: false }
        ]
      },
      {
        id: "p3-a2",
        number: 2,
        tag: "M8",
        levels: ["M"],
        kind: "match",
        title: "Bevölkerungsgruppen zuordnen",
        prompt: "Ordne jede Bevölkerungsgruppe dem richtigen Stand zu.",
        material: "Geistliche gehörten zum ersten, Adlige zum zweiten Stand. Alle übrigen Gruppen, darunter Kaufleute, Handwerker und Bauern, bildeten den dritten Stand.",
        hint: "Der erste Stand umfasst die Geistlichkeit; der zweite den Adel.",
        success: "Richtig. Priester gehören zum ersten, Adlige zum zweiten und Kaufleute, Handwerker sowie Bauern zum dritten Stand.",
        items: [
          { prompt: "Priester", answer: "1. Stand: Geistlichkeit" },
          { prompt: "Adel", answer: "2. Stand: Adel" },
          { prompt: "Kaufmann", answer: "3. Stand" },
          { prompt: "Handwerker", answer: "3. Stand" },
          { prompt: "Bauer", answer: "3. Stand" }
        ],
        choices: ["1. Stand: Geistlichkeit", "2. Stand: Adel", "3. Stand"]
      },
      {
        id: "p3-a3",
        number: 3,
        tag: "M8",
        levels: ["M"],
        kind: "choice",
        title: "Der besonders benachteiligte Stand",
        prompt: "Markiere den benachteiligten Stand und alle Belege, die diese Begründung tragen.",
        material: "Der dritte Stand umfasste etwa 98 Prozent der Bevölkerung, trug die Steuer- und Abgabenlast und konnte bei der Abstimmung nach Ständen von Geistlichkeit und Adel mit 2:1 überstimmt werden.",
        hint: "Du brauchst die richtige Gruppe und mehrere Gründe.",
        success: "Richtig. Bevölkerungsmehrheit, Lasten und geringe politische Durchsetzungsmacht benachteiligten den dritten Stand.",
        multiple: true,
        options: [
          { text: "der dritte Stand", correct: true },
          { text: "etwa 98 Prozent der Bevölkerung", correct: true },
          { text: "trug die Steuer- und Abgabenlast", correct: true },
          { text: "konnte durch ersten und zweiten Stand mit 2:1 überstimmt werden", correct: true },
          { text: "der erste Stand", correct: false },
          { text: "besaß allein zwei Stimmen in der Generalständeversammlung", correct: false }
        ]
      },
      {
        id: "p3-a4",
        number: 4,
        tag: "M8",
        levels: ["M"],
        kind: "choice",
        title: "Warum drohte 1788 die Zahlungsunfähigkeit?",
        prompt: "Welche Faktoren nennt das Material als Ursachen oder Verstärker der Finanzkrise - und wer musste vor allem für die Staatsausgaben aufkommen?",
        material: "Frankreich hatte hohe Ausgaben und Schulden. Missernten verschärften Hunger und Armut. Adel und Geistlichkeit waren von vielen Steuern befreit; die Hauptlast lag beim dritten Stand.",
        hint: "Markiere Ausgaben, Schuldenfolgen, Krisenfolgen und die ungleiche Lastenverteilung.",
        success: "Richtig. Militär, Hof, Schulden und Missernten belasteten den Staat; zugleich ruhte die Steuerlast vor allem auf dem dritten Stand.",
        multiple: true,
        options: [
          { text: "hohe Militärausgaben", correct: true },
          { text: "ein kostspieliger Hofstaat", correct: true },
          { text: "Schulden und hohe Zinszahlungen", correct: true },
          { text: "Missernten, Hunger und sinkende Einnahmen", correct: true },
          { text: "vor allem der dritte Stand musste Steuern und Abgaben tragen", correct: true },
          { text: "Adel und Geistlichkeit waren vollständig für alle Staatsausgaben zuständig", correct: false },
          { text: "Frankreich hatte 1788 überhaupt keine Schulden", correct: false }
        ]
      },
      {
        id: "p3-a5",
        number: 5,
        tag: "M8",
        levels: ["M"],
        kind: "order",
        title: "Funktion der Generalständeversammlung",
        prompt: "Bringe den Anlass, die Einberufung, die Aufgabe und die Abstimmungsregel in eine sinnvolle Reihenfolge.",
        material: "Wegen der Finanzkrise brauchte der König die Zustimmung zu neuen Steuern. Das Paket vereinfacht die Zahl der Vertreter. Historisch stellte der Dritte Stand 1789 ungefähr doppelt so viele Abgeordnete wie jeder privilegierte Stand; bei der Abstimmung nach Ständen verfügte trotzdem jeder Stand nur über eine gemeinsame Stimme.",
        hint: "Beginne mit dem Geldproblem des Königs und ende mit der Abstimmungsregel.",
        success: "Richtig geordnet. Die Generalstände sollten neue Steuern beraten und bewilligen; abgestimmt wurde mit je einer Stimme pro Stand.",
        items: [
          "Der König braucht wegen der Finanzkrise neue Einnahmen.",
          "Er beruft Vertreter aller drei Stände ein.",
          "Die Generalstände beraten und bewilligen neue Steuern.",
          "Bei der Abstimmung besitzt jeder Stand eine gemeinsame Stimme."
        ]
      },
      {
        id: "p3-a6",
        number: 6,
        tag: "R8",
        levels: ["R"],
        kind: "text",
        title: "Bevölkerung und politische Macht in Diagrammen",
        prompt: "Plane die Legenden für zwei Kreisdiagramme und erkläre die Diskrepanz zwischen Bevölkerungsanteil und Standesstimmen. Beantworte außerdem: Was würde sich bei einer Abstimmung nach Köpfen ändern?",
        material: "Bevölkerungsmodell: dritter Stand etwa 98 Prozent; die übrigen zwei Prozent werden für die vereinfachte Darstellung mit je einem Prozent auf ersten und zweiten Stand verteilt. Standesstimmen: jeder Stand ein Drittel; Geistlichkeit und Adel können gemeinsam mit 2:1 stimmen.",
        hint: "Kennzeichne die Aufteilung 1 Prozent + 1 Prozent als Modellannahme. Vergleiche 98 Prozent Bevölkerung nicht mit der Zahl der Abgeordneten, sondern mit den drei Standesstimmen.",
        success: "Prüfe Diagrammlegenden, Modellhinweis und Erklärung: Wird die politische Unterrepräsentation des dritten Standes deutlich?",
        minChars: 300,
        starter: "Diagramm A - Bevölkerung: …\nDiagramm B - Standesstimmen: …\nDie Diagramme zeigen eine Diskrepanz, weil … Bei einer Abstimmung nach Köpfen …",
        planning: [
          "Diagramm A: 1 Prozent, 1 Prozent, 98 Prozent",
          "Modellannahme für die restlichen zwei Prozent nennen",
          "Diagramm B: je ein Drittel pro Stand",
          "privilegierte 2:1-Mehrheit erklären",
          "Folge einer Abstimmung nach Köpfen"
        ],
        criteria: [
          "beide Diagrammlegenden vollständig und korrekt",
          "Vereinfachung 1 Prozent + 1 Prozent gekennzeichnet",
          "Unterrepräsentation in mindestens zwei Sätzen erklärt",
          "Standesstimmen und Abgeordnetenzahl nicht verwechselt",
          "Was-wäre-wenn-Frage nachvollziehbar beantwortet"
        ]
      },
      {
        id: "p3-a7",
        number: 7,
        tag: "E8",
        levels: ["E"],
        kind: "text",
        title: "Karikatur zur Ständeordnung analysieren",
        prompt: "Analysiere die Karikatur „Hoffen wir, dass dieses Spiel bald ein Ende nimmt“ von 1789 nach Beschreiben - Untersuchen - Deuten. Entwickle eine Gesamtthese und belege sie mit mindestens drei Bilddetails.",
        material: "Ein Geistlicher und ein Adliger lasten auf dem gebeugten Angehörigen des dritten Standes. Zettel nennen unter anderem Salz-, Tabak- und Topfsteuer sowie Dienste. Der dritte Stand umfasste etwa 98 Prozent, trug viele Lasten und war politisch unterrepräsentiert.",
        hint: "Deute das „Tragen“ wörtlich und übertragen. Beziehe Körperhaltung, Übertreibung, Lastzettel, Bildtitel und Entstehungsjahr ein.",
        success: "Die Karikaturanalyse ist ein offenes Expertenprodukt. Nutze die Kriterien statt einer vorgegebenen Musterdeutung und überarbeite sie nach Partnerfeedback.",
        minChars: 480,
        starter: "Beschreiben: Die Karikatur von 1789 zeigt …\nUntersuchen: Das Detail … steht für … und wirkt …\nDeuten: Die zentrale Aussage lautet …, weil …",
        planning: [
          "Quelle, Titel und Entstehungsjahr",
          "Figuren und Anordnung wertfrei beschreiben",
          "drei Stände zuordnen",
          "Lastzettel, Körperhaltung und Übertreibung untersuchen",
          "Bildtitel auf Veränderungsforderung beziehen",
          "Gesamtthese mit historischem Kontext"
        ],
        criteria: [
          "alle drei Analyseschritte erkennbar",
          "mindestens drei konkrete Bilddetails als Belege",
          "Steuer- und Dienstlast sachlich erklärt",
          "Übertreibung und Körperhaltung in ihrer Wirkung untersucht",
          "Titel und Jahr 1789 in die Deutung einbezogen",
          "eigenständige, schlüssige Gesamtthese"
        ]
      }
    ]
  }
];
