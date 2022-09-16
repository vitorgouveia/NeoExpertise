import type { AppProps } from 'next/app'
import type { NextPage } from 'next/types'
import type { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout<T = {}> = NextPage<T> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
