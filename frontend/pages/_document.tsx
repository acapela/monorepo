import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from "next/document";

import { ServerStyleSheet } from "styled-components";
import { getApolloClient, readTokenFromRequest } from "~frontend/apollo";
import { ApolloInitialState, prefetchRecordedQueries, startRecordingUsedQueries } from "~frontend/gql/utils/hydration";

type Props = DocumentInitialProps & {
  apolloInitialState?: unknown;
};

export default class AppDocument extends Document<Props> {
  /**
   * This AppDocument modification allows:
   * - server-side capturing of styled-components so initial render has proper css
   * already injected into page.
   *
   * - capturing and pre-fetching all used graphql queries
   */
  static async getInitialProps(ctx: DocumentContext) {
    const renderPage = ctx.renderPage;

    const sheet = new ServerStyleSheet();

    ctx.renderPage = async () => {
      return renderPage({
        enhanceApp: (App) => (props) => {
          const renderResult = sheet.collectStyles(<App {...props} />);

          return renderResult;
        },
      });
    };

    /**
     * In this part we'll try to pre-fetch all used graphql queries for current page.
     */

    // Hook new used queries recorder
    const [stopRecording, recordedQueries] = startRecordingUsedQueries();

    // Try to get graphql auth token and create authorized client
    const graphqlAuthToken = readTokenFromRequest(ctx.req);
    const apolloClient = getApolloClient({
      forcedAuthToken: graphqlAuthToken ?? undefined,
    });

    // Pre-fetch queries only if user is authorized
    if (graphqlAuthToken) {
      // ! We are 'wasting' one render of entire page here.
      // It is very likely it'll result in render that includes 'loading' states, but it allows us to capture all
      // graphql queries used in initial render.
      await ctx.renderPage();

      // We can now stop recording as we have all queries captured
      stopRecording();

      // now, pre-fetch all recorded queries and populate the cache into apollo client.
      // This client will be used for actual render and will allow us to 'skip' loading states in server output render.
      await prefetchRecordedQueries(apolloClient, recordedQueries);
    }

    // Now back to default next.js flow
    const documentProps = await Document.getInitialProps(ctx);

    const styledComponentsStyles = sheet.getStyleElement();

    sheet.seal();

    return {
      ...documentProps,
      // Pass apollo cache content as prop so it'll be rendered as json and capture by frontend side when initializing
      // apollo client there.
      apolloInitialState: apolloClient.extract(),
      styles: (
        <>
          {documentProps.styles}
          {styledComponentsStyles}
        </>
      ),
    };
  }

  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <ApolloInitialState state={this.props.apolloInitialState} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
