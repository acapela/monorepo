// We need to load secrets before any configuration is accessed, which is why we are doing lazy imports in this file
import config from "./config";

async function start(): Promise<void> {
  await config.load();
  const logger = require("./logger");
  logger.info("Configuration loaded");
  const server = require("./app").setupServer();
  const port = config.get("port");
  server.listen(port, () =>
    logger.info("Server started", {
      port,
      production: process.env.NODE_ENV === "production",
    })
  );
}

start();
