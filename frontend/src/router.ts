import { createRouter } from "@swan-io/chicane";

import { typedKeys } from "@aca/shared/object";

const routes = {
  root: "/",
  login: "/login?:redirect",
  logout: "/logout",
  appDownload: "/app/download",
  appLogin: "/app/login",
  errorTestPage: "/obscure-error-test-page",
  authSignIn: "/auth/sign-in",
  authError: "/auth/error",
  authSuccess: "/auth/success",
  recorder: "/recorder",
  stripeCheckedOut: "/stripe/checked-out",
} as const;

export const allRouteNames = typedKeys(routes);
export const Router = createRouter(routes);
