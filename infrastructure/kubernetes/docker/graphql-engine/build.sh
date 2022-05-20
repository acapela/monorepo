#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "version not set"
  exit 1
fi

version=$1

echo "running docker build..."

image_name="eu.gcr.io/meetnomoreapp/graphql-engine"
image_name_version="$image_name:$version"

echo "image: $image_name_version"

docker buildx build --platform linux/amd64 -t $image_name_version .
docker tag $image_name_version $image_name
docker push $image_name_version
docker push $image_name
