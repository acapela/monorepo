import { createRouter } from "react-chicane";

import { typedKeys } from "@aca/shared/object";

const routes = {
  root: "/",
  login: "/login",
  logout: "/logout",
  appDownload: "/app/download",
  appLogin: "/app/login",
  errorTestPage: "/obscure-error-test-page",
  authSignIn: "/auth/sign-in",
  authError: "/auth/error",
  authSuccess: "/auth/success",
} as const;

export const allRouteNames = typedKeys(routes);
export const Router = createRouter(routes);
