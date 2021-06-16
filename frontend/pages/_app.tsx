// Polyfill for :focus-visible pseudo-selector.
import "focus-visible";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { Session } from "next-auth";
import { getSession, Provider as SessionProvider } from "next-auth/client";
import { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { createGlobalStyle } from "styled-components";
import { ApolloClientProvider as ApolloProvider, readTokenFromRequest } from "~frontend/apollo";
import { getUserFromRequest } from "~frontend/authentication/request";
import { global } from "~frontend/styles/global";
import { renderWithPageLayout } from "~frontend/utils/pageLayout";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { PromiseUIRenderer } from "~ui/createPromiseUI";
import { useEffect } from "react";
import { POP_ANIMATION_CONFIG } from "~ui/animations";
import { TooltipsRenderer } from "~ui/popovers/TooltipsRenderer";
import { ToastsRenderer } from "~ui/toasts/ToastsRenderer";

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
    window.Userback = window.Userback || {};
    window.Userback.access_token = "29970|44040|bV1489q26af7ZoRzAgnJrfPsV";
    (function (d) {
      const s = d.createElement("script");
      s.async = true;
      s.src = "https://static.userback.io/widget/v1.js";
      (d.head || d.body).appendChild(s);
    })(document);
  }, []);

  return (
    <>
      <BuiltInStyles />
      <CommonMetadata />
      <SessionProvider session={session}>
        <MotionConfig transition={{ ...POP_ANIMATION_CONFIG }}>
          <ApolloProvider ssrAuthToken={authToken} websocketEndpoint={hasuraWebsocketEndpoint}>
            <PromiseUIRenderer />
            <TooltipsRenderer />
            <ToastsRenderer />
            <AnimatePresence>
              <PresenceAnimator presenceStyles={{ opacity: [0, 1] }}>
                {renderWithPageLayout(Component, pageProps)}
              </PresenceAnimator>
            </AnimatePresence>
          </ApolloProvider>
        </MotionConfig>
      </SessionProvider>
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
