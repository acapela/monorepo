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
yarn hasura metadata apply --endpoint $HASURA_ENDPOINT --admin-secret $HASURA_ADMIN_SECRET
yarn hasura migrate apply --all-databases --endpoint $HASURA_ENDPOINT --admin-secret $HASURA_ADMIN_SECRET
yarn hasura seed apply --database-name default --endpoint $HASURA_ENDPOINT --admin-secret $HASURA_ADMIN_SECRET
yarn hasura metadata reload --endpoint $HASURA_ENDPOINT --admin-secret $HASURA_ADMIN_SECRET
cd -
