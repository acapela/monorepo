#!/bin/bash

set -euo pipefail

STAGE=${1:-}
VERSION=${2:-}

[ -z "$STAGE" ] && {
  echo "stage not set"
  exit 1
}

[ -z "$VERSION" ] && {
  echo "version not set"
  exit 1
}

payload="{\"ref\":\"master\", \"inputs\":{\"stage\":\"$STAGE\", \"app\":\"frontend\", \"version\":\"$VERSION\"}}"

echo $payload | jq

echo "starting deployment..."
curl -X POST \
  -H "Authorization: token $GH_BOT_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/weareacapela/kubernetes/actions/workflows/deploy.yaml/dispatches \
  -d "$payload"
