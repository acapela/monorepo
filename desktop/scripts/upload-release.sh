#!/usr/bin/env bash

set -euo pipefail

rm -rf dist-final
mkdir dist-final

echo "installing ghr..."
wget https://github.com/tcnksm/ghr/releases/download/v0.14.0/ghr_v0.14.0_darwin_amd64.zip
unzip ghr_*
ghr_bin=$(realpath ghr_*/ghr)
$ghr_bin --version

echo "packing production release..."
tar -cvf ./dist-final/production.tar ./dist-electron-production/Acapela-* ./dist-electron-production/latest-mac.yml

echo "adding staging release..."
cp ./dist-electron-staging/Acapela-* ./dist-final
cp ./dist-electron-staging/latest-mac.yml ./dist-final

echo "uploading..."
$ghr_bin -u weareacapela -r monorepo "$RELEASE_VERSION"
