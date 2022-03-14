#!/bin/bash

set -euo pipefail

berglas exec -- ./scripts/migrate-hasura.sh
berglas exec -- node ./dist/index.js
