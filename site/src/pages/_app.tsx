import type { AppPropsWithLayout } from '@/@types/next'

import { globalStyles } from '@/stitches.config'
import { ThemeProvider } from '@/components/theme-context'
import { SessionProvider } from 'next-auth/react'

import { withTRPC } from '@trpc/next'
import type { AppRouter } from './api/trpc/[trpc]'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { categories } from '@/lib/config'

import '@/styles/carousel.css'
import { NextComponentType } from 'next'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

function App({ Component, pageProps }: AppPropsWithLayout) {
  globalStyles()

  const getLayout = Component.getLayout ?? ((page) => page)
  // more about layout in here https://nextjs.org/docs/basic-features/layouts

  return getLayout(
    <ThemeProvider>
      <SessionProvider session={pageProps.session}>
        {/* <Header categories={categories} /> */}

        <Component {...pageProps} />

        <Footer />
      </SessionProvider>
    </ThemeProvider>
  )
}

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return ''
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      url: `${getBaseUrl()}/api/trpc`,
      /**
       * @link https://react-query-v3.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(App as NextComponentType)
