FROM hasura/graphql-engine:v1.3.2

ENV HASURA_GRAPHQL_DEV_MODE=false

# install cloud sql proxy
RUN wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O /bin/cloud_sql_proxy \
  && echo -e "\
#!/bin/sh\n\
printf \"%s\" \"\$GCLOUD_CREDENTIALS\" | base64 -d > credentials.json\n\
exec /bin/cloud_sql_proxy -credential_file=/credentials.json -instances=\$GCLOUD_INSTANCE -dir=/tmp\n\
" > /bin/run_cloud_sql_proxy \
  && chmod +x bin/run_cloud_sql_proxy \
  && chmod +x bin/cloud_sql_proxy

CMD run_cloud_sql_proxy
# && graphql-engine \
#   serve \
#   --enable-console \
#   --server-port $PORT \
