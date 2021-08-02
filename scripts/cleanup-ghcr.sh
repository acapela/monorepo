#!/bin/bash

set -euo pipefail

container_sha=$(cat oras.log | awk '{ print $2 }' | tail -n 1)
echo "found container sha: $container_sha"

delete_version_url=$(curl -H "Accept: application/vnd.github.v3+json" -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/orgs/weareacapela/packages/container/node-modules/versions |jq -r ".[] | select(.name==\"$container_sha\") | .url")
echo "deleting $delete_version_url"

curl -XDELETE -H "Accept: application/vnd.github.v3+json" -H "Authorization: token $GITHUB_TOKEN" "$delete_version_url"
echo "deleted"
