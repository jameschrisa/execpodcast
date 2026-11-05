#!/usr/bin/env python3
"""Build the standalone HTML and PDF versions of the brand guide from brand/guide.html.

guide.html is an artifact fragment (no doctype or head). This wraps it as a full
document, adds print rules (every tab shown, one section per page, no copy
buttons), and prints the PDF with headless Chrome.

Usage: python3 brand/scripts/build-print.py
"""
import pathlib
import subprocess
import sys

BRAND = pathlib.Path(__file__).resolve().parent.parent
SRC = BRAND / "guide.html"
HTML_OUT = BRAND / "executive-upskill-brand-guide.html"
PDF_OUT = BRAND / "executive-upskill-brand-guide.pdf"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

PRINT_CSS = """<style>
@page { size: Letter; margin: 12mm 12mm 14mm; }
@media print {
  html, body { background: var(--paper, #f7f7f5) !important; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  nav, [data-copy], header button { display: none !important; }
  /* The full spec runs 20+ pages. Print points to brand/brand.json instead. */
  #json-view { display: none !important; }
  #panel-agents::after {
    content: "The full machine-readable spec is in brand/brand.json and in the HTML version of this guide.";
    display: block; margin-top: 12px; font-size: 12px;
  }
  [role="tabpanel"][hidden] { display: block !important; }
  [role="tabpanel"] { break-before: page; }
  [role="tabpanel"]:first-of-type { break-before: auto; }
  h2, h3 { break-after: avoid; }
  .sw, .chip, figure, svg, tr, li, pre { break-inside: avoid; }
  pre, code { white-space: pre-wrap; word-break: break-word; }
}
</style>"""


def wrap(fragment: str, theme_attr: str = "") -> str:
    title_end = fragment.index("</title>") + len("</title>")
    title = fragment[:title_end]
    rest = fragment[title_end:]
    # Split head material (meta + styles) from the body content.
    body_start = rest.index("<header")
    head_extra, body = rest[:body_start], rest[body_start:]
    head_extra = head_extra.replace(
        '<meta name="claude:viewport-fit-sides" content="cover">', ""
    )
    return (
        f'<!doctype html>\n<html lang="en"{theme_attr}>\n<head>\n'
        '<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        '<meta name="description" content="Executive Upskill brand guide: logo, '
        'color, type, icons, visual language, voice, assets and agent rules.">\n'
        f"{title}\n{head_extra}{PRINT_CSS}\n</head>\n<body>\n{body}\n</body>\n</html>\n"
    )


def main() -> int:
    fragment = SRC.read_text(encoding="utf-8")
    HTML_OUT.write_text(wrap(fragment), encoding="utf-8")

    # The PDF always prints the light theme, whatever the machine's setting.
    tmp = BRAND / ".print-light.html"
    tmp.write_text(wrap(fragment, ' data-theme="light"'), encoding="utf-8")
    try:
        subprocess.run(
            [
                CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                "--virtual-time-budget=15000", f"--print-to-pdf={PDF_OUT}",
                tmp.as_uri(),
            ],
            check=True, capture_output=True,
        )
    finally:
        tmp.unlink(missing_ok=True)
    print(f"wrote {HTML_OUT.relative_to(BRAND.parent)} and {PDF_OUT.relative_to(BRAND.parent)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
