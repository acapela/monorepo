# we use this build only for the bext build and sentry source maps upload
FROM node:16-buster as builder

WORKDIR /app

ARG BUILD_ID
ENV BUILD_ID=${BUILD_ID:-dev-build}

ARG BUILD_DATE
ENV BUILD_DATE=${BUILD_DATE:-unknown}

ARG SENTRY_RELEASE
ENV SENTRY_RELEASE=${SENTRY_RELEASE:-dev}

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

COPY ./ ./

RUN yarn frontend:build
RUN rm frontend/.next/**/*.map


# main image
FROM node:16-buster

WORKDIR /app

ARG BUILD_ID
ENV BUILD_ID=${BUILD_ID:-dev-build}

ARG BUILD_DATE
ENV BUILD_DATE=${BUILD_DATE:-unknown}

ARG SENTRY_RELEASE
ENV SENTRY_RELEASE=${SENTRY_RELEASE:-dev}

COPY --from=builder /app /app

ENV BACKEND_PORT=1337
EXPOSE 1337

# frontend port
ENV PORT=3030
EXPOSE 3030

ENV NODE_ENV=production
CMD ["yarn", "run", "start:backend"]
