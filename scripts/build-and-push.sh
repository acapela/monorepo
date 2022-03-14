#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "version not set"
  exit 1
fi

VERSION=$1

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
cp -r node_modules/.prisma backend/

echo "[monorepo] building image..."
MONOREPO_IMAGE_NAME="eu.gcr.io/meetnomoreapp/monorepo"
MONOREPO_IMAGE_NAME_VERSION="$MONOREPO_IMAGE_NAME:$VERSION"
docker build \
  --build-arg SENTRY_RELEASE="$VERSION" \
  --build-arg HASURA_VERSION="$(jq -r '.dependencies["@install-binary/hasura"]' ./package.json)" \
  --build-arg PRISMA_VERSION="$(jq -r '.dependencies["@prisma/client"]' ./db/package.json)" \
  --build-arg BERGLAS_VERSION="$(jq -r '.dependencies["@install-binary/berglas"]' ./package.json)" \
  -t "$MONOREPO_IMAGE_NAME_VERSION" -f ./monorepo.dockerfile ./backend
docker tag "$MONOREPO_IMAGE_NAME_VERSION" "$MONOREPO_IMAGE_NAME"

echo "pushing to gcr..."
docker push "$MONOREPO_IMAGE_NAME_VERSION"
docker push "$MONOREPO_IMAGE_NAME"

docker push "$CADDY_IMAGE_NAME_VERSION"
docker push "$CADDY_IMAGE_NAME"
