#!/usr/bin/env bash

set -euo pipefail

STAGE="development"

gcloud pubsub topics create "${STAGE}-webhooks-linear"
gcloud pubsub subscriptions create "${STAGE}-webhooks-linear-sub" \
  --topic="${STAGE}-webhooks-linear" \
  --ack-deadline=30s
