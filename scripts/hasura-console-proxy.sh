#!/bin/bash

set -euo pipefail

command -v kubectl >/dev/null || {
  echo "kubectl is not installed. Try to run:"
  echo "brew install kubectl"
  exit 1
}

command -v gcloud >/dev/null || {
  echo "gcloud is not installed: https://cloud.google.com/sdk/docs/install#mac"
  exit 1
}

[[ ! -f "$HOME/.kube/config" ]] && {
  echo "kubectl config is not found"
  echo "trying to fetch config..."
  gcloud container clusters get-credentials cluster-1 --region europe-west1 --project meetnomoreapp
  kubectl version --short
}

stage="${1:-}"
[[ -z "$stage" ]] && {
  echo "stage not set, using production as default"
  stage="production"
}

[[ "$stage" != "staging" && "$stage" != "production" ]] && {
  echo "invalid stage: $stage"
  echo "use either staging or production"
  exit 1
}

port="58080"
[[ "$stage" == "production" ]] && {
  port="58081"
}

echo "proxying hasura console for $stage to http://localhost:${port}"
open "http://localhost:${port}"
kubectl -n $stage port-forward deployment/hasura ${port}:8080
