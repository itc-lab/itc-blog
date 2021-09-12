import React, { FC, ReactNode } from 'react';
import { Header } from './Header';
import { SEO } from './SEO';
import { Footer } from './Footer';
import { SEO_DATA } from '@/types';

interface Props {
  children: ReactNode;
  title: string;
  seo_data: SEO_DATA;
  seo_url: string;
}

export const Layout: FC<Props> = ({ children, title, seo_data, seo_url }) => {
  return (
    <>
      <Header title={title}></Header>
      <SEO data={seo_data} title={title} url={seo_url} />
      <div className="border-box block float-none leading-7 static z-auto">
        {children}
        <Footer />
      </div>
    </>
  );
};
