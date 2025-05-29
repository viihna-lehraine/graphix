#!/usr/bin/env bash

# File: frontend/scripts/print_scss.sh

# =============================================================== #
# =============================================================== #

set -eou pipefail

SCSS_DIR="/home/viihna/Projects/graphix/frontend/src/styles/scss"

if [ ! -d "$SCSS_DIR" ]; then
  echo "SCSS directory not found. Exiting..."
  exit 1
fi

find "$SCSS_DIR" -type f -name '*.scss' -exec cat {} +
