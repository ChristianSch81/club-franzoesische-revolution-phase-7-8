# Club Französische Revolution Phase 7/8

Offline nutzbare, differenzierte Lernpakete zur Französischen Revolution für den Geschichtsunterricht in Phase beziehungsweise Klasse 7/8.

## Inhalt

- zehn interaktive HTML-Lernpakete mit insgesamt 79 Aufgaben
- Mindest-, Regel- und Expertenstandard nach einem gestuften Lernpfad
- Freischaltung der nächsten Stufe nach vollständiger Erstbearbeitung und mindestens 80 % erfolgreichen Aufgaben
- Multiple Choice, Zuordnungen, Sortieraufgaben mit Touch-Bedienung sowie offene Arbeitsprodukte
- lokale Speicherung des Lernfortschritts ohne Anmeldung oder Datenübertragung
- zehn zugehörige analoge Lernpakete als PDF
- gemeinsames PDF mit alternativen Inputverlaufsplänen für zehn Unterrichtseinheiten zu jeweils 180 Minuten

## Verwendung

Die veröffentlichte Lernplattform ist über [GitHub Pages](https://christiansch81.github.io/club-franzoesische-revolution-phase-7-8/) erreichbar. Alternativ kann die Datei [`docs/index.html`](docs/index.html) lokal in einem aktuellen Browser geöffnet werden. Eine Internetverbindung ist für die Lernpakete selbst nicht erforderlich.

Die Übersichtsseite führt zu allen zehn Lernpaketen. Diese verlinken auf die zugehörigen PDFs im Ordner `docs/material`. Der Ordner `Interaktive Lernpakete` enthält die Arbeits- und Quelldateien.

## Lernpfad

Der Mindeststandard ist zunächst freigeschaltet. Der Regelstandard wird geöffnet, wenn alle Aufgaben des Mindeststandards mindestens einmal geprüft und mindestens 80 % erfolgreich abgeschlossen wurden. Entsprechend wird danach der Expertenstandard freigeschaltet. Gültige Fehlversuche können jederzeit verbessert werden.

Offene Arbeitsprodukte werden anhand von Planungshilfen, Satzstartern und Kriterien selbst geprüft. Eine inhaltliche Rückmeldung erfolgt über Material, Lösung oder Lehrkraftfeedback.

## Entwicklung und Prüfung

Voraussetzung: Node.js.

```powershell
node "Interaktive Lernpakete/src/build.mjs"
node "Interaktive Lernpakete/src/build-docs.mjs"
node "Interaktive Lernpakete/src/qa.mjs"
node "Interaktive Lernpakete/src/qa-docs.mjs"
```

Der erste Generator erzeugt die lokalen Arbeitsfassungen aus den gemeinsamen Quelldateien in `Interaktive Lernpakete/src`. `build-docs.mjs` erstellt daraus die vollständig portierbare GitHub-Pages-Ausgabe in `docs` einschließlich Übersichtsseite, Bilddateien, Lernpaketen und PDF-Materialien.

Die separate Verlaufsplan-PDF kann mit dem Python-Skript `Interaktive Lernpakete/src/build-verlaufsplaene-pdf.py` neu erzeugt werden. Dafür werden ReportLab, Pillow, pypdf, pdfplumber, Node.js und optional Poppler benötigt. Abweichende Programmpfade können über `NODE_BINARY` und `PDFTOPPM_BINARY` gesetzt werden.

## Autor

Christian Schwend

## Rechte und Quellen

Für dieses Repository ist derzeit keine pauschale Open-Source- oder Creative-Commons-Lizenz hinterlegt. Rechte an eingebundenen Quellen, Abbildungen und Materialien verbleiben bei den jeweils genannten Rechteinhabern. Vor einer Weiterverwendung oder Bearbeitung sind die Quellen- und Lizenzangaben in den Materialien zu beachten.
