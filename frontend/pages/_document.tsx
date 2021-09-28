import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

type Props = DocumentInitialProps;

export default class AppDocument extends Document<Props> {
  /**
   * This AppDocument modification allows:
   * - server-side capturing of styled-components so initial render has proper css
   * already injected into page.
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

    const documentProps = await Document.getInitialProps(ctx);

    const styledComponentsStyles = sheet.getStyleElement();

    sheet.seal();

    return {
      ...documentProps,
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
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
