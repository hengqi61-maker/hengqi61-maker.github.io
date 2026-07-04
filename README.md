# Qi Heng Academic Portfolio

Personal academic website for GitHub Pages.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Public Assets

Regenerate the web-ready travel photos from the original photo directory:

```bash
python3 scripts/process_travel_photos.py /path/to/source-photos --output public/travel
```

Regenerate the public personal statement:

```bash
python3 -m pip install -r requirements-docs.txt
python3 scripts/generate_statement_pdf.py
```

The PDF script uses `/Library/Fonts/Arial Unicode.ttf` by default. Set
`STATEMENT_FONT_PATH` to another Unicode TrueType font when running elsewhere.

## Privacy

Only sanitized public materials should be committed. Do not add ID cards,
student certificates, transcripts, full application packets, or unpublished
PPT source files to this repository. Interview decks may be added only when
they are intentionally published.
