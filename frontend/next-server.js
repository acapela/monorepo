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

const production = process.env.NODE_ENV === "production";
dotenv.config({ path: production ? process.cwd() : path.resolve(__dirname, "..", ".env") });

const stage = process.env.STAGE;
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: stage,
  });
} else {
  console.info(`Sentry disabled for ${stage}`);
}

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
  console.info("starting server...");
  console.info(config);
  console.info("preparing next app...");
  await nextApp.prepare();

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
    console.info(`server started ${port} prod=${production}`);
  });
}

start();
