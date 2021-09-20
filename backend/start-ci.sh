#!/bin/bash

nohup ts-node --transpile-only ./src/index.ts & echo $! > backend.pid
