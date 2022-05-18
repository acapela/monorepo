process.env.APP = "hooks";

import "@aca/config/dotenv";

import * as Sentry from "@sentry/node";
import Koa from "koa";

import { logger } from "@aca/shared/logger";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.STAGE,
    maxValueLength: 10000,
  });
}

async function start(): Promise<void> {
  const app = new Koa();

  app.use(async (ctx, next) => {
    ctx.body = {};
    await next();
  });

  app.listen(process.env.HOOKS_PORT, () => {
    logger.info(`Server is listening on port ${process.env.HOOKS_PORT}`);
  });
}

start();
