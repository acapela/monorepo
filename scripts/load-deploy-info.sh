#!/usr/bin/env bash

set -euo pipefail

read -ra deployInfo < ./deploy-info.txt
stage="${deployInfo[0]}"
version="${deployInfo[1]}"

if [[ "$stage" == "staging" ]]; then
  echo "no release necessary for $stage"
  exit 1
fi

echo "RELEASE_VERSION=v${version}" >> $GITHUB_ENV
