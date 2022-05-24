import { createRouter } from "@swan-io/chicane";

import { typedKeys } from "@aca/shared/object";
import { routes as sharedRoutes } from "@aca/shared/routes";

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
  stripeCheckedOut: sharedRoutes.stripeCheckedOut,
} as const;

export const allRouteNames = typedKeys(routes);
export const Router = createRouter(routes);
