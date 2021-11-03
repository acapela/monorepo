#!/usr/bin/env bash

nohup yarn ts-node --transpile-only ./src/index.ts > backend.log 2>&1 & echo $! > backend.pid
