process.env.APP = "hooks";

import "@aca/config/dotenv";

import { createServer } from "http";

import { createTerminus } from "@godaddy/terminus";
import Router from "@koa/router";
import * as Sentry from "@sentry/node";
import Koa from "koa";
import bodyParser from "koa-bodyparser";

import { APIError } from "@aca/hooks/src/errors";
import { publishWebhook } from "@aca/hooks/src/pubsub";
import { logger } from "@aca/shared/logger";
import { wait } from "@aca/shared/time";

import { services } from "./services";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.STAGE,
    maxValueLength: 10000,
  });
}

const app = new Koa();

// error handler
app.use(async (ctx, next) => {
  try {
    await next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message || "internal server error" };
    logger.error(err);
    Sentry.withScope((scope) => {
      scope.addEventProcessor((event) => Sentry.Handlers.parseRequest(event, ctx.request));
      Sentry.captureException(err);
    });
  }
});

// logger middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger.info(`[${ctx.method}] ${ctx.url} - ${ctx.status} (${ms}ms)`);
});

// allow only json payloads
app.use(bodyParser({ enableTypes: ["json"], jsonLimit: "5mb" }));

// setup router
const router = new Router();
app.use(router.routes());
app.use(router.allowedMethods());

router.post("/:service/:id?", async (ctx) => {
  const service = services.get(ctx.params.service);
  if (!service) throw new APIError(404, "service not found");

  let body = ctx.request.body;
  if (service.verifyBody) await service.verifyBody(ctx.request.rawBody, body, ctx.request.headers);

  if (service.processBody) body = await service.processBody(body);
  if (!body) throw new APIError(400, "webhook was ignored");

  await publishWebhook(service.name, body, ctx.params);
  ctx.body = "ok";
});

const server = createServer(app.callback());

// graceful shutdown
createTerminus(server, {
  beforeShutdown: () => wait(5000),
  healthChecks: {
    verbatim: true,
    "/healthz": async () => ({ version: process.env.SENTRY_RELEASE || "dev" }),
  },
});

const port = process.env.HOOKS_PORT || 1338;
server.listen(port, () => {
  logger.info(`server is listening on port ${port}`);
});
