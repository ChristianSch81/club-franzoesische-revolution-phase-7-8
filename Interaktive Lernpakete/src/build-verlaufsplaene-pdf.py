#!/usr/bin/env python3
"""Build and verify the separate PDF with all alternative input lesson plans.

The canonical plan data remains in the three ES modules next to this script.
This generator imports those modules with Node.js, creates a print-friendly
ReportLab PDF, renders it with Poppler, and performs structural/layout checks.
"""

from __future__ import annotations

import argparse
import html
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any, Iterable

from PIL import Image, ImageOps, ImageDraw
from pypdf import PdfReader
import pdfplumber
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether,
    LongTable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[2]
SRC_DIR = Path(__file__).resolve().parent
OUTPUT_PDF = ROOT / "output" / "pdf" / "Alternative Inputverlaufsplaene - Franzoesische Revolution.pdf"
TMP_DIR = ROOT / "tmp" / "pdfs"
RENDER_DIR = TMP_DIR / "verlaufsplaene"

COURSE_TITLE = "Geschichte Phase 7/8: Die Französische Revolution"
DOCUMENT_TITLE = "Alternative Inputverlaufspläne"
AUTHOR = "Christian Schwend"

PAGE_SIZE = landscape(A4)
PAGE_WIDTH, PAGE_HEIGHT = PAGE_SIZE

LIGHT_BROWN = colors.HexColor("#D8C3A5")
PALE_BROWN = colors.HexColor("#F2EBE2")
VERY_PALE_BROWN = colors.HexColor("#FAF7F2")
DARK_BROWN = colors.HexColor("#5F4638")
INK = colors.HexColor("#28231F")
MUTED = colors.HexColor("#6A625D")
GRID = colors.HexColor("#B9AA99")
WHITE = colors.white

