#!/usr/bin/env bash

set -euo pipefail

STAGE="development"

gcloud pubsub topics create "${STAGE}-webhooks-linear"
gcloud beta pubsub subscriptions create "${STAGE}-webhooks-linear-sub" --topic="${STAGE}-webhooks-linear" --enable-exactly-once-delivery
