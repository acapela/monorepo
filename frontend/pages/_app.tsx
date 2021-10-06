// Polyfill for :focus-visible pseudo-selector.
import "focus-visible";

import * as Sentry from "@sentry/nextjs";
import { ErrorBoundary } from "@sentry/nextjs";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { Session } from "next-auth";
import { Provider as SessionProvider, getSession } from "next-auth/client";
import { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { ThemeProvider } from "styled-components";

import { AnalyticsManager } from "~frontend/analytics/AnalyticsProvider";
import { ApolloClientProvider as ApolloProvider, readTokenFromRequest } from "~frontend/apollo/client";
import { getUserFromRequest } from "~frontend/authentication/request";
import { ClientDbProvider } from "~frontend/clientdb";
import initializeUserbackPlugin from "~frontend/scripts/userback";
import { global } from "~frontend/styles/global";
import { CurrentTeamIdProvider } from "~frontend/team/CurrentTeamIdProvider";
import { renderWithPageLayout } from "~frontend/utils/pageLayout";
import { POP_ANIMATION_CONFIG } from "~ui/animations";
import { PromiseUIRenderer } from "~ui/createPromiseUI";
import { TooltipsRenderer } from "~ui/popovers/TooltipsRenderer";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { getTheme } from "~ui/theme";
import { ToastsRenderer } from "~ui/toasts/ToastsRenderer";

const stage = process.env.STAGE || process.env.NEXT_PUBLIC_STAGE;
if (["staging", "production"].includes(stage)) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: stage,
    // we can safely ignore this error: https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
    ignoreErrors: ["ResizeObserver loop limit exceeded"],
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  });
} else {
  console.info("Sentry is disabled");
}

interface AddedProps {
  session: Session;
  authToken: string | null;
  hasuraWebsocketEndpoint: string | null;
}

const BuiltInStyles = createGlobalStyle`
  ${global}
`;

export default function App({
  Component,
  pageProps,
  session,
  authToken,
  hasuraWebsocketEndpoint,
}: AppProps & AddedProps): JSX.Element {
  // Load Userback integration after initial app render
  useEffect(() => {
    initializeUserbackPlugin();
  }, []);

  return (
    <ErrorBoundary
      fallback={
        <UIErrorBox>
          <h1>It's not you, it's us!</h1>
          <p>An error occurred. We will look into it.</p>
        </UIErrorBox>
      }
    >
      <BuiltInStyles />
      <CommonMetadata />
      <SessionProvider session={session}>
        <MotionConfig transition={{ ...POP_ANIMATION_CONFIG }}>
          <ApolloProvider ssrAuthToken={authToken} websocketEndpoint={hasuraWebsocketEndpoint}>
            <ThemeProvider theme={getTheme("default")}>
              <CurrentTeamIdProvider>
                <ClientDbProvider>
                  <AnalyticsManager />
                  <PromiseUIRenderer />
                  <TooltipsRenderer />
                  <ToastsRenderer />
                  <AnimatePresence>
                    <PresenceAnimator presenceStyles={{ opacity: [0, 1] }}>
                      {renderWithPageLayout(Component, pageProps)}
                    </PresenceAnimator>
                  </AnimatePresence>
                </ClientDbProvider>
              </CurrentTeamIdProvider>
            </ThemeProvider>
          </ApolloProvider>
        </MotionConfig>
      </SessionProvider>
    </ErrorBoundary>
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
  async function getSessionForEnv() {
    // In development, we might wipe out db so we cant trust 'jwt'
    if (process.env.NODE_ENV === "development") {
      return await getSession({ req: context.ctx.req });
    }

    // In production, simply parse the token if it's still valid
    return getUserFromRequest(context.ctx.req);
  }

  // We're pre-fetching all the queries on server side before actual rendering happens.
  // During server-side rendering, we will use apollo client with fixed token value
  const authToken = readTokenFromRequest(context.ctx.req);

  return {
    session: await getSessionForEnv(),
    authToken,
    hasuraWebsocketEndpoint: process.env.HASURA_WEBSOCKET_ENDPOINT,
  };
};

const UIErrorBox = styled.div<{}>`
  position: absolute;
  top: 10%;
  left: 0;
  right: 0;
  margin: 0 auto;
  text-align: center;
`;
