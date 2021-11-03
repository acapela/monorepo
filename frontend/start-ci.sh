#!/usr/bin/env bash

nohup yarn node ./next-server.js > frontend.log 2>&1 & echo $! > frontend.pid
