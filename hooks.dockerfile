FROM node:16-buster

WORKDIR /app

ARG SENTRY_RELEASE
ENV SENTRY_RELEASE=${SENTRY_RELEASE:-dev}

ARG BERGLAS_VERSION
RUN npm install -g @install-binary/berglas@${BERGLAS_VERSION}

ENV APP=hooks
ENV HOOKS_PORT=1338
ENV NODE_ENV=production
EXPOSE 1338

COPY ./dist ./dist
COPY ./scripts ./scripts

CMD ["./scripts/start.sh"]
