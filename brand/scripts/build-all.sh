#!/usr/bin/env bash
# Rebuild brand assets and icons. Run from the repo root.
# Needs: a Python venv with fonttools uharfbuzz brotli, and a folder $WORK with
#   npm i lucide-static@0.577.0 @resvg/resvg-js@2.6.2 geist@1.9.1
# Archivo variable font: Archivo[wdth,wght].ttf from github.com/google/fonts (ofl/archivo).
set -euo pipefail
: "${WORK:?set WORK to the folder with node_modules}"; : "${ARCHIVO:?set ARCHIVO to Archivo[wdth,wght].ttf}"
PY=${PY:-python3}
GEIST=$WORK/node_modules/geist/dist/fonts/geist-sans
$PY brand/scripts/build-icons.py "$WORK/node_modules/lucide-static" brand
RESVG_DIR=$WORK node brand/scripts/render-svg.mjs $(cat brand/icons/.png-src/jobs.txt) >/dev/null; rm -rf brand/icons/.png-src
$PY brand/scripts/gen-assets.py "$ARCHIVO" src/assets/Anton-Regular.ttf "$GEIST/Geist-Regular.ttf" "$GEIST/Geist-Bold.ttf" brand
RESVG_DIR=$WORK node brand/scripts/render-svg.mjs $(cat brand/assets/.jobs) >/dev/null; rm -f brand/assets/.jobs
