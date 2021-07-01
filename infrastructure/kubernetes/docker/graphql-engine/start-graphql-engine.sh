#!/bin/sh

set -e

export HASURA_GRAPHQL_JWT_SECRET="{\"type\":\"HS256\", \"key\": \"${NEXT_AUTH_JWT_SECRET}\"}"

exec graphql-engine \
  --user ${POSTGRES_DB_USER} \
  --password ${POSTGRES_DB_PASSWORD} \
  --dbname ${POSTGRES_DB_NAME} \
  --host ${POSTGRES_DB_HOST} \
  --port ${POSTGRES_DB_PORT} \
  serve
