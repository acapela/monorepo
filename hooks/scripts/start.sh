#!/bin/bash

set -euo pipefail

berglas exec -- node ./dist/hooks/index.js
