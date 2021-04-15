#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "version not set"
  exit 1
fi

VERSION=$1
IMAGE_NAME="eu.gcr.io/meetnomoreapp/monorepo"
IMAGE_NAME_VERSION="$IMAGE_NAME:$VERSION"

echo "building image..."
docker build -t $IMAGE_NAME_VERSION .
docker tag $IMAGE_NAME_VERSION $IMAGE_NAME

echo "pushing to gcr..."
docker push $IMAGE_NAME_VERSION
docker push $IMAGE_NAME
