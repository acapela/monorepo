#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "version not set"
  exit 1
fi

version=$1

./scripts/build-and-push.sh $version
./scripts/deploy.sh -s production -a all -v $version
