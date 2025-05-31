#!/usr/bin/env bash

# File: frontend/scripts/print_ts.sh

# =============================================================== #
# =============================================================== #

set -eou pipefail

TS_DIR="/home/viihna/Projects/graphix/frontend/src/app"

if [ ! -d "$TS_DIR" ]; then
  echo "TS_DIR directory not found. Exiting..."
  exit 1
fi

find "$TS_DIR" -type f -name '*.ts' -exec cat {} +
