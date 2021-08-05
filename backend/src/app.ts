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
import { router as transcriptionRoutes } from "./transcriptions/router";
import { router as calendarRoutes } from "./calendar/calendar";
import { errorHandlerMiddleware, notFoundRouteMiddleware } from "./errors/middleware";
import * as Sentry from "@sentry/node";

export async function setupServer(): Promise<Server> {
  await initializeSecrets();
  const app = express();
  setupMiddleware(app);
  setupRoutes(app);
  addErrorHandlersToApp(app);

  const server = createServer(app);
  setupGracefulShutdown(server);

  return server;
}

function setupMiddleware(app: Application): void {
  app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
  app.use(securityMiddleware());
  app.use(logger.middleware);
  app.use(json());
}

function setupRoutes(app: Application): void {
  app.use("/api", authenticationRoutes);
  app.use("/api", eventRoutes);
  app.use("/api", actionRoutes);
  app.use("/api", transcriptionRoutes);
  app.use("/api", calendarRoutes);
}

function addErrorHandlersToApp(app: Application): void {
  app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
  app.use(notFoundRouteMiddleware);
  app.use(errorHandlerMiddleware);
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
