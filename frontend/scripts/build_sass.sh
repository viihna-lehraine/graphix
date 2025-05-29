#!/usr/bin/env bash

# File: frontend/scripts/build_sass.sh

set -eou pipefail

SASS_LOAD_PATH=src/styles

sass --load-path="$SASS_LOAD_PATH" "$@"
