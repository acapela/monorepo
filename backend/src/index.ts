process.env.APP = "backend";

import "~config/dotenv";

import * as Sentry from "@sentry/node";

import { IS_DEV } from "~shared/dev";
import { logger } from "~shared/logger";

import { setupServer } from "./app";
import { getDevPublicTunnelURL } from "./localtunnel";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.STAGE,
  });
}

async function start(): Promise<void> {
  logger.info("Starting server...");
  const server = setupServer();
  const port = process.env.BACKEND_PORT;
  server.listen(port, () =>
    logger.info("Server started", {
      port,
      production: process.env.NODE_ENV === "production",
    })
  );

  if (IS_DEV) {
    const tunnelURL = await getDevPublicTunnelURL(3000);
    logger.info(
      {
        url: `${tunnelURL}/api/backend`,
      },
      "Public dev tunnel set up"
    );
  }
}

start();
