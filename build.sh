#!/bin/sh
# Baut die Seite neu: src/ → index.html (wird von GitHub Pages ausgeliefert)
set -e
cd "$(dirname "$0")/src"
mkdir -p ics
python3 build_data.py
python3 assemble_plus.py
python3 assemble_gh.py
cp gh/index.html ../index.html
echo "index.html gebaut ($(wc -c < ../index.html) Bytes)"
