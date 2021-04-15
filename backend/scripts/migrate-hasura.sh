#!/bin/sh

set -eu

[ -z "${HASURA_ENDPOINT:-}" ] && {
  echo "hasura endpoint missing"
  exit 1
}

[ -z "${HASURA_ADMIN_SECRET:-}" ] && {
  echo "hasura admin secret missing"
  exit 1
}

cd ../infrastructure/hasura
hasura migrate apply --endpoint $HASURA_ENDPOINT --admin-secret $HASURA_ADMIN_SECRET
hasura metadata apply --endpoint $HASURA_ENDPOINT --admin-secret $HASURA_ADMIN_SECRET
cd -
