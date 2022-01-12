import { Page } from "@playwright/test";

import { domain } from "@aca/e2e/helper/constants";

export const isSentryStoreURL = (url: URL) => url.pathname.endsWith("/sentry-tunnel");

export async function addSessionCookie(page: Page, value: string) {
  await page.context().addCookies([{ name: "next-auth.session-token", value, domain, path: "/", sameSite: "Lax" }]);
}
