import React, { FC } from 'react';
import Head from 'next/head';

interface Props {
  title: string;
}

export const Header: FC<Props> = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="apple-touch-icon" href="/icon.png" />
      <meta name="theme-color" content="#2563eb" />
      {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_META_CODE && (
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_META_CODE}
        />
      )}
    </Head>
  );
};
