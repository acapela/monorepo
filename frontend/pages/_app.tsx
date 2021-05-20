// Polyfill for :focus-visible pseudo-selector.
import "@reach/dialog/styles.css";
import "focus-visible";
import { Session } from "next-auth";
import { getSession, Provider as SessionProvider } from "next-auth/client";
import { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { createGlobalStyle } from "styled-components";
import { ApolloClientProvider as ApolloProvider, readTokenFromRequest } from "~frontend/apollo";
import { getUserFromRequest } from "~frontend/authentication/request";
import { global } from "~frontend/styles/global";
import { renderWithPageLayout } from "~frontend/utils/pageLayout";

interface AddedProps {
  session: Session;
  authToken: string | null;
}

const BuiltInStyles = createGlobalStyle`
  ${global}
`;

export default function App({ Component, pageProps, session, authToken }: AppProps & AddedProps): JSX.Element {
  return (
    <>
      <BuiltInStyles />
      <CommonMetadata />
      <SessionProvider session={session}>
        <ApolloProvider ssrAuthToken={authToken}>{renderWithPageLayout(Component, pageProps)}</ApolloProvider>
      </SessionProvider>
    </>
  );
}

const CommonMetadata = () => {
  return (
    <Head>
      <title>Acapela</title>
      <link rel="icon" href="/favicon.ico" />
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
  };
};
