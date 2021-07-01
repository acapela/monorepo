FROM hasura/graphql-engine:v1.3.3

RUN wget https://storage.googleapis.com/berglas/main/linux_amd64/berglas -O /bin/berglas && chmod +x /bin/berglas
ADD start-graphql-engine.sh /

ENTRYPOINT ["berglas", "exec", "--", "/start-graphql-engine.sh"]
