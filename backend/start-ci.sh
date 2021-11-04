#!/usr/bin/env bash

echo "starting backend..."
nohup yarn ts-node --transpile-only ./src/index.ts > backend.log 2>&1 & echo $! > backend.pid

echo "backend should now be running in the background."
cat backend.log
