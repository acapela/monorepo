#!/bin/bash

set -euo pipefail

kustomize_command=${KUSTOMIZE_CMD:-"yarn kustomize"}

usage() {
cat << EOF
  Usage: $0 options
    -s Stage (staging|production)
    -a Application (api)
    -v Application version
    -t Dry run
    -S send no slack messages (ignored if application is all)
    -h Help
EOF
exit 1;
}

SILENT_MODE="false"
DRY_RUN="";
while getopts "s:a:v:htS" opt; do
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
    S) SILENT_MODE="true"
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
  latest_version=$(curl -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/acapela/monorepo/releases/latest | jq -r '.name')
  APP_VERSION="${latest_version:1}"
  echo "found release: $APP_VERSION"
fi

# all means we want to deploy api and frontend
if [[ "${APP_NAME}" == "all" ]]; then
  echo "deploying frontend, api and hooks..."
  ./scripts/send-slack-message.sh ":rocket: deploying version *${APP_VERSION}* to *${STAGE}*" "$STAGE"
  ./scripts/deploy.sh -s "$STAGE" -a api -v "$APP_VERSION" -S
  ./scripts/deploy.sh -s "$STAGE" -a hooks -v "$APP_VERSION" -S
  ./scripts/deploy.sh -s "$STAGE" -a frontend -v "$APP_VERSION" -S
  ./scripts/wait-for-release.sh "$STAGE" "$APP_VERSION"
  echo "creating deploy-info.txt"
  echo "${STAGE} ${APP_VERSION}" > deploy-info.txt
  exit
fi

kubernetes_dir="infrastructure/kubernetes/"

app_dir="${kubernetes_dir}${APP_NAME}/${STAGE}"

if [[ ! -d $app_dir ]]; then
  echo "invalid app or stage: $app_dir"
  exit 1
fi

echo "deploying ${APP_NAME}@${APP_VERSION} to $STAGE"

[[ "${SILENT_MODE}" == "false" ]] && ./scripts/send-slack-message.sh ":rocket: deploying *${APP_NAME}@${APP_VERSION}* to *${STAGE}*" "$STAGE"

cd "$app_dir"
while read image_name; do
  echo "updating image $image_name to $APP_VERSION"
  $kustomize_command edit set image "$image_name:$APP_VERSION"
done < ../image_name
cd -

$kustomize_command build "$app_dir" | kubectl apply $DRY_RUN -f -
