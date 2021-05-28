/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const next = require("next");
const proxy = require("express-http-proxy");
const dotenv = require("dotenv");
const path = require("path");

const production = process.env.NODE_ENV === "production";
dotenv.config({ path: production ? process.cwd() : path.resolve(__dirname, "..", ".env") });

const app = next({ dir: process.cwd(), customServer: false });
const handle = app.getRequestHandler();

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

  const port = process.env.FRONTEND_PORT || 3000;
  app.listen(port, () => {
    console.info(`Server started ${port} prod=${production}`);
  });
}

start();
