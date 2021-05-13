import { NextApiRequest } from "next";
import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { getApolloClient, readTokenFromRequest } from "~frontend/apollo";
import { ApolloInitialState, startRecordingUsedQueries } from "~frontend/gql/hydration";

type Props = DocumentInitialProps & {
  apolloInitialState?: unknown;
};

export default class AppDocument extends Document<Props> {
  /**
   * This AppDocument modification allows server-side capturing of styled-components so initial render has proper css
   * already injected into page.
   */
  static async getInitialProps(ctx: DocumentContext): Promise<Props> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    const request = ctx.req as NextApiRequest;

    // we will record all graphql queries used during render and pre-populate apollo cache on server-side
    const [stopRecordingQueriesUseage, queriesUsedDuringRender] = startRecordingUsedQueries();

    let resultProps: Props;

    try {
      ctx.renderPage = () => {
        return originalRenderPage({
          enhanceApp: (App) => (props) => {
            const renderResult = sheet.collectStyles(<App {...props} />);

            return renderResult;
          },
        });
      };

      const initialProps = await Document.getInitialProps(ctx);

      resultProps = {
        ...initialProps,

        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      stopRecordingQueriesUseage();
      sheet.seal();
    }

    // Now, having queries recorded - let's try to pre-fetch them and populate the cache
    try {
      const graphqlAuthToken = readTokenFromRequest(request);

      // Do so only if user is authorized
      if (graphqlAuthToken) {
        // Get user-authorized client
        const client = getApolloClient(graphqlAuthToken);

        // For each used query - fetch it using the client
        await Promise.all(
          queriesUsedDuringRender.map(async (query) => {
            await client.query({
              query: query.query,
              variables: query.variables,
            });
          })
        );

        // finally - pass apollo cache state from the client so it can be used in Document.render
        resultProps.apolloInitialState = client.extract();
      }
    } catch (error) {
      //
    }

    return resultProps;
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
