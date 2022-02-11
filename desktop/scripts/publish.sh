#!/usr/bin/env bash

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "stage not set"
  exit 1
fi
stage=$1

echo "building and publishing electron app for $stage..."
./scripts/update-package.js "$stage"
electron-builder build --mac default --universal -p always
./scripts/update-package.js reset
