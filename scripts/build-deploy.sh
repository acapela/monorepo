#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "version not set"
  exit 1
fi

version=$1

./scripts/build-and-push.sh $version

for app in backend frontend; do
  echo "[$app]: trigger deploy"
  for stage in staging production; do
    echo "[$app]: deploying to $version to $stage"
    ./scripts/trigger-deploy.sh $stage $app $version
  done
done
