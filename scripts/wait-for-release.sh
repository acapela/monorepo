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

endpoint="app-staging.acape.la"
if [[ "$stage" == "production" ]]; then
    endpoint="app.acape.la"
fi

versionJson=$(curl -sL "https://${endpoint}/api/backend/healthz" || echo "{}")
previousVersion=$( (echo "$versionJson" | jq -r '.version') || echo "unknown" )
./scripts/send-slack-message.sh ":arrows_counterclockwise: The deployment is running (<https://github.com/weareacapela/monorepo/compare/v${previousVersion}...v${version}|${previousVersion} :soon: ${version}>)." "$stage"

if [[ "$stage" == "staging" ]]; then
  echo "not waiting for release on $stage"
  exit
fi

echo "waiting for version $version on $stage"

backend_version=""
i=0
while [ "$backend_version" != "$version" ] ; do
  version_data=$(curl -sL "https://${endpoint}/api/backend/healthz" || echo "{}")
  backend_version=$( (echo "$version_data" | jq -r '.version') || echo "unknown" )
  echo "[$i] current versions: backend=$backend_version"
  i=$((i + 1))
  if [ $i -ge 600 ]; then
    echo "the new version has not been found after 10 minutes. canceling..."
    ./scripts/send-slack-message.sh ":rotating_light: version *${version}* was *not successfully* deployed on $stage" "$stage"
    exit 1
  fi
  sleep 1
done

echo "version $version is deployed on $stage"
./scripts/send-slack-message.sh ":white_check_mark: version <https://github.com/weareacapela/monorepo/releases/tag/v${version}|*${version}*> was successfully deployed at https://$endpoint" "$stage"
