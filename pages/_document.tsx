import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

class MyDocument extends Document {
  static async getInitialProps(ctx : any) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) =>
            sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (<>
          { initialProps.styles }
          { sheet.getStyleElement() }
        </>)
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <title>Lexi - Creative AGI</title>
          <meta name="description" content="Lexi is a highly-intellegent virtual coworker for creative and technical projects" />
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:title" content="Lexichat" />
          <meta
            property="og:image"
            content="/assets/lexichat-preview.png"
          />
          
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
