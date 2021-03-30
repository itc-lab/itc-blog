import '../styles/globals.css'

import { DefaultSeo } from 'next-seo'

import SEO from '../next-seo.config'

import '../styles/toc/styles.scss';
import '../styles/toc/tocbot.scss';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </>
  )
}
