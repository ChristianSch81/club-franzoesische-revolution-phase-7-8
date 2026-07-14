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

Die Datei [`Interaktive Lernpakete/index.html`](Interaktive%20Lernpakete/index.html) lokal in einem aktuellen Browser öffnen. Eine Internetverbindung ist für die Lernpakete nicht erforderlich.

Die HTML-Pakete verlinken auf die zugehörigen PDFs im Ordner `Pakete`.

## Lernpfad

Der Mindeststandard ist zunächst freigeschaltet. Der Regelstandard wird geöffnet, wenn alle Aufgaben des Mindeststandards mindestens einmal geprüft und mindestens 80 % erfolgreich abgeschlossen wurden. Entsprechend wird danach der Expertenstandard freigeschaltet. Gültige Fehlversuche können jederzeit verbessert werden.

Offene Arbeitsprodukte werden anhand von Planungshilfen, Satzstartern und Kriterien selbst geprüft. Eine inhaltliche Rückmeldung erfolgt über Material, Lösung oder Lehrkraftfeedback.

## Entwicklung und Prüfung

Voraussetzung: Node.js.

```powershell
node "Interaktive Lernpakete/src/build.mjs"
node "Interaktive Lernpakete/src/qa.mjs"
```

Der Generator erzeugt die Paketübersicht und alle zehn Paketdateien aus den gemeinsamen Quelldateien in `Interaktive Lernpakete/src`.

Die separate Verlaufsplan-PDF kann mit dem Python-Skript `Interaktive Lernpakete/src/build-verlaufsplaene-pdf.py` neu erzeugt werden. Dafür werden ReportLab, Pillow, pypdf, pdfplumber, Node.js und optional Poppler benötigt. Abweichende Programmpfade können über `NODE_BINARY` und `PDFTOPPM_BINARY` gesetzt werden.

## Autor

Christian Schwend

## Rechte und Quellen

Für dieses Repository ist derzeit keine pauschale Open-Source- oder Creative-Commons-Lizenz hinterlegt. Rechte an eingebundenen Quellen, Abbildungen und Materialien verbleiben bei den jeweils genannten Rechteinhabern. Vor einer Weiterverwendung oder Bearbeitung sind die Quellen- und Lizenzangaben in den Materialien zu beachten.
