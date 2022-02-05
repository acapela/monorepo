#!/usr/bin/env bash

set -euo pipefail

rm -rf dist-final && mkdir dist-final

echo "installing ghr..."
wget https://github.com/tcnksm/ghr/releases/download/v0.14.0/ghr_v0.14.0_darwin_amd64.zip
unzip ghr_*
mv ghr_*/ghr ./ghr
./ghr --version

echo "adding staging release..."
cp ./dist-electron-staging/Acapela-* ./dist-final
cp ./dist-electron-staging/latest-mac.yml ./dist-final
echo "uploading staging release..."
./ghr -u weareacapela -r releases-staging "$RELEASE_VERSION" ./dist-final

rm -rf dist-final && mkdir dist-final

echo "packing production release..."
tar -cvf ./dist-final/production.tar ./dist-electron-production/Acapela-* ./dist-electron-production/latest-mac.yml
echo "uploading production release..."
./ghr -u weareacapela -r monorepo "$RELEASE_VERSION" ./dist-final