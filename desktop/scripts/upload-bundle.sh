#!/usr/bin/env bash

set -euo pipefail

tar -czvf dist-production.tgz ./dist-production/
ghr -u weareacapela -r monorepo "$RELEASE_VERSION" ./dist-production.tgz