FORBIDDEN_DASHES = {
    "\u2010": "-",
    "\u2011": "-",
    "\u2012": "-",
    "\u2013": "-",
    "\u2014": "-",
    "\u2015": "-",
    "\u2212": "-",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--no-render", action="store_true", help="Skip Poppler rendering and image checks.")
    return parser.parse_args()


def find_node() -> Path:
    candidates: list[Path] = []
    configured = os.environ.get("NODE_BINARY")
    if configured:
        candidates.append(Path(configured))
    from_path = shutil.which("node")
    if from_path:
        candidates.append(Path(from_path))
    for candidate in candidates:
        if candidate.is_file():
            return candidate
    raise RuntimeError("Node.js wurde nicht gefunden; die ES-Module können nicht gelesen werden.")


def find_pdftoppm() -> Path:
    candidates: list[Path] = []
    configured = os.environ.get("PDFTOPPM_BINARY")
    if configured:
        candidates.append(Path(configured))
    from_path = shutil.which("pdftoppm")
    if from_path:
        candidates.append(Path(from_path))
    for candidate in candidates:
        if candidate.is_file():
            return candidate
    raise RuntimeError("Poppler/pdftoppm wurde nicht gefunden.")


def load_packages() -> list[dict[str, Any]]:
    module_urls = [
        (SRC_DIR / "packages-1-3.mjs").resolve().as_uri(),
        (SRC_DIR / "packages-4-6.mjs").resolve().as_uri(),
        (SRC_DIR / "packages-7-10.mjs").resolve().as_uri(),
    ]
    script = (
        "const urls=" + json.dumps(module_urls, ensure_ascii=False) + ";"
        "const modules=await Promise.all(urls.map(url=>import(url)));"
        "const packages=modules.flatMap(module=>module.packages)"
        ".map(({number,title,focus,inputPlan})=>({number,title,focus,inputPlan}));"
        "process.stdout.write(JSON.stringify(packages));"
    )
    result = subprocess.run(
        [str(find_node()), "--input-type=module", "-e", script],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    packages = json.loads(result.stdout)
    validate_source_data(packages)
    return sorted(packages, key=lambda item: item["number"])


def validate_source_data(packages: list[dict[str, Any]]) -> None:
    if len(packages) != 10:
        raise ValueError(f"Erwartet: 10 Unterrichtseinheiten; gefunden: {len(packages)}")
    numbers = [package.get("number") for package in packages]
    if sorted(numbers) != list(range(1, 11)):
        raise ValueError(f"Paketnummern sind unvollständig oder doppelt: {numbers}")

    required = ("minutes", "phase", "teacherInput", "learnerActivity", "materials", "differentiation")
    for package in packages:
        plan = package.get("inputPlan")
        if not isinstance(plan, list) or not plan:
            raise ValueError(f"Unterrichtseinheit {package['number']} besitzt keinen Inputverlaufsplan.")
        total = sum(int(phase.get("minutes", 0)) for phase in plan)
        if total != 180:
            raise ValueError(f"Unterrichtseinheit {package['number']}: {total} statt 180 Minuten.")
        for index, phase in enumerate(plan, start=1):
            missing = [field for field in required if not phase.get(field)]
            if missing:
                raise ValueError(
                    f"Unterrichtseinheit {package['number']}, Phase {index}: fehlende Felder {missing}"
                )


def sanitize(value: Any) -> str:
    text = str(value).replace("\u00a0", " ")
    for source, target in FORBIDDEN_DASHES.items():
        text = text.replace(source, target)
    text = text.replace("\u2026", "...").replace("\u2022", "-")
    text = text.replace("\u2192", "->").replace("\u21d2", "=>")
    return " ".join(text.split())


def xml_text(value: Any) -> str:
    return html.escape(sanitize(value), quote=True)


def infer_social_form(phase: dict[str, Any]) -> str:
    combined = " ".join(
        str(phase.get(key, "")).lower()
        for key in ("phase", "teacherInput", "learnerActivity", "materials")
    )
    forms: list[str] = []
    if any(term in combined for term in ("galerie", "gallery")):
        forms.extend(["Galeriegang", "Partnerfeedback"])
    if any(term in combined for term in ("tandem", "partner", "zu zweit", "dialog", "rollenlesen")):
        forms.append("Partnerarbeit")
    if any(
        term in combined
        for term in ("gruppen", "arbeitsteilig", "rollenspiel", "simulation", "verhandlung", "rollenplakat")
    ):
        forms.append("Gruppenarbeit")
    if any(
        term in combined
        for term in ("leitfrage", "moderiert", "klärt", "zeigt", "bündelt", "tafel", "abstimmungslinie", "positionslinie")
    ):
        forms.append("Plenum")
    if any(
        term in combined
        for term in ("notiert", "verfasst", "bearbeitet", "analysiert", "exit-ticket", "formuliert")
    ):
        forms.append("Einzelarbeit")
    if not forms:
        forms = ["Plenum", "Einzelarbeit mit Austausch"]
    # Preserve order while removing duplicates.
    return "; ".join(dict.fromkeys(forms))


def register_fonts() -> tuple[str, str]:
    regular_candidates = [Path(r"C:\Windows\Fonts\arial.ttf")]
    bold_candidates = [Path(r"C:\Windows\Fonts\arialbd.ttf")]
    regular = next((path for path in regular_candidates if path.is_file()), None)
    bold = next((path for path in bold_candidates if path.is_file()), None)
    if regular and bold:
        pdfmetrics.registerFont(TTFont("PlanSans", str(regular)))
        pdfmetrics.registerFont(TTFont("PlanSans-Bold", str(bold)))
        return "PlanSans", "PlanSans-Bold"
    return "Helvetica", "Helvetica-Bold"


def make_styles(font: str, bold_font: str) -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "cover_kicker": ParagraphStyle(
            "CoverKicker",
            parent=base["Normal"],
            fontName=bold_font,
            fontSize=10,
            leading=13,
            textColor=DARK_BROWN,
            spaceAfter=8,
        ),
        "cover_title": ParagraphStyle(
            "CoverTitle",
            parent=base["Title"],
            fontName=bold_font,
            fontSize=25,
            leading=29,
            textColor=DARK_BROWN,
            alignment=TA_LEFT,
            spaceAfter=10,
        ),
        "cover_subtitle": ParagraphStyle(
            "CoverSubtitle",
            parent=base["Normal"],
            fontName=font,
            fontSize=12,
            leading=17,
            textColor=INK,
            spaceAfter=15,
        ),
        "author": ParagraphStyle(
            "Author",
            parent=base["Normal"],
            fontName=font,
            fontSize=10,
            leading=13,
            textColor=MUTED,
        ),
        "section_label": ParagraphStyle(
            "SectionLabel",
            parent=base["Normal"],
            fontName=bold_font,
            fontSize=8.5,
            leading=10,
            textColor=DARK_BROWN,
            spaceAfter=4,
        ),
        "unit_title": ParagraphStyle(
            "UnitTitle",
            parent=base["Heading1"],
            fontName=bold_font,
            fontSize=19,
            leading=22,
            textColor=DARK_BROWN,
            spaceAfter=7,
        ),
        "focus": ParagraphStyle(
            "Focus",
            parent=base["Normal"],
            fontName=font,
            fontSize=9.2,
            leading=12,
            textColor=INK,
            splitLongWords=True,
        ),
        "overview_number": ParagraphStyle(
            "OverviewNumber",
            parent=base["Normal"],
            fontName=bold_font,
            fontSize=9,
            leading=11,
            textColor=DARK_BROWN,
            alignment=TA_CENTER,
        ),
        "overview_title": ParagraphStyle(
            "OverviewTitle",
            parent=base["Normal"],
            fontName=bold_font,
            fontSize=9,
            leading=11,
            textColor=INK,
            splitLongWords=True,
        ),
        "overview_focus": ParagraphStyle(
            "OverviewFocus",
            parent=base["Normal"],
            fontName=font,
            fontSize=8.2,
            leading=10.2,
            textColor=INK,
            splitLongWords=True,
        ),
        "repeat_unit": ParagraphStyle(
            "RepeatUnit",
            parent=base["Normal"],
            fontName=bold_font,
            fontSize=8.2,
            leading=10,
            textColor=DARK_BROWN,
            splitLongWords=True,
        ),
        "table_head": ParagraphStyle(
            "TableHead",
            parent=base["Normal"],
            fontName=bold_font,
            fontSize=7.6,
            leading=9.1,
            textColor=DARK_BROWN,
            alignment=TA_LEFT,
            splitLongWords=True,
        ),
        "cell": ParagraphStyle(
            "Cell",
            parent=base["Normal"],
            fontName=font,
            fontSize=7.25,
            leading=9.15,
            textColor=INK,
            splitLongWords=True,
            allowWidows=0,
            allowOrphans=0,
        ),
        "cell_bold": ParagraphStyle(
            "CellBold",
            parent=base["Normal"],
            fontName=bold_font,
            fontSize=7.25,
            leading=9.15,
            textColor=INK,
            splitLongWords=True,
        ),
        "time": ParagraphStyle(
            "Time",
            parent=base["Normal"],
            fontName=bold_font,
            fontSize=8,
            leading=9.5,
            textColor=DARK_BROWN,
            alignment=TA_CENTER,
        ),
        "note": ParagraphStyle(
            "Note",
            parent=base["Normal"],
            fontName=font,
            fontSize=7.2,
            leading=9,
            textColor=MUTED,
        ),
    }


def draw_header_footer(canvas: Any, doc: SimpleDocTemplate, font: str, bold_font: str) -> None:
    canvas.saveState()
    canvas.setTitle(DOCUMENT_TITLE)
    canvas.setAuthor(AUTHOR)
    canvas.setSubject("Zehn alternative Inputverlaufspläne zur Französischen Revolution")

    header_height = 15 * mm
    canvas.setFillColor(LIGHT_BROWN)
    canvas.rect(0, PAGE_HEIGHT - header_height, PAGE_WIDTH, header_height, fill=1, stroke=0)
    canvas.setFillColor(DARK_BROWN)
    canvas.setFont(bold_font, 10.5)
    canvas.drawString(12 * mm, PAGE_HEIGHT - 9.7 * mm, COURSE_TITLE)

    canvas.setStrokeColor(GRID)
    canvas.setLineWidth(0.45)
    canvas.line(12 * mm, 11.2 * mm, PAGE_WIDTH - 12 * mm, 11.2 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont(font, 8)
    canvas.drawString(12 * mm, 7.1 * mm, f"Autor: {AUTHOR}")
    canvas.drawRightString(PAGE_WIDTH - 12 * mm, 7.1 * mm, f"Seite {doc.page}")
    canvas.restoreState()


def focus_box(package: dict[str, Any], styles: dict[str, ParagraphStyle]) -> Table:
    content = Paragraph(
        f"<b>Fokus:</b> {xml_text(package['focus'])}<br/>"
        f"<b>Gesamtdauer:</b> 180 Minuten &nbsp;&nbsp; <b>Phasen:</b> {len(package['inputPlan'])}",
        styles["focus"],
    )
    table = Table([[content]], colWidths=[273 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE_BROWN),
                ("BOX", (0, 0), (-1, -1), 0.7, LIGHT_BROWN),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def plan_table(package: dict[str, Any], styles: dict[str, ParagraphStyle]) -> LongTable:
    number = int(package["number"])
    title = sanitize(package["title"])
    data: list[list[Any]] = [
        [
            Paragraph(
                f"Unterrichtseinheit {number:02d}: {xml_text(title)}",
                styles["repeat_unit"],
            ),
            "",
            "",
            "",
            "",
            "",
        ],
        [
            Paragraph("Zeit", styles["table_head"]),
            Paragraph("Phase", styles["table_head"]),
            Paragraph("Lehrkraftimpuls", styles["table_head"]),
            Paragraph("Lernaktivität", styles["table_head"]),
            Paragraph("Material / Sozialform", styles["table_head"]),
            Paragraph("Differenzierung", styles["table_head"]),
        ],
    ]
    for phase in package["inputPlan"]:
        material_and_form = (
            f"{xml_text(phase['materials'])}<br/><br/>"
            f"<b>Sozialform:</b> {xml_text(infer_social_form(phase))}"
        )
        data.append(
            [
                Paragraph(f"{int(phase['minutes'])}<br/>Min.", styles["time"]),
                Paragraph(xml_text(phase["phase"]), styles["cell_bold"]),
                Paragraph(xml_text(phase["teacherInput"]), styles["cell"]),
                Paragraph(xml_text(phase["learnerActivity"]), styles["cell"]),
                Paragraph(material_and_form, styles["cell"]),
                Paragraph(xml_text(phase["differentiation"]), styles["cell"]),
            ]
        )

    table = LongTable(
        data,
        colWidths=[12 * mm, 32 * mm, 58 * mm, 58 * mm, 52 * mm, 61 * mm],
        repeatRows=2,
        splitByRow=1,
        hAlign="CENTER",
    )
    commands: list[tuple[Any, ...]] = [
        ("SPAN", (0, 0), (-1, 0)),
        ("BACKGROUND", (0, 0), (-1, 0), LIGHT_BROWN),
        ("BACKGROUND", (0, 1), (-1, 1), PALE_BROWN),
        ("GRID", (0, 1), (-1, -1), 0.45, GRID),
        ("BOX", (0, 0), (-1, -1), 0.75, GRID),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (0, 2), (0, -1), "CENTER"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, 0), 5),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 5),
        ("TOPPADDING", (0, 1), (-1, 1), 5),
        ("BOTTOMPADDING", (0, 1), (-1, 1), 5),
        ("TOPPADDING", (0, 2), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 2), (-1, -1), 5),
    ]
    for row in range(2, len(data)):
        if row % 2 == 0:
            commands.append(("BACKGROUND", (0, row), (-1, row), WHITE))
        else:
            commands.append(("BACKGROUND", (0, row), (-1, row), VERY_PALE_BROWN))
    table.setStyle(TableStyle(commands))
    return table


