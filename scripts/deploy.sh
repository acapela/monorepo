#!/bin/bash

set -euo pipefail

[ ! -z "${KUSTOMIZE_BIN:-}" ] && {
  KUSTOMIZE_BIN=$(realpath $KUSTOMIZE_BIN)
}

kustomize_command=${KUSTOMIZE_BIN:-kustomize}

usage() {
cat << EOF
  Usage: $0 options
    -s Stage (staging|production)
    -a Application (api)
    -v Application version
    -t Dry run
    -h Help
EOF
exit 1;
}

DRY_RUN="";
while getopts "s:a:v:ht" opt; do
  case $opt in
    s) STAGE=${OPTARG}
      ;;
    a) APP_NAME=${OPTARG}
      ;;
    v) APP_VERSION=${OPTARG}
      ;;
    h) usage
      ;;
    t) DRY_RUN="--dry-run=client"
      ;;
    \?) echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done

[ -z "${STAGE:-}" ] && {
  echo "Stage is missing"
  usage
}

[ -z "${APP_NAME:-}" ] && {
  echo "Application name is missing"
  usage
}

[ -z "${APP_VERSION:-}" ] && {
  echo "Application version is missing"
  usage
}

if [[ "${APP_NAME}" == "backend" ]]; then
  APP_NAME="api"
fi

if [[ "${APP_VERSION}" == "latest" ]]; then
  echo "resolving latest release..."
  latest_version=$(curl -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/weareacapela/monorepo/releases/latest | jq -r '.name')
  APP_VERSION="${latest_version:1}"
  echo "found release: $APP_VERSION"
fi

kubernetes_dir="infrastructure/kubernetes/"

app_dir="${kubernetes_dir}${APP_NAME}/${STAGE}"

if [[ ! -d $app_dir ]]; then
  echo "invalid app or stage: $app_dir"
  exit 1
fi

echo "deploying ${APP_NAME}@${APP_VERSION} to $STAGE"

image_name=$(cat "${kubernetes_dir}${APP_NAME}/image_name")

echo "updating image $image_name to $APP_VERSION"

cd $app_dir
$kustomize_command edit set image $image_name:$APP_VERSION
cd -

$kustomize_command build $app_dir | kubectl apply $DRY_RUN -f -
