FROM hasura/graphql-engine:v1.3.2.cli-migrations-v2

ENV HASURA_GRAPHQL_DEV_MODE=false

ADD ./migrations /hasura-migrations
ADD ./metadata /hasura-metadata

# here we first install cloud sql proxy.
# then, we create a script that will start the proxy in the background
RUN wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O /bin/cloud_sql_proxy \
  && echo -e "\
#!/bin/sh\n\
printf \"%s\" \"\$GCLOUD_CREDENTIALS\" | base64 -d > credentials.json\n\
exec /bin/cloud_sql_proxy -credential_file=/credentials.json -instances=\$GCLOUD_INSTANCE -dir=/tmp &\n\
" > /bin/run_cloud_sql_proxy \
  && chmod +x bin/run_cloud_sql_proxy \
  && chmod +x bin/cloud_sql_proxy

# we run the script that will start the proxy and then start hasura
CMD ["sh","-c","run_cloud_sql_proxy && graphql-engine serve --enable-console --server-port $PORT"]
