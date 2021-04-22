import { createTerminus as gracefulShutdown } from "@godaddy/terminus";
import express, { Application, json } from "express";
import "express-async-errors"; // patches express to handle errors from async functions, must be right after express
import securityMiddleware from "helmet";
import { createServer, Server } from "http";
import { promisify } from "util";
import { initializeSecrets } from "~config";
import logger from "~shared/logger";
import { router as actionRoutes } from "./actions/actions";
import { router as authenticationRoutes } from "./authentication";
import { router as eventRoutes } from "./events/events";
import { errorHandling, notFoundRouteHandling } from "./errors";

export async function setupServer(): Promise<Server> {
  await initializeSecrets();
  const app = express();
  setupMiddleware(app);
  setupRoutes(app);
  setupErrorHandling(app);

  const server = createServer(app);
  setupGracefulShutdown(server);

  return server;
}

function setupMiddleware(app: Application): void {
  app.use(securityMiddleware());
  app.use(logger.middleware);
  app.use(json());
}

function setupRoutes(app: Application): void {
  app.use("/api", authenticationRoutes);
  app.use("/api", eventRoutes);
  app.use("/api", actionRoutes);
}

function setupErrorHandling(app: Application): void {
  app.use(notFoundRouteHandling);
  app.use(errorHandling);
}

function setupGracefulShutdown(server: Server) {
  const closeServer = promisify(server.close.bind(server));

  gracefulShutdown(server, {
    onSignal: () => {
      return closeServer();
    },
    beforeShutdown: () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 5000);
      });
    },
    healthChecks: {
      "/healthz": async function () {
        return true;
      },
    },
  });
}
