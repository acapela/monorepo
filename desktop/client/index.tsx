import { MotionConfig } from "framer-motion";
import jwt from "jsonwebtoken";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";

import { ApolloClientProvider } from "@aca/desktop/apolloClient";
import { authTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { ClientDbProvider } from "@aca/desktop/clientdb/ClientDbProvider";
import { global } from "@aca/frontend/styles/global";
import { POP_ANIMATION_CONFIG } from "@aca/ui/animations";
import { PromiseUIRenderer } from "@aca/ui/createPromiseUI";
import { TooltipsRenderer } from "@aca/ui/popovers/TooltipsRenderer";
import { AppThemeProvider, theme } from "@aca/ui/theme";
import { ToastsRenderer } from "@aca/ui/toasts/ToastsRenderer";

import { CurrentTeamProvider } from "../auth/CurrentTeam";
import { GlobalDesktopStyles } from "../styles/GlobalDesktopStyles";
import { RootView } from "../views/RootView";
import { SidebarLayout } from "../views/sidebar";

const rootElement = document.getElementById("root");

const BuiltInStyles = createGlobalStyle`
  ${global}
`;

function BridgeSessionProvider({ children }: { children: React.ReactNode }) {
  const session = authTokenBridgeValue.use();
  if (!session) {
    return null;
  }
  return (
    <SessionProvider baseUrl={"http://localhost:3000"} session={jwt.decode(session) as never}>
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
                <SidebarLayout>
                  <RootView />
                </SidebarLayout>
              </ClientDbProvider>
            </CurrentTeamProvider>
          </AppThemeProvider>
        </ApolloClientProvider>
      </BridgeSessionProvider>
    </MotionConfig>
  </>,
  rootElement
);
