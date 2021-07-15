/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const next = require("next");
const proxy = require("express-http-proxy");
const dotenv = require("dotenv");
const path = require("path");
const Sentry = require("@sentry/node");

const stage = process.env.STAGE;
if (["staging", "production"].includes(stage)) {
  Sentry.init({
    dsn: "https://017fa51dedd44c1185871241d2257ce6@o485543.ingest.sentry.io/5541047",
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
    environment: stage,
  });
} else {
  console.info(`Sentry disabled for ${stage}`);
}

const production = process.env.NODE_ENV === "production";
dotenv.config({ path: production ? process.cwd() : path.resolve(__dirname, "..", ".env") });

const nextApp = next({ dir: process.cwd(), customServer: false });
const handle = nextApp.getRequestHandler();

function proxyReqPathResolverWithPrefix(prefix) {
  prefix = prefix || "/";
  return (req) => {
    const parts = req.url.split("?");
    const newRoute = prefix + req.params[0] + (parts.length == 2 ? "?" + parts[1] : "");
    return newRoute;
  };
}

const config = {
  apiEndpoint: process.env.BACKEND_HOST || "https://api-staging.acape.la",
  hasuraEndpoint: process.env.HASURA_HOST || "https://backend-staging.acape.la",
};

async function start() {
  console.info("Starting server...");
  console.info(config);
  const app = express();

  app.use(Sentry.Handlers.requestHandler());

  app.get("/healthz", (req, res) => res.send({ ok: true }));

  app.use(
    "/graphql/?*",
    proxy(config.hasuraEndpoint, { proxyReqPathResolver: proxyReqPathResolverWithPrefix("/v1/graphql/") })
  );
  app.use(
    "/api/backend/?*",
    proxy(config.apiEndpoint, { proxyReqPathResolver: proxyReqPathResolverWithPrefix("/api/") })
  );

  app.all("*", (req, res) => handle(req, res));

  app.use(Sentry.Handlers.errorHandler());

  const port = process.env.FRONTEND_PORT || 3000;
  app.listen(port, () => {
    console.info(`Server started ${port} prod=${production}`);
  });
}

start();
