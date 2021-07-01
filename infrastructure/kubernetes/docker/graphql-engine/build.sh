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

docker build -t $image_name_version .
docker tag $image_name_version $image_name