def overview_table(packages: list[dict[str, Any]], styles: dict[str, ParagraphStyle]) -> Table:
    halves = (packages[:5], packages[5:])
    data: list[list[Any]] = []
    for row_index in range(5):
        row: list[Any] = []
        for half in halves:
            package = half[row_index]
            row.append(
                Paragraph(
                    f"<b>{int(package['number']):02d} - {xml_text(package['title'])}</b><br/>"
                    f"{xml_text(package['focus'])}<br/>"
                    f"<font color='#6A625D'>180 Minuten | {len(package['inputPlan'])} Phasen</font>",
                    styles["overview_focus"],
                )
            )
        data.append(row)
    table = Table(data, colWidths=[136.5 * mm, 136.5 * mm])
    commands: list[tuple[Any, ...]] = [
        ("GRID", (0, 0), (-1, -1), 0.45, GRID),
        ("BOX", (0, 0), (-1, -1), 0.75, GRID),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    for row in range(len(data)):
        commands.append(("BACKGROUND", (0, row), (-1, row), VERY_PALE_BROWN if row % 2 else WHITE))
    table.setStyle(TableStyle(commands))
    return table


def build_pdf(packages: list[dict[str, Any]]) -> None:
    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    font, bold_font = register_fonts()
    styles = make_styles(font, bold_font)

    doc = SimpleDocTemplate(
        str(OUTPUT_PDF),
        pagesize=PAGE_SIZE,
        leftMargin=12 * mm,
        rightMargin=12 * mm,
        topMargin=21 * mm,
        bottomMargin=16 * mm,
        title=DOCUMENT_TITLE,
        author=AUTHOR,
        subject="Zehn alternative Inputverlaufspläne zur Französischen Revolution",
    )
    page_callback = lambda canvas, current_doc: draw_header_footer(canvas, current_doc, font, bold_font)

    story: list[Any] = []
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("UNTERRICHTSMATERIAL GESCHICHTE 7/8", styles["cover_kicker"]))
    story.append(Paragraph(DOCUMENT_TITLE, styles["cover_title"]))
    story.append(
        Paragraph(
            "Zehn separate Verlaufspläne für je 180 Minuten. "
            "Die Pläne ergänzen die interaktiven Lernpakete und führen alternative "
            "Lehrkraftimpulse, Lernaktivitäten sowie Differenzierungsoptionen aus. "
            "Die genannten Sozialformen sind anpassbare Vorschläge.",
            styles["cover_subtitle"],
        )
    )
    story.append(Paragraph(f"Autor: {AUTHOR}", styles["author"]))
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("Übersicht", styles["unit_title"]))
    story.append(overview_table(packages, styles))

    for package in packages:
        story.append(PageBreak())
        unit_heading = [
            Paragraph(f"UNTERRICHTSEINHEIT {int(package['number']):02d}", styles["section_label"]),
            Paragraph(xml_text(package["title"]), styles["unit_title"]),
            focus_box(package, styles),
            Spacer(1, 6 * mm),
        ]
        story.append(KeepTogether(unit_heading))
        story.append(plan_table(package, styles))

    doc.build(story, onFirstPage=page_callback, onLaterPages=page_callback)


