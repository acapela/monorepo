#!/usr/bin/env bash

echo "starting frontend..."
nohup yarn node ./next-server.js > frontend.log 2>&1 & echo $! > frontend.pid

echo "frontend should now be running in the background."
cat frontend.log
