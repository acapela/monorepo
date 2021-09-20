#!/bin/bash

nohup node ./next-server.js & echo $! > frontend.pid
