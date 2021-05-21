import React from 'react'
import usePageView from '../hooks/usePageView'
import '../styles/globals.css'

import { DefaultSeo } from 'next-seo'

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../next-seo.config' or its cor... Remove this comment to see the full error message
import SEO from '../next-seo.config'

import '../styles/toc/styles.scss';
import '../styles/toc/tocbot.scss';

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
