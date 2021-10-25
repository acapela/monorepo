import "focus-visible";

// Polyfill for :focus-visible pseudo-selector.
import * as Sentry from "@sentry/react";
import { AnimateSharedLayout, MotionConfig } from "framer-motion";
import { NextPageContext } from "next";
import { Session } from "next-auth";
import { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { createGlobalStyle } from "styled-components";

import { AnalyticsManager } from "~frontend/analytics/AnalyticsProvider";
import { ApolloClientProvider as ApolloProvider } from "~frontend/apollo/client";
import { RequiredSessionProvider } from "~frontend/auth/RequiredSessionProvider";
import { getUserFromRequest } from "~frontend/authentication/request";
import { ClientDbProvider } from "~frontend/clientdb";
import initializeUserbackPlugin from "~frontend/scripts/userback";
import { global } from "~frontend/styles/global";
import { CurrentTeamProvider } from "~frontend/team/CurrentTeam";
import { renderWithPageLayout } from "~frontend/utils/pageLayout";
import { ErrorView } from "~frontend/views/ErrorView";
import { useConst } from "~shared/hooks/useConst";
import { POP_ANIMATION_CONFIG } from "~ui/animations";
import { PromiseUIRenderer } from "~ui/createPromiseUI";
import { TooltipsRenderer } from "~ui/popovers/TooltipsRenderer";
import { AppThemeProvider, theme } from "~ui/theme";
import { ToastsRenderer } from "~ui/toasts/ToastsRenderer";

const stage = process.env.STAGE || process.env.NEXT_PUBLIC_STAGE;
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: stage,
    // we can safely ignore this error: https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
    ignoreErrors: ["ResizeObserver loop limit exceeded"],
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  });
} else {
  console.info("Sentry is disabled");
}

interface AddedProps {
  session: Session | null;
  hasuraWebsocketEndpoint: string | null;
}

const BuiltInStyles = createGlobalStyle`
  ${global}
`;

export default function App({
  Component,
  pageProps,
  session,
  hasuraWebsocketEndpoint,
}: AppProps & AddedProps): JSX.Element {
  // Load Userback integration after initial app render
  useEffect(() => {
    initializeUserbackPlugin();
  }, []);

  // We need to remember this from first render, as getInitialProps is not run on client side navigation
  const hasuraWebsocketEndpointFromServer = useConst(() => hasuraWebsocketEndpoint);
  const sessionFromServer = useConst(() => session);

  return (
    <Sentry.ErrorBoundary
      fallback={<ErrorView title="It's not you, it's us!" description="An error occurred. We will look into it." />}
    >
      <BuiltInStyles />
      <CommonMetadata />
      <RequiredSessionProvider session={sessionFromServer}>
        <AnimateSharedLayout type="crossfade">
          <MotionConfig transition={{ ...POP_ANIMATION_CONFIG }}>
            <ApolloProvider websocketEndpoint={hasuraWebsocketEndpointFromServer}>
              <AppThemeProvider theme={theme}>
                <CurrentTeamProvider>
                  <ClientDbProvider>
                    <AnalyticsManager />
                    <PromiseUIRenderer />
                    <TooltipsRenderer />
                    <ToastsRenderer />
                    {renderWithPageLayout(Component, pageProps)}
                  </ClientDbProvider>
                </CurrentTeamProvider>
              </AppThemeProvider>
            </ApolloProvider>
          </MotionConfig>
        </AnimateSharedLayout>
      </RequiredSessionProvider>
    </Sentry.ErrorBoundary>
  );
}

const CommonMetadata = () => {
  return (
    <Head>
      <title>Acapela</title>
      <link rel="icon" href="/icon.png" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
    </Head>
  );
};

/*
  Plucks ?jwt=TTT from a URL and creates a redirect with it as a session token cookie and the query bit removed
 */
function tryRedirectWithCookie({ req, res }: NextPageContext) {
  if (!req || !res) {
    return false;
  }

  const urlPath = req?.url;
  if (!urlPath) {
    return false;
  }
  const searchIndex = urlPath.indexOf("?");
  const searchParams = new URLSearchParams(urlPath.slice(searchIndex));
  const jwt = searchParams.get("jwt");
  if (!jwt) {
    return false;
  }

  searchParams.delete("jwt");
  res
    .writeHead(302, {
      Location: `${urlPath.slice(0, searchIndex)}?${searchParams}`,
      "Set-Cookie": `next-auth.session-token=${jwt};`,
    })
    .end();

  return true;
}

/**
 * In order to have current user data available on the first render, let's parse cookie content
 * on server side.
 *
 * We do it in a sync way for performance. It means we don't verify token signature and we 'trust'
 * the content of the token.
 *
 * Signature will be validated on each request, anyway and also after page is loaded, next-auth
 * will make actual call to api to get 'fresh version' of current user and in case it changed,
 * session provider value will update.
 */
App.getInitialProps = async (context: AppContext) => {
  if (tryRedirectWithCookie(context.ctx)) {
    return;
  }

  return {
    session: await getUserFromRequest(context.ctx.req),
    hasuraWebsocketEndpoint: process.env.HASURA_WEBSOCKET_ENDPOINT,
  };
};
