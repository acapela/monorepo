import "express-async-errors"; // patches express to handle errors from async functions, must be right after express

import { Server, createServer } from "http";
import { promisify } from "util";

import { createTerminus as gracefulShutdown } from "@godaddy/terminus";
import * as Sentry from "@sentry/node";
import cookieParser from "cookie-parser";
import express, { Application, json } from "express";
import securityMiddleware from "helmet";

import { initializeSecrets } from "~config";
import logger from "~shared/logger";

import { router as actionRoutes } from "./actions/actions";
import { router as attachmentsRoutes } from "./attachments/router";
import { router as authenticationRoutes } from "./authentication";
import { router as calendarRoutes } from "./calendar/calendar";
import { router as cronRoutes } from "./cron/cron";
import { errorHandlerMiddleware, notFoundRouteMiddleware } from "./errors/middleware";
import { router as eventRoutes } from "./events/events";
import { setupSlack } from "./slack/setup";
import { router as transcriptionRoutes } from "./transcriptions/router";

export async function setupServer(): Promise<Server> {
  await initializeSecrets();
  const app = express();
  // @slack/bolt needs to be set up before middlewares as it does its own parsing etc.
  setupSlack(app);
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
  app.use(cookieParser());
  app.use(json());
}

function setupRoutes(app: Application): void {
  app.use("/api", authenticationRoutes);
  app.use("/api", eventRoutes);
  app.use("/api", actionRoutes);
  app.use("/api", transcriptionRoutes);
  app.use("/api", calendarRoutes);
  app.use("/api", cronRoutes);
  app.use(attachmentsRoutes);
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
      verbatim: true,
      "/healthz": async function () {
        return {
          version: process.env.SENTRY_RELEASE || "dev",
        };
      },
    },
  });
}
