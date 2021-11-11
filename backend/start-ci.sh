#!/usr/bin/env bash

set -euo pipefail

echo "starting backend..."
nohup yarn ts-node --transpile-only ./src/index.ts > backend.log 2>&1 & echo $! > backend.pid

sleep 1
echo "backend should now be running in the background."
cat backend.log
