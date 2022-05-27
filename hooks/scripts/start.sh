#!/bin/bash

set -euo pipefail

berglas exec -- node -r newrelic ./dist/hooks/index.js
