import React from 'react';
import Head from 'next/head';

export const Header = ({
  title
}: any) => {
  return (
    <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#2563eb" />
    </Head>
  );
};
