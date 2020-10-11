FROM hasura/graphql-engine:v1.3.2

ENV HASURA_GRAPHQL_DEV_MODE=false

CMD graphql-engine \
   --database-url $DATABASE_URL \
   serve \
   --enable-console true \
   --server-port $PORT \
   --admin-secret $HASURA_GRAPHQL_ADMIN_SECRET \
   --jwt-secret $HASURA_GRAPHQL_JWT_SECRET \
