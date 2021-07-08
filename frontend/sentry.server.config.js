import * as Sentry from "@sentry/nextjs";

const stage = process.env.STAGE || process.env.NEXT_PUBLIC_STAGE;

if (["staging", "production"].includes(stage)) {
  Sentry.init({
    dsn: "https://017fa51dedd44c1185871241d2257ce6@o485543.ingest.sentry.io/5541047",
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
    environment: stage,
  });
}
