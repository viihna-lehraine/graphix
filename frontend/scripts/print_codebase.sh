#!/usr/bin/env bash

# File: frontend/scripts/print_codebase.sh

set -eou pipefail

PROJECT_ROOT="/home/viihna/Projects/graphix"
CSS_DIR="$PROJECT_ROOT/frontend/src/styles"
HTML_FILE="$PROJECT_ROOT/frontend/src/index.html"
TS_DIR="$PROJECT_ROOT/frontend/src/app"
OUTPUT_FILE="$PROJECT_ROOT/dev/codebase.txt"

if [ ! -d "$TS_DIR" ]; then
  echo "TS_DIR directory not found. Exiting..."
  exit 1
elif [ ! -f "$HTML_FILE" ]; then
  echo "HTML file not found. Exiting..."
  exit 1
elif [ ! -d "$CSS_DIR" ]; then
  echo "CSS_DIR directory not found. Exiting..."
  exit 1
fi

# clear or create the output file
: >"$OUTPUT_FILE"

# shellcheck disable=SC2129
{
  echo "========= Codebase Overview ========="
  echo "Project Root: $PROJECT_ROOT"
  echo "Output File: $OUTPUT_FILE"
  echo
} >>"$OUTPUT_FILE"
{
  echo "========= index.html ========="
  cat "$HTML_FILE"
  echo
  echo
} >>"$OUTPUT_FILE"

{
  echo "====== .ts files ======"
  find "$TS_DIR" -type f -name '*.ts' | sort | while read -r file; do
    echo "--- $file ---"
    cat "$file"
    echo
  done
  echo
  echo
} >>"$OUTPUT_FILE"

{
  echo "====== .css files ======"
  find "$CSS_DIR" -type f -name '*.css' | sort | while read -r file; do
    echo "--- $file ---"
    cat "$file"
    echo
  done
} >>"$OUTPUT_FILE"

echo "Codebase has been written to $OUTPUT_FILE"
