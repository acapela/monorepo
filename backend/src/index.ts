process.env.APP = "backend";

import * as Sentry from "@sentry/node";

// We need to load secrets before any configuration is accessed, which is why we are doing lazy imports in this file
import { initializeSecrets } from "~config";
import { IS_DEV } from "~shared/dev";

import { getDevPublicTunnelURL } from "./localtunnel";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.STAGE,
  });
}

async function start(): Promise<void> {
  // Note: We're lazy loading modules here to avoid requesting config too early.
  await initializeSecrets();

  const { log } = await import("~shared/logger");
  log.info("Environment variables loaded");
  log.info("Secrets loaded");
  const serverModule = await import("./app");

  const server = await serverModule.setupServer();

  const port = process.env.BACKEND_PORT;

  server.listen(port, () =>
    log.info("Server started", {
      port,
      production: process.env.NODE_ENV === "production",
    })
  );

  if (IS_DEV) {
    const tunnelURL = await getDevPublicTunnelURL(3000);
    log.info("Public dev tunnel set up", {
      url: `${tunnelURL}/api/backend`,
    });
  }
}

start();