def render_pdf() -> list[Path]:
    if RENDER_DIR.exists():
        for child in RENDER_DIR.iterdir():
            if child.is_file():
                child.unlink()
    else:
        RENDER_DIR.mkdir(parents=True, exist_ok=True)

    prefix = RENDER_DIR / "seite"
    subprocess.run(
        [str(find_pdftoppm()), "-png", "-r", "120", str(OUTPUT_PDF), str(prefix)],
        cwd=ROOT,
        check=True,
        capture_output=True,
    )
    pages = sorted(RENDER_DIR.glob("seite-*.png"))
    if not pages:
        raise RuntimeError("Poppler hat keine Seitenbilder erzeugt.")
    make_contact_sheets(pages)
    return pages


def make_contact_sheets(page_images: list[Path], per_sheet: int = 9) -> list[Path]:
    sheets: list[Path] = []
    thumb_width = 480
    columns = 3
    rows = 3
    pad = 18
    label_height = 30
    for batch_index in range(0, len(page_images), per_sheet):
        batch = page_images[batch_index : batch_index + per_sheet]
        with Image.open(batch[0]) as sample:
            ratio = sample.height / sample.width
        thumb_height = int(thumb_width * ratio)
        sheet = Image.new(
            "RGB",
            (
                columns * thumb_width + (columns + 1) * pad,
                rows * (thumb_height + label_height) + (rows + 1) * pad,
            ),
            "#ded8d0",
        )
        draw = ImageDraw.Draw(sheet)
        for offset, image_path in enumerate(batch):
            row, column = divmod(offset, columns)
            x = pad + column * (thumb_width + pad)
            y = pad + row * (thumb_height + label_height + pad)
            with Image.open(image_path) as page:
                thumbnail = ImageOps.contain(page.convert("RGB"), (thumb_width, thumb_height))
            sheet.paste(thumbnail, (x, y + label_height))
            draw.text((x, y + 5), f"Seite {batch_index + offset + 1}", fill="#3e342d")
        sheet_path = RENDER_DIR / f"kontakt-{batch_index // per_sheet + 1:02d}.png"
        sheet.save(sheet_path, quality=92)
        sheets.append(sheet_path)
    return sheets


