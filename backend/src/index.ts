process.env.APP = "backend";

import "@aca/config/dotenv";

import "./axios-trace";

import * as Sentry from "@sentry/node";

import { IS_DEV } from "@aca/shared/dev";
import { logger } from "@aca/shared/logger";

import { setupServer } from "./app";
import { getDevPublicTunnelURL } from "./localtunnel";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.STAGE,
    maxValueLength: 10000,
  });
}

async function start(): Promise<void> {
  logger.info("Starting server...");
  const server = setupServer();
  const port = process.env.BACKEND_PORT;
  server.listen(port, () =>
    logger.info(`Server started on port ${port}`, {
      port,
      production: process.env.NODE_ENV === "production",
    })
  );

  if (!IS_DEV) return;

  try {
    const tunnelURL = await getDevPublicTunnelURL(3000);
    logger.info(
      {
        url: `${tunnelURL}/api/backend`,
      },
      "Public dev tunnel set up"
    );
  } catch (e) {
    // ngrok could not be started, force shutdown
    logger.error(e, "could not start ngrok tunnel");
    process.exit(1);
  }
}

start();
