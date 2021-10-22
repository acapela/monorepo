export const isSentryStoreURL = (url: URL) => url.host.endsWith("sentry.io") && url.pathname.includes("/store");
