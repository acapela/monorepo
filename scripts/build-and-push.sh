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
docker build --build-arg SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN" --build-arg BUILD_ID="$GITHUB_SHA" --build-arg BUILD_DATE="$(date '+%Y-%m-%d')" --build-arg SENTRY_RELEASE=$VERSION -t $IMAGE_NAME_VERSION .
docker tag "$IMAGE_NAME_VERSION" "$IMAGE_NAME"

echo "pushing to gcr..."
docker push "$IMAGE_NAME_VERSION"
docker push "$IMAGE_NAME"
