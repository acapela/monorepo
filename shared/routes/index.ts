import { parameterizeRoutes } from "@aca/shared/routes/utils";

export const routes = parameterizeRoutes({
  home: "/",
  appDownload: "/app/download",
  logout: "/logout",
  login: "/login",
  finishLogInInApp: "/app/return-to-app",
  loginForDesktop: "/app/login",
} as const);
