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

if [[ "$stage" == "staging" ]]; then
  echo "no release necessary for $stage"
  exit
fi

echo "installing ghr..."
wget https://github.com/tcnksm/ghr/releases/download/v0.14.0/ghr_v0.14.0_darwin_amd64.zip
unzip ghr_*
mv ghr_*/ghr ./ghr
./ghr --version

echo "downloading production app..."
download_url=$(curl -H "Authorization: token ${GITHUB_TOKEN}" "https://api.github.com/repos/weareacapela/monorepo/releases/tags/v${version}" | jq -r '.assets[0].url')
curl -SL -H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/octet-stream"  "$download_url" -o production.tar
tar xvf ./production.tar

echo "uploading production app..."
./ghr -u weareacapela -r releases "v${version}" ./dist-electron-production
