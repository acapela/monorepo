process.env.APP = "backend";
// We need to load secrets before any configuration is accessed, which is why we are doing lazy imports in this file
import { initializeSecrets } from "~config";
import * as Sentry from "@sentry/node";

if (["staging", "production"].includes(process.env.STAGE)) {
  Sentry.init({
    dsn: "https://017fa51dedd44c1185871241d2257ce6@o485543.ingest.sentry.io/5541047",

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
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
}

start();
