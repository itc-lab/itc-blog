import React, { FC } from 'react';
import { AppProps } from 'next/app';
import usePageView from '../hooks/usePageView';
import '../styles/globals.css';

import { DefaultSeo } from 'next-seo';

import SEO from '../next-seo.config';

import '../styles/toc/styles.scss';
import '../styles/toc/tocbot.scss';

import 'react-static-tweets/styles.css';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  usePageView();
  return (
    <>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
