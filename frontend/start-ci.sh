#!/usr/bin/env bash

export NODE_ENV=production
echo "starting frontend..."
nohup yarn node ./next-server.js > frontend.log 2>&1 & echo $! > frontend.pid

echo "frontend should now be running in the background."
cat frontend.log
