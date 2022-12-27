#!/bin/bash
set -euo pipefail
DIST_BRANCH="${DIST_BRANCH:-build}"
CURRENT_REPO="${CURRENT_REPO:-./}"

git submodule add \
  -b "$DIST_BRANCH" \
  -- "$CURRENT_REPO" dist
