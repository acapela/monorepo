import "express-async-errors"; // patches express to handle errors from async functions, must be right after express

import { Server, ServerResponse, createServer } from "http";
import { promisify } from "util";

import { createTerminus as gracefulShutdown } from "@godaddy/terminus";
import * as Sentry from "@sentry/node";
import axios from "axios";
import cookieParser from "cookie-parser";
import express, { Application, Request, urlencoded } from "express";
import securityMiddleware from "helmet";

import { listenToGmailSubscription } from "@aca/backend/src/gmail/capture";
import { db } from "@aca/db";
import { IS_DEV } from "@aca/shared/dev";
import { logger } from "@aca/shared/logger";

import { router as actionRoutes } from "./actions/actions";
import { router as asanaRoutes } from "./asana/router";
import { router as atlassianRoutes } from "./atlassian";
import { router as authenticationRoutes } from "./authentication";
import { router as clickupRoutes } from "./clickup/router";
import { router as cronRoutes } from "./cron/cron";
import { setupFakeDataRoute } from "./dev/fakeData";
import { errorHandlerMiddleware, notFoundRouteMiddleware } from "./errors/middleware";
import { router as eventRoutes } from "./events/events";
import { router as githubRoutes } from "./github/router";
import { router as linearRoutes } from "./linear/router";
import nextAuth from "./nextAuth";
import { router as sentryTunnel } from "./sentryTunnel";
import { setupSlack } from "./slack/setup";
import { router as stripeRoutes } from "./subscription";
import { router as tracking } from "./tracking";
import { router as waitlistRoutes } from "./waitlist/waitlist";

const NANOSECONDS_IN_MILLISECOND = 1e6;

export function setupServer(): Server {
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
  app.use(function middleware(req: Request, res: ServerResponse, next: () => void): void {
    const startTime = process.hrtime();
    res.once("finish", () => {
      const requestStatusDescription = `[${req.method}] ${req.url} (status: ${res.statusCode})`;
      if (IS_DEV) {
        logger.info(`Request finished - ${requestStatusDescription}`);
      } else {
        logger.info(
          {
            host: req.hostname,
            userAgent: req.get("user-agent"),
            timeInMilliseconds: process.hrtime(startTime)[1] / NANOSECONDS_IN_MILLISECOND,
          },
          `Request finished - ${requestStatusDescription}`
        );
      }
    });
    next();
  });
  app.use(cookieParser());
  app.use((req, res, next): void => {
    if (req.originalUrl.endsWith("/stripe/webhook")) {
      next();
    } else {
      express.json()(req, res, next);
    }
  });
  app.use(urlencoded({ extended: true })); // needed for next-auth
}

function setupRoutes(app: Application): void {
  app.use(
    "/api",
    authenticationRoutes,
    eventRoutes,
    actionRoutes,
    cronRoutes,
    waitlistRoutes,
    tracking,
    linearRoutes,
    atlassianRoutes,
    githubRoutes,
    asanaRoutes,
    clickupRoutes,
    stripeRoutes
  );

  nextAuth(app);

  listenToGmailSubscription();

  app.use(sentryTunnel);

  if (IS_DEV) {
    logger.info("Setting up dev fake data route");
    setupFakeDataRoute(app);
  }
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
    logger(msg, error) {
      if (error) {
        logger.error(error, "error thrown in /healthz " + msg);
      } else {
        logger.info("/healthz " + msg);
      }
    },
    healthChecks: {
      verbatim: true,
      "/healthz": async function () {
        await db.$executeRaw`SELECT 1;`;
        const [hasuraRes, hasuraVersionRes] = await Promise.all([
          axios.get(`${process.env.HASURA_ENDPOINT}/healthz`),
          axios.get(`${process.env.HASURA_ENDPOINT}/v1/version`),
        ]);
        return {
          version: process.env.SENTRY_RELEASE || "dev",
          db: true,
          hasura: {
            status: hasuraRes.data,
            ...hasuraVersionRes.data,
          },
        };
      },
    },
  });
}
