#!/usr/bin/env bash

nohup yarn node ./next-server.js & echo $! > frontend.pid
