import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from "next/document";

import { ServerStyleSheet } from "styled-components";
import { getApolloClient, readTokenFromRequest } from "~frontend/apollo";
import { ApolloInitialState, prefetchRecordedQueries, startRecordingUsedQueries } from "~frontend/gql/hydration";

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
    const [stopRecording, recordedQuries] = startRecordingUsedQueries();

    // Try to get graphql auth token and create authorized client
    const graphqlAuthToken = readTokenFromRequest(ctx.req);
    const apolloClient = getApolloClient(graphqlAuthToken ?? undefined);

    // Prefetch queries only if user is authorized
    if (graphqlAuthToken) {
      // ! We are 'wasting' one render of entire page here.
      // It is very likely it'll resutl in render that includes 'loading' states, but it allows us to capture all
      // graphql queries used in initial render.
      await ctx.renderPage();

      // We can now stop recording as we have all queries captured
      stopRecording();

      // now, prefetch all recorded queries and populate the cache into apollo client.
      // This client will be used for actual render and will allow us to 'skip' loading states in server output render.
      await prefetchRecordedQueries(apolloClient, recordedQuries);
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

// /**
//  * This AppDocument modification allows server-side capturing of styled-components so initial render has proper css
//  * already injected into page.
//  */
// static async getInitialProps(ctx: DocumentContext): Promise<Props> {
//   const sheet = new ServerStyleSheet();
//   const originalRenderPage = ctx.renderPage;
//   const request = ctx.req as NextApiRequest;

//   // we will record all graphql queries used during render and pre-populate apollo cache on server-side
//   const [stopRecordingQueriesUseage, queriesUsedDuringRender] = startRecordingUsedQueries();

//   let resultProps: Props;

//   try {
//     ctx.renderPage = () => {
//       const renderResult = originalRenderPage({
//         enhanceApp: (App) => (props) => {
//           const renderResult = sheet.collectStyles(<App {...props} />);

//           return renderResult;
//         },
//       });

//       return renderResult;
//     };

//     const initialProps = await Document.getInitialProps(ctx);

//     resultProps = {
//       ...initialProps,

//       styles: (
//         <>
//           {initialProps.styles}
//           {sheet.getStyleElement()}
//         </>
//       ),
//     };
//   } finally {
//     stopRecordingQueriesUseage();
//     sheet.seal();
//   }

//   // Now, having queries recorded - let's try to pre-fetch them and populate the cache
//   try {
//     const graphqlAuthToken = readTokenFromRequest(request);

//     // Do so only if user is authorized
//     if (graphqlAuthToken) {
//       // Get user-authorized client
//       const client = getApolloClient(graphqlAuthToken);

//       // For each used query - fetch it using the client
//       await Promise.all(
//         queriesUsedDuringRender.map(async (query) => {
//           const { data } = await client.query({
//             query: query.query,
//             variables: query.variables,
//           });

//           client.writeQuery({ data, query: query.query, variables: query.variables });
//         })
//       );

//       // finally - pass apollo cache state from the client so it can be used in Document.render
//       resultProps.apolloInitialState = client.extract();
//     }
//   } catch (error) {
//     //
//   }

//   return resultProps;
// }
