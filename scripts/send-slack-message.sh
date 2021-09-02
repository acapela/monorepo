#!/bin/bash

set -eou pipefail

if [ -z "${1:-}" ]; then
  echo "message missing"
  exit 1
fi
message=$1

curl -s -X POST -H "Content-type: application/json" --data "{\"text\":\"$message\"}" "$SLACK_WEBHOOK_URL" > /dev/null
