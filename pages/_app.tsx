import { useState } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import usePageView from '../hooks/usePageView';
import '../styles/globals.css';

import { generateDefaultSeo } from 'next-seo/pages';

import SEO from '../next-seo.config';

import '../styles/toc/styles.scss';
import '../styles/toc/tocbot.scss';

const MyApp = ({ Component, pageProps }: AppProps) => {
  usePageView();
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <Head>{generateDefaultSeo(SEO)}</Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
