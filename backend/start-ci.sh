#!/usr/bin/env bash

nohup yarn ts-node --transpile-only ./src/index.ts & echo $! > backend.pid
