#!/usr/bin/env bash

set -euo pipefail

export NODE_ENV=production
echo "starting frontend..."
nohup yarn next:start > frontend.log 2>&1 & echo $! > frontend.pid

sleep 1
echo "frontend should now be running in the background."
cat frontend.log
