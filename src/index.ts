// We need to load secrets before any configuration is accessed, which is why we are doing lazy imports in this file
import config from "./config";

async function start(): Promise<void> {
  // Note: We're lazy loading modules here to avoid requesting config too early.
  await config.load();
  const logger = await import("./logger");
  logger.info("Configuration loaded");
  const serverModule = await import("./app");

  const server = serverModule.setupServer();

  /**
   * Make sure we have proper firebase admin access. Starting the server without firebase
   * admin access might lead to unexpected errors.
   */
  await (await import("./firebase")).assertHasFirebaseAdminAccess();

  const port = config.get("port");
  server.listen(port, () =>
    logger.info("Server started", {
      port,
      production: process.env.NODE_ENV === "production",
    })
  );
}

start();
