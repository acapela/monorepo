import "focus-visible";

// Polyfill for :focus-visible pseudo-selector.
import * as Sentry from "@sentry/react";
import { MotionConfig } from "framer-motion";
import { NextPageContext } from "next";
import { Session } from "next-auth";
import { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { createGlobalStyle } from "styled-components";

import { ApolloClientProvider as ApolloProvider } from "~frontend/apollo/client";
import { RequiredSessionProvider } from "~frontend/auth/RequiredSessionProvider";
import { getUserFromRequest } from "~frontend/authentication/request";
import { ClientDbProvider } from "~frontend/clientdb";
import { sentryFallbackErrorRenderer } from "~frontend/errors/sentryFallbackErrorRenderer";
import initializeUserbackPlugin from "~frontend/scripts/userback";
import { global } from "~frontend/styles/global";
import { CurrentTeamProvider } from "~frontend/team/CurrentTeam";
import { useConst } from "~shared/hooks/useConst";
import { POP_ANIMATION_CONFIG } from "~ui/animations";
import { PromiseUIRenderer } from "~ui/createPromiseUI";
import { TooltipsRenderer } from "~ui/popovers/TooltipsRenderer";
import { AppThemeProvider, theme } from "~ui/theme";
import { ToastsRenderer } from "~ui/toasts/ToastsRenderer";

export interface AppConfig {
  session: Session | null;
  hasuraWebsocketEndpoint: string | null;
  stage: string | undefined;
  version: string | undefined;
  buildDate: string | undefined;
  userbackAccessToken: string | undefined;
  sentryDSN: string | undefined;
}

function initSentry(appConfig: AppConfig) {
  if (!appConfig.sentryDSN) console.info("Sentry is disabled");

  Sentry.init({
    dsn: appConfig.sentryDSN,
    environment: appConfig.stage,
    // we can safely ignore this error: https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
    ignoreErrors: ["ResizeObserver loop limit exceeded"],
    release: appConfig.version,
    tunnel: "/sentry-tunnel",
  });
}

const BuiltInStyles = createGlobalStyle`
  ${global}
`;

export default function App({
  Component,
  pageProps,
  session,
  hasuraWebsocketEndpoint,
  stage,
  version,
  buildDate,
  userbackAccessToken,
  sentryDSN,
}: AppProps & AppConfig): JSX.Element {
  // We need to remember this from first render, as getInitialProps is not run on client side navigation
  const appConfig = useConst(
    () =>
      ({
        session,
        hasuraWebsocketEndpoint,
        stage,
        version,
        buildDate,
        userbackAccessToken,
        sentryDSN,
      } as AppConfig)
  );

  // Load Userback and Sentry integration after initial app render
  useEffect(() => {
    initializeUserbackPlugin(appConfig.userbackAccessToken);
    initSentry(appConfig);
  }, [appConfig]);

  const { route } = useRouter();
  const isNextAuthErrorPage = route === "/auth/error";

  if (isNextAuthErrorPage) {
    return (
      <>
        <BuiltInStyles />
        <CommonMetadata />
        <RequiredSessionProvider dontRequireSession={isNextAuthErrorPage} session={appConfig.session}>
          <AppThemeProvider theme={theme}>
            <PromiseUIRenderer />
            <TooltipsRenderer />
            <ToastsRenderer />
            <Component {...{ appConfig, ...pageProps }} />
          </AppThemeProvider>
        </RequiredSessionProvider>
      </>
    );
  }

  return (
    <>
      <BuiltInStyles />
      <CommonMetadata />
      <Sentry.ErrorBoundary fallback={sentryFallbackErrorRenderer}>
        <RequiredSessionProvider session={appConfig.session}>
          <MotionConfig transition={{ ...POP_ANIMATION_CONFIG }}>
            <ApolloProvider websocketEndpoint={appConfig.hasuraWebsocketEndpoint}>
              <AppThemeProvider theme={theme}>
                <CurrentTeamProvider>
                  <ClientDbProvider>
                    <PromiseUIRenderer />
                    <TooltipsRenderer />
                    <ToastsRenderer />
                    <Component {...{ appConfig, ...pageProps }} />
                  </ClientDbProvider>
                </CurrentTeamProvider>
              </AppThemeProvider>
            </ApolloProvider>
          </MotionConfig>
        </RequiredSessionProvider>
      </Sentry.ErrorBoundary>
    </>
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

  const session = await getUserFromRequest(context.ctx.req);

  // this is how we populate environment configurations to the frontend
  return {
    session,
    hasuraWebsocketEndpoint: process.env.HASURA_WEBSOCKET_ENDPOINT,
    stage: process.env.STAGE,
    version: process.env.SENTRY_RELEASE || "dev",
    buildDate: process.env.BUILD_DATE || "unknown",
    userbackAccessToken: process.env.USERBACK_ACCESS_TOKEN,
    sentryDSN: process.env.SENTRY_DSN,
    segmentAPIKey: process.env.SEGMENT_API_KEY,
  } as AppConfig;
};
