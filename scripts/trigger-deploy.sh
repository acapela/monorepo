#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "version not set"
  exit 1
fi

VERSION=$1

payload="{\"ref\":\"master\", \"inputs\":{\"stage\":\"staging\", \"app\": \"api\", \"version\":\"$VERSION\"}}"

echo $payload | jq

curl -X POST \
  -H "Authorization: token $GITHUB_BOT_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/weareacapela/kubernetes/actions/workflows/deploy.yaml/dispatches \
  -d "$payload"
