FROM node:16-buster

WORKDIR /app

ARG SENTRY_RELEASE
ENV SENTRY_RELEASE=${SENTRY_RELEASE:-dev}

ARG HASURA_VERSION
RUN npm install -g @install-binary/hasura@${HASURA_VERSION}

ARG BERGLAS_VERSION
RUN npm install -g @install-binary/berglas@${BERGLAS_VERSION}

ARG PRISMA_VERSION
RUN npm install -g @prisma/client@${PRISMA_VERSION}

ENV NODE_PATH=/usr/local/lib/node_modules
ENV APP=backend
ENV BACKEND_PORT=1337
ENV NODE_ENV=production
EXPOSE 1337

COPY ./dist ./dist
COPY ./scripts ./scripts
COPY ./.prisma /usr/local/lib/node_modules

CMD ["./scripts/start.sh"]
