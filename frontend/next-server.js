/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const next = require("next");
const proxy = require("express-http-proxy");

const production = process.env.NODE_ENV === "production";
const app = next({ dir: process.cwd(), customServer: false });
const handle = app.getRequestHandler();

async function start() {
  console.log("Starting server");
  const app = express();

  app.get("/healthz", (req, res) => {
    res.send({ ok: true });
  });

  // TODO: use correct endpoint from env
  app.use("/graphql", proxy("https://backend-staging.acape.la/v1/graphql"));
  app.use("/api/backend/*", proxy("https://api-staging.acape.la/api/"));

  app.all("*", (req, res) => handle(req, res));

  const port = process.env.FRONTEND_PORT || 3000;
  app.listen(port, () => {
    console.log(`Server started ${port} prod=${production}`);
  });
}

start();
