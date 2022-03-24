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
../scripts/send-slack-message.sh ":white_check_mark: Acapela app with version <https://github.com/weareacapela/releases/releases/tag/${RELEASE_VERSION}|*${RELEASE_VERSION}*> was successfully released" "$stage" "product"
