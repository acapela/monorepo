import * as Sentry from "@sentry/electron";
import { MotionConfig } from "framer-motion";
import jwt from "jsonwebtoken";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";

import { ApolloClientProvider } from "@aca/desktop/apolloClient";
import { CurrentTeamProvider } from "@aca/desktop/auth/CurrentTeam";
import { authTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { ClientDbProvider } from "@aca/desktop/clientdb/ClientDbProvider";
import { GlobalDesktopStyles } from "@aca/desktop/styles/GlobalDesktopStyles";
import { LoginView } from "@aca/desktop/views/LoginView";
import { RootView } from "@aca/desktop/views/RootView";
import { global } from "@aca/frontend/styles/global";
import { POP_ANIMATION_CONFIG } from "@aca/ui/animations";
import { PromiseUIRenderer } from "@aca/ui/createPromiseUI";
import { TooltipsRenderer } from "@aca/ui/popovers/TooltipsRenderer";
import { AppThemeProvider, theme } from "@aca/ui/theme";
import { ToastsRenderer } from "@aca/ui/toasts/ToastsRenderer";

import { ServiceWorkerConsolidation } from "./ServiceWorkerConsolidation";
import { SystemBar } from "./SystemBar";

if (!window.electronBridge.isDev) {
  Sentry.init({
    dsn: window.electronBridge.sentryDsn,
    release: window.electronBridge.version,
  });
}

const rootElement = document.getElementById("root");

const BuiltInStyles = createGlobalStyle`
  ${global}
`;

function BridgeSessionProvider({ children }: { children: React.ReactNode }) {
  const session = authTokenBridgeValue.use();

  if (!session) {
    return <LoginView />;
  }
  return (
    <SessionProvider session={jwt.decode(session) as never} refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}

render(
  <>
    <BuiltInStyles />
    <GlobalDesktopStyles />
    <MotionConfig transition={{ ...POP_ANIMATION_CONFIG }}>
      <BridgeSessionProvider>
        <ApolloClientProvider websocketEndpoint={"ws://localhost:3000"}>
          <AppThemeProvider theme={theme}>
            <CurrentTeamProvider>
              <ClientDbProvider>
                <PromiseUIRenderer />
                <TooltipsRenderer />
                <ToastsRenderer />
                <ServiceWorkerConsolidation />
                <SystemBar />
                <RootView />
              </ClientDbProvider>
            </CurrentTeamProvider>
          </AppThemeProvider>
        </ApolloClientProvider>
      </BridgeSessionProvider>
    </MotionConfig>
  </>,
  rootElement
);
