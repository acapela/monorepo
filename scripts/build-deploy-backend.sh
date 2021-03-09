#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "version not set"
  exit 1
fi

version=$1

gcloud auth configure-docker eu.gcr.io

cd backend
./scripts/build-and-push.sh $version

for stage in staging production; do
  echo "deploying to $version to $stage"
  ./scripts/trigger-deploy.sh $stage $version
done