def normalized_search_text(text: str) -> str:
    return " ".join((text or "").split())


def compact_search_text(text: str) -> str:
    """Ignore line wrapping, including ReportLab's split of long German words."""
    return "".join((text or "").split())


def verify_pdf(packages: list[dict[str, Any]], rendered_pages: Iterable[Path] | None = None) -> dict[str, Any]:
    reader = PdfReader(str(OUTPUT_PDF))
    if not reader.pages:
        raise AssertionError("Das PDF enthält keine Seiten.")
    page_texts = [page.extract_text() or "" for page in reader.pages]
    full_text = normalized_search_text("\n".join(page_texts))
    compact_full_text = compact_search_text("\n".join(page_texts))

    problems: list[str] = []
    for page_number, text in enumerate(page_texts, start=1):
        for required in (COURSE_TITLE, f"Autor: {AUTHOR}", f"Seite {page_number}"):
            if required not in text:
                problems.append(f"Seite {page_number}: Kopf-/Fußzeilentext fehlt: {required}")
        if any(marker in text for marker in ("\ufffd", "\u25a1", "\u25a0")):
            problems.append(f"Seite {page_number}: mögliches Ersatzzeichen/fehlende Glyphe.")
        if any(marker in text for marker in FORBIDDEN_DASHES):
            problems.append(f"Seite {page_number}: nicht erlaubter Unicode-Bindestrich gefunden.")

    if full_text.count("Gesamtdauer: 180 Minuten") != 10:
        problems.append("Die sichtbare 180-Minuten-Summe kommt nicht genau zehnmal vor.")

    for package in packages:
        if sanitize(package["title"]) not in full_text:
            problems.append(f"Titel von Unterrichtseinheit {package['number']} fehlt.")
        for phase in package["inputPlan"]:
            phase_name = sanitize(phase["phase"])
            if compact_search_text(phase_name) not in compact_full_text:
                problems.append(
                    f"Unterrichtseinheit {package['number']}: Phasenbezeichnung fehlt: {phase_name}"
                )

    with pdfplumber.open(str(OUTPUT_PDF)) as pdf:
        expected_width, expected_height = PAGE_SIZE
        for page_number, page in enumerate(pdf.pages, start=1):
            if abs(page.width - expected_width) > 1 or abs(page.height - expected_height) > 1:
                problems.append(f"Seite {page_number}: falsches Seitenformat.")
            for char in page.chars:
                if (
                    char["x0"] < -0.2
                    or char["x1"] > page.width + 0.2
                    or char["top"] < -0.2
                    or char["bottom"] > page.height + 0.2
                ):
                    problems.append(f"Seite {page_number}: Textobjekt liegt außerhalb der Seite.")
                    break

    rendered_pages = list(rendered_pages or [])
    for page_number, image_path in enumerate(rendered_pages, start=1):
        with Image.open(image_path) as page_image:
            rgb = page_image.convert("RGB")
            width, height = rgb.size
            border_boxes = [
                (0, 0, width, 2),
                (0, height - 2, width, height),
                (0, 0, 2, height),
                (width - 2, 0, width, height),
            ]
            for box in border_boxes:
                border = rgb.crop(box)
                pixels = (
                    border.get_flattened_data()
                    if hasattr(border, "get_flattened_data")
                    else border.getdata()
                )
                if any(max(pixel) < 85 for pixel in pixels):
                    problems.append(f"Seite {page_number}: dunkle Druckelemente berühren den Seitenrand.")
                    break

    if problems:
        raise AssertionError("\n".join(problems))

    return {
        "pdf": str(OUTPUT_PDF),
        "pages": len(reader.pages),
        "units": len(packages),
        "phases": sum(len(package["inputPlan"]) for package in packages),
        "minutes_per_unit": sorted(
            {sum(int(phase["minutes"]) for phase in package["inputPlan"]) for package in packages}
        ),
        "rendered_pages": len(rendered_pages),
        "contact_sheets": len(list(RENDER_DIR.glob("kontakt-*.png"))) if rendered_pages else 0,
        "forbidden_glyph_markers": 0,
        "unicode_dash_markers": 0,
        "out_of_bounds_text_objects": 0,
        "dark_edge_contacts": 0,
    }


def main() -> int:
    args = parse_args()
    packages = load_packages()
    build_pdf(packages)
    rendered = [] if args.no_render else render_pdf()
    report = verify_pdf(packages, rendered)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
