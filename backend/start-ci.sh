#!/usr/bin/env bash

set -euo pipefail

echo "building backend..."
yarn build

export APP=backend
echo "starting backend..."
nohup node -r ts-node/register/transpile-only dist/index.js > backend.log 2>&1 & echo $! > backend.pid

sleep 1
echo "backend should now be running in the background."
cat backend.log
