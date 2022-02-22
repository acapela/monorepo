#!/usr/bin/env bash

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "version not set"
  exit 1
fi
version=$1

echo "downloading production bundle ($version)..."
download_url=$(curl -H "Authorization: token ${GITHUB_TOKEN}" "https://api.github.com/repos/weareacapela/monorepo/releases/tags/${version}" | jq -r '.assets[0].url')
curl -SL -H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/octet-stream"  "$download_url" -o dist-production.tgz
tar -xzvf ./dist-production.tgz
rm ./dist-production.tgz
