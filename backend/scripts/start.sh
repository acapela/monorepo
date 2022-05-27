#!/bin/bash

set -euo pipefail

berglas exec -- ./scripts/migrate-hasura.sh
berglas exec -- node -r newrelic ./dist/index.js
