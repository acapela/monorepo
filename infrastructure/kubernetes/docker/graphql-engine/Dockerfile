FROM hasura/graphql-engine:v2.6.2

RUN apt-get update && apt-get install wget -y && rm -rf /var/lib/apt/lists/*
RUN wget https://storage.googleapis.com/berglas/main/linux_amd64/berglas -O /bin/berglas && chmod +x /bin/berglas
ADD start-graphql-engine.sh /

ENTRYPOINT ["berglas", "exec", "--", "/start-graphql-engine.sh"]
