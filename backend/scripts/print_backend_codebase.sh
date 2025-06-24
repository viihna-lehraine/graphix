#!/usr/bin/env bash

set -eou pipefail

PROJECT_ROOT="/home/viihna/Projects/graphix"
KNEX_DIST_DIR="$PROJECT_ROOT/backend/knex-dist"
MIGRATIONS_DIR="$PROJECT_ROOT/backend/migrations"
TS_DIR="$PROJECT_ROOT/backend/src"
OUTPUT_FILE="$PROJECT_ROOT/dev/codebase_dump/backend.txt"

if [ ! -d "$TS_DIR" ]; then
  echo "TS_DIR directory not found. Exiting..."
  exit 1
elif [ ! -d "$KNEX_DIST_DIR" ]; then
  echo "KNEX_DIST_DIR directory not found. Exiting..."
  exit 1
elif [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "MIGRATIONS_DIR directory not found. Exiting..."
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
  echo "====== .ts and .d.ts files ======"
  find "$TS_DIR" -type f \( -name '*.ts' -o -name '*.d.ts' \) | sort | while read -r file; do
    echo "--- $file ---"
    cat "$file"
    echo
  done
  echo
  echo
} >>"$OUTPUT_FILE"

{
  echo "====== knex-dist files (knex-dist) ======"
  find "$KNEX_DIST_DIR" -type f -name '*.js' | sort | while read -r file; do
    echo "--- $file ---"
    cat "$file"
    echo
  done
  echo
} >>"$OUTPUT_FILE"

{
  echo "====== migration files ======"
  find "$MIGRATIONS_DIR" -type f \( -name '*.ts' -o -name '*.js' \) | sort | while read -r file; do
    echo "--- $file ---"
    cat "$file"
    echo
  done
  echo
} >>"$OUTPUT_FILE"

echo "Codebase has been written to $OUTPUT_FILE"
