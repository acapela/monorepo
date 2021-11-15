#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "version not set"
  exit 1
fi

VERSION=$1

echo "[caddy] building image..."
CADDY_IMAGE_NAME="eu.gcr.io/meetnomoreapp/caddy"
CADDY_IMAGE_NAME_VERSION="$CADDY_IMAGE_NAME:$VERSION"

docker build -t "$CADDY_IMAGE_NAME_VERSION" -f ./caddy.dockerfile .
docker tag "$CADDY_IMAGE_NAME_VERSION" "$CADDY_IMAGE_NAME"

echo "[monorepo] building image..."
MONOREPO_IMAGE_NAME="eu.gcr.io/meetnomoreapp/monorepo"
MONOREPO_IMAGE_NAME_VERSION="$MONOREPO_IMAGE_NAME:$VERSION"
docker build --build-arg SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN" --build-arg BUILD_ID="$GITHUB_SHA" --build-arg BUILD_DATE="$(date '+%Y-%m-%d')" --build-arg SENTRY_RELEASE="$VERSION" -t "$MONOREPO_IMAGE_NAME_VERSION" -f ./monorepo.dockerfile .
docker tag "$MONOREPO_IMAGE_NAME_VERSION" "$MONOREPO_IMAGE_NAME"

echo "pushing to gcr..."
docker push "$MONOREPO_IMAGE_NAME_VERSION"
docker push "$MONOREPO_IMAGE_NAME"

docker push "$CADDY_IMAGE_NAME_VERSION"
docker push "$CADDY_IMAGE_NAME"
