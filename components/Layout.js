import React from 'react';
import { Header } from './Header';
import { SEO } from './SEO';
import { Footer } from "./Footer";

export const Layout = ({children, title, seo_data, seo_url}) => {
  return (
    <>
      <Header title={title}></Header>
      <SEO data={seo_data} url={seo_url}/>
      <div className="border-box block float-none leading-7 static z-auto">
        {children}
        <Footer />
      </div>
    </>
  );
};
