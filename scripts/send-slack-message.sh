#!/bin/bash

set -eou pipefail

if [ -z "${1:-}" ]; then
  echo "message missing"
  exit 1
fi
message=$1

if [ -z "${2:-}" ]; then
  echo "stage missing"
  exit 1
fi
stage=$2

if [[ "$stage" == "staging" ]]; then
  echo "sending no slack message for $stage"
  exit
fi

curl -s -X POST -H "Content-type: application/json" --data "{\"text\":\"$message\"}" "$SLACK_WEBHOOK_URL" > /dev/null

if [[ "${3:-}" == "product" ]]; then
  curl -s -X POST -H "Content-type: application/json" --data "{\"text\":\"$message\"}" "$SLACK_PRODUCT_WEBHOOK_URL" > /dev/null
fi
