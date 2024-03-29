#!/bin/bash

set -euo pipefail

[ -z "${HASURA_ENDPOINT:-}" ] && {
  echo "hasura endpoint missing"
  exit 1
}

[ -z "${HASURA_ADMIN_SECRET:-}" ] && {
  echo "hasura admin secret missing"
  exit 1
}

set -x

cd ./hasura
hasura metadata apply --endpoint $HASURA_ENDPOINT --admin-secret $HASURA_ADMIN_SECRET
hasura migrate apply --all-databases --endpoint $HASURA_ENDPOINT --admin-secret $HASURA_ADMIN_SECRET
hasura metadata reload --endpoint $HASURA_ENDPOINT --admin-secret $HASURA_ADMIN_SECRET
cd -
