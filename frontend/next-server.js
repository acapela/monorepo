/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require("axios");
const express = require("express");
const http = require("http");
const next = require("next");
const expressProxy = require("express-http-proxy");
const dotenv = require("dotenv");
const path = require("path");
const Sentry = require("@sentry/node");
const httpProxy = require("http-proxy");

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
    // we can safely ignore this error: https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
    ignoreErrors: ["ResizeObserver loop limit exceeded"],
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
    const newRoute = prefix + req.params[0] + (parts.length === 2 ? "?" + parts[1] : "");
    return newRoute;
  };
}

const config = {
  apiEndpoint: process.env.BACKEND_HOST || "http://api",
  hasuraEndpoint: process.env.HASURA_HOST || "http://hasura",
  hasuraWsEndpoint: process.env.HASURA_WEBSOCKET_PROXY_ENDPOINT || "ws://hasura",
};

async function start() {
  console.info("Starting server...");
  console.info(config);

  const app = express();
  const server = http.createServer(app);

  const wsProxy = httpProxy.createProxyServer({
    target: config.hasuraWsEndpoint,
    ws: true,
  });
  server.on("upgrade", function (req, socket, head) {
    console.info("WebSocket proxy request:", req.url);
    wsProxy.ws(req, socket, head);
  });

  app.use(Sentry.Handlers.requestHandler());
  app.get("/healthz", async (req, res) => {
    const [backendRes, hasuraRes, hasuraVersionRes] = await Promise.all([
      axios.get(`${config.apiEndpoint}/healthz`),
      axios.get(`${config.hasuraEndpoint}/healthz`),
      axios.get(`${config.hasuraEndpoint}/v1/version`),
    ]);
    res.send({
      status: "ok",
      version: process.env.SENTRY_RELEASE || "dev",
      backend: backendRes.data,
      hasura: {
        status: hasuraRes.data,
        ...hasuraVersionRes.data,
      },
    });
  });

  app.use(
    "/graphql/?*",
    expressProxy(config.hasuraEndpoint, { proxyReqPathResolver: proxyReqPathResolverWithPrefix("/v1/graphql/") })
  );
  app.use(
    "/api/backend/?*",
    expressProxy(config.apiEndpoint, { proxyReqPathResolver: proxyReqPathResolverWithPrefix("/api/") })
  );
  app.use(
    "/attachments/?*",
    expressProxy(config.apiEndpoint, { proxyReqPathResolver: proxyReqPathResolverWithPrefix("/attachments/") })
  );

  app.all("*", (req, res) => handle(req, res));

  app.use(Sentry.Handlers.errorHandler());

  const port = process.env.FRONTEND_PORT || 3000;
  server.listen(port, () => {
    console.info(`Server started ${port} prod=${production}`);
  });
}

start();
