#!/bin/sh

set -e

export HASURA_GRAPHQL_JWT_SECRET="{\"type\":\"HS256\", \"key\": \"${NEXT_AUTH_JWT_SECRET}\", \"header\": {\"type\": \"Cookie\", \"name\": \"next-auth.session-token\" }}"
export HASURA_GRAPHQL_DATABASE_URL="postgres://${POSTGRES_DB_USER}:$(echo "$POSTGRES_DB_PASSWORD" | sed 's/\//%2F/g')@${POSTGRES_DB_HOST}:${POSTGRES_DB_PORT}/${POSTGRES_DB_NAME}"

exec graphql-engine serve
