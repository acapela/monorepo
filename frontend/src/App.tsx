import React from "react";
import { createGlobalStyle } from "styled-components";

import Error404 from "@aca/frontend/src/pages/404";
import AppDownload from "@aca/frontend/src/pages/app/download";
import AppLogin from "@aca/frontend/src/pages/app/login";
import AuthError from "@aca/frontend/src/pages/auth/error";
import AuthSignIn from "@aca/frontend/src/pages/auth/sign-in";
import AuthSuccess from "@aca/frontend/src/pages/auth/success";
import Index from "@aca/frontend/src/pages/index";
import Login from "@aca/frontend/src/pages/login";
import Logout from "@aca/frontend/src/pages/logout";
import ObscureErrorTestPage from "@aca/frontend/src/pages/obscure-error-test-page";
import { Router, allRouteNames } from "@aca/frontend/src/router";
import { PromiseUIRenderer } from "@aca/ui/createPromiseUI";
import { TooltipsRenderer } from "@aca/ui/popovers/TooltipsRenderer";
import { globalStyles } from "@aca/ui/styles/global";
import { AppThemeProvider } from "@aca/ui/theme";

import AssetsRecorder from "./pages/recorder";

const routeToComponent = {
  root: Index,
  login: Login,
  logout: Logout,
  appDownload: AppDownload,
  appLogin: AppLogin,
  errorTestPage: ObscureErrorTestPage,
  authSignIn: AuthSignIn,
  authError: AuthError,
  authSuccess: AuthSuccess,
  recorder: AssetsRecorder,
};

export const BuiltInStyles = createGlobalStyle`
  ${globalStyles}
`;

export const App = () => {
  const route = Router.useRoute(allRouteNames);

  let Component = Error404;
  if (route) Component = routeToComponent[route.name];

  return (
    <>
      <AppThemeProvider>
        <BuiltInStyles />
        <PromiseUIRenderer />
        <TooltipsRenderer />
        <Component />
      </AppThemeProvider>
    </>
  );
};
