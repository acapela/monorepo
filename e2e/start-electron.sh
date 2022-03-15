#!/usr/bin/env bash

set -euo pipefail
export ELECTRON_IS_DEV=0
export DISPLAY=':99.0'
Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
xvfb-run ../desktop/dist-electron/linux-unpacked/@acadesktop
