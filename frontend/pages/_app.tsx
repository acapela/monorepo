// Polyfill for :focus-visible pseudo-selector.
import "focus-visible";
import { Provider as SessionProvider, Session } from "next-auth/client";
import { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { Provider as ApolloProvider } from "../src/apollo";
import { parseJWTWithoutValidation } from "../src/authentication/jwt";
import "../styles/tailwind.css";

interface AddedProps {
  session: unknown;
}

export default function App({ Component, pageProps, session }: AppProps & AddedProps): JSX.Element {
  // If you don't want the layout component of your page to unmount between page changes,
  // implement a getLayout function as a property of your components.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLayout = (Component as any).getLayout || ((page) => page);

  return (
    <>
      <CommonMetadata />
      <SessionProvider session={session as Session | null}>
        <ApolloProvider>{getLayout(<Component {...pageProps} />)}</ApolloProvider>
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
 * In order to have current user data avaliable on the first render, let's parse cookie content
 * on server side.
 *
 * We do it in a sync way for performance. It means we don't verify token signature and we 'trust'
 * the content of the token.
 *
 * Signature will be validated on each request, anyway and also after page is loaded, next-auth
 * will make actual call to api to get 'fresh version' of current user and in case it changed,
 * session provider value will update.
 */
App.getInitialProps = ({ ctx }: AppContext) => {
  const sessionToken = (ctx.req?.["cookies"]?.["next-auth.session-token"] as string) ?? null;

  if (!sessionToken) {
    return {
      session: null,
    };
  }

  const userTokenContent = parseJWTWithoutValidation(sessionToken);

  return {
    session: userTokenContent,
  };
};
