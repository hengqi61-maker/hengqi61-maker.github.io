#!/usr/bin/env python3
"""Generate the public personal statement PDF from the shared JSON content."""

from __future__ import annotations

import json
import os
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
CONTENT_PATH = ROOT / "content" / "personal_statement.json"
OUTPUT_PATH = ROOT / "public" / "Qi_Heng_Statement.pdf"
FONT_PATH = Path(os.environ.get("STATEMENT_FONT_PATH", "/Library/Fonts/Arial Unicode.ttf"))


def add_page_number(canvas, document) -> None:
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#7A8492"))
    canvas.drawCentredString(A4[0] / 2, 13 * mm, str(document.page))
    canvas.restoreState()


def main() -> None:
    content = json.loads(CONTENT_PATH.read_text(encoding="utf-8"))
    if not FONT_PATH.exists():
        raise SystemExit(f"Required font not found: {FONT_PATH}")
    pdfmetrics.registerFont(TTFont("StatementFont", str(FONT_PATH)))

    document = SimpleDocTemplate(
        str(OUTPUT_PATH),
        pagesize=A4,
        rightMargin=24 * mm,
        leftMargin=24 * mm,
        topMargin=24 * mm,
        bottomMargin=22 * mm,
        title=content["title"],
        author="Qi Heng",
        subject="Public personal statement",
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "StatementTitle",
        parent=styles["Title"],
        fontName="StatementFont",
        fontSize=22,
        leading=30,
        textColor=colors.HexColor("#101318"),
        alignment=TA_CENTER,
        spaceAfter=8 * mm,
    )
    metadata_style = ParagraphStyle(
        "StatementMetadata",
        parent=styles["Normal"],
        fontName="StatementFont",
        fontSize=9,
        leading=14,
        textColor=colors.HexColor("#687280"),
        alignment=TA_CENTER,
        spaceAfter=11 * mm,
    )
    body_style = ParagraphStyle(
        "StatementBody",
        parent=styles["BodyText"],
        fontName="StatementFont",
        fontSize=11.2,
        leading=20,
        textColor=colors.HexColor("#20262F"),
        firstLineIndent=22.4,
        spaceAfter=6 * mm,
        wordWrap="CJK",
    )

    story = [
        Spacer(1, 8 * mm),
        Paragraph(content["title"], title_style),
        Paragraph(f'{content["label"]} · 更新于 {content["updatedAt"]}', metadata_style),
    ]
    for paragraph in content["paragraphs"]:
        story.append(Paragraph(paragraph, body_style))

    document.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(OUTPUT_PATH)


if __name__ == "__main__":
    main()
