import React, { FC, ReactNode } from 'react';
import { Header } from './Header';
import { SEO } from './SEO';
import { Footer } from './Footer';

interface Topic {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  topics: string;
  logo: string;
  needs_title: boolean;
}
interface SEO_DATA {
  publishedAt: string;
  updatedAt: string;
  topics: Topic[];
  seo_title?: string;
  seo_description?: string;
  seo_type?: string;
  seo_authors?: string;
  seo_images_url?: string;
  seo_images_width?: number;
  seo_images_height?: number;
  seo_images_alt?: string;
}
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
