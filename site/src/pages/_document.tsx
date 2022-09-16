import Document, { Head, Html, Main, NextScript } from 'next/document'
import { getCssText } from '@/stitches.config'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@300;500;600;800&display=swap"
          />

          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
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
