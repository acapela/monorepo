#!/bin/bash

set -eou pipefail

if [ -z "${1:-}" ]; then
  echo "stage not set"
  exit 1
fi
stage=$1

if [ -z "${2:-}" ]; then
  echo "version not set"
  exit 1
fi
version=$2

endpoint="app-staging.acape.la"
if [[ "$stage" == "production" ]]; then
    endpoint="app.acape.la"
fi

echo "waiting for version $version on $stage"

backend_version=""
frontend_version=""
i=0
while [ "$backend_version" != "$version" ] || [ "$frontend_version" != "$version" ]; do
  version_data=$(curl -sL "https://${endpoint}/healthz")
  backend_version=$(echo "$version_data" | jq -r '.backend.version')
  frontend_version=$(echo "$version_data" | jq -r '.version')
  echo "[$i] current versions: backend=$backend_version frontend=$frontend_version"
  i=$((i + 1))
  if [ $i -ge 600 ]; then
    echo "the new version has not been found after 10 minutes. canceling..."
    exit 1
  fi
  sleep 1
done

echo "version $version is deployed on $stage"
