#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "version not set"
  exit 1
fi

export VERSION=$1

HASURA_VERSION=$(jq -r '.dependencies["@install-binary/hasura"]' ./package.json)
PRISMA_VERSION="$(jq -r '.dependencies["@prisma/client"]' ./db/package.json)"
BERGLAS_VERSION="$(jq -r '.dependencies["@install-binary/berglas"]' ./package.json)"

echo "[caddy]: running frontend build"
yarn frontend:build
cp Caddyfile ./frontend

echo "[caddy] building image..."
CADDY_IMAGE_NAME="eu.gcr.io/meetnomoreapp/caddy"
CADDY_IMAGE_NAME_VERSION="$CADDY_IMAGE_NAME:$VERSION"
docker build -t "$CADDY_IMAGE_NAME_VERSION" -f ./caddy.dockerfile ./frontend
docker tag "$CADDY_IMAGE_NAME_VERSION" "$CADDY_IMAGE_NAME"

echo "[monorepo]: running backend build"
yarn backend:build
yarn backend upload:sourcemaps
cp -r node_modules/.prisma backend/
cp -r node_modules/.prisma backend/
cp -r infrastructure/hasura backend/

echo "[monorepo] building image..."
MONOREPO_IMAGE_NAME="eu.gcr.io/meetnomoreapp/monorepo"
MONOREPO_IMAGE_NAME_VERSION="$MONOREPO_IMAGE_NAME:$VERSION"
docker build \
  --build-arg SENTRY_RELEASE="$VERSION" \
  --build-arg HASURA_VERSION="$HASURA_VERSION" \
  --build-arg PRISMA_VERSION="$PRISMA_VERSION" \
  --build-arg BERGLAS_VERSION="$BERGLAS_VERSION" \
  -t "$MONOREPO_IMAGE_NAME_VERSION" -f ./monorepo.dockerfile ./backend
docker tag "$MONOREPO_IMAGE_NAME_VERSION" "$MONOREPO_IMAGE_NAME"

echo "[hooks]: running hooks build"
yarn hooks build
yarn hooks upload:sourcemaps

echo "[hooks] building image..."
HOOKS_IMAGE_NAME="eu.gcr.io/meetnomoreapp/hooks"
HOOKS_IMAGE_NAME_VERSION="$HOOKS_IMAGE_NAME:$VERSION"
docker build \
  --build-arg SENTRY_RELEASE="$VERSION" \
  --build-arg BERGLAS_VERSION="$BERGLAS_VERSION" \
  -t "$HOOKS_IMAGE_NAME_VERSION" -f ./hooks.dockerfile ./hooks
docker tag "$HOOKS_IMAGE_NAME_VERSION" "$HOOKS_IMAGE_NAME"

echo "pushing to gcr..."
docker push "$MONOREPO_IMAGE_NAME_VERSION"
docker push "$MONOREPO_IMAGE_NAME"

docker push "$HOOKS_IMAGE_NAME_VERSION"
docker push "$HOOKS_IMAGE_NAME"

docker push "$CADDY_IMAGE_NAME_VERSION"
docker push "$CADDY_IMAGE_NAME"
