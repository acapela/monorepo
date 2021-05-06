// Polyfill for :focus-visible pseudo-selector.
import "@reach/dialog/styles.css";
import "focus-visible";
import { Session } from "next-auth";
import { Provider as SessionProvider } from "next-auth/client";
import { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { createGlobalStyle } from "styled-components";
import { Provider as ApolloProvider } from "~frontend/apollo";
import { getUserFromAppContext } from "~frontend/authentication/appContext";
import { global } from "~frontend/styles/global";
import { renderWithPageLayout } from "~frontend/utils/pageLayout";

interface AddedProps {
  session: Session;
}

const BuiltInStyles = createGlobalStyle`
  ${global}
`;

export default function App({ Component, pageProps, session }: AppProps & AddedProps): JSX.Element {
  return (
    <>
      <BuiltInStyles />
      <CommonMetadata />
      <SessionProvider session={session}>
        <ApolloProvider>{renderWithPageLayout(Component, pageProps)}</ApolloProvider>
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
      <link href="https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@300;400;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap"
        rel="stylesheet"
      />
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
App.getInitialProps = (context: AppContext) => {
  const session = getUserFromAppContext(context);

  return {
    session,
  };
};
