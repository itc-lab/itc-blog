import React from 'react'
import usePageView from '../hooks/usePageView'
import '../styles/globals.css'

import { DefaultSeo } from 'next-seo'

import SEO from '../next-seo.config'

import '../styles/toc/styles.scss';
import '../styles/toc/tocbot.scss';

import 'react-static-tweets/styles.css'

export default function MyApp({
  Component,
  pageProps
}: any) {
  usePageView();
  return (
    <>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </>
  )
}
