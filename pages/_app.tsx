import React, { FC } from 'react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import usePageView from '../hooks/usePageView';
import '../styles/globals.css';

import { DefaultSeo } from 'next-seo';

import SEO from '../next-seo.config';

import '../styles/toc/styles.scss';
import '../styles/toc/tocbot.scss';

import '../styles/react-static-tweets/styles.css';

const queryClient = new QueryClient();

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  usePageView();
  return (
    <>
      <DefaultSeo {...SEO} />
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
