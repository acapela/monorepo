import * as Sentry from "@sentry/nextjs";

if (["staging", "production"].includes(process.env.STAGE)) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

export { Sentry };
