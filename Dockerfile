FROM node:15-buster

RUN wget https://storage.googleapis.com/berglas/main/linux_amd64/berglas -O /bin/berglas && chmod +x /bin/berglas
RUN curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

WORKDIR /app

ARG BUILD_ID
ENV BUILD_ID=${BUILD_ID:-dev-build}

ARG SENTRY_RELEASE
ENV SENTRY_RELEASE=${SENTRY_RELEASE:-dev}

COPY ./ ./

RUN yarn build

ENV BACKEND_PORT=1337
EXPOSE 1337

ENV FRONTEND_PORT=3000
EXPOSE 3000

ENV NODE_ENV=production
CMD ["yarn", "run", "start:backend"]
