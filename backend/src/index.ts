// We need to load secrets before any configuration is accessed, which is why we are doing lazy imports in this file
import { initializeSecrets } from "@acapela/config";

async function start(): Promise<void> {
  // Note: We're lazy loading modules here to avoid requesting config too early.
  await initializeSecrets();

  const { log } = await import("@acapela/shared/logger");
  log.info("Environment variables loaded");
  log.info("Secrets loaded");
  const serverModule = await import("./app");

  const server = serverModule.setupServer();

  const port = process.env.BACKEND_PORT;

  server.listen(port, () =>
    log.info("Server started", {
      port,
      production: process.env.NODE_ENV === "production",
    })
  );
}

start();
