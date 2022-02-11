#!/usr/bin/env bash

set -euo pipefail

echo "building staging electron app..."
./scripts/update-package.js staging
electron-builder build --mac dmg --universal -p never
./scripts/update-package.js reset

echo "building production electron app..."
./scripts/update-package.js
electron-builder build --mac dmg --universal -p never
./scripts/update-package.js reset

echo "uploading release..."
./scripts/upload-release.sh
