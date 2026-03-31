import { ReactNode } from 'react';
import { Header } from './Header';
import { SEO } from './SEO';
import { Footer } from './Footer';
import { SEO_DATA } from '@/types';
import { Tooltip } from 'react-tooltip';

interface Props {
  children: ReactNode;
  title: string;
  seo_data: SEO_DATA;
  seo_url: string;
}

export const Layout = ({ children, title, seo_data, seo_url }: Props) => {
  return (
    <>
      <Header title={title}></Header>
      <SEO data={seo_data} title={title} url={seo_url} />
      <div className="min-h-screen display:block relative pb-12 border-box bg-indigo-50">
        <div className="border-box block float-none leading-7 static z-auto">
          {children}
        </div>
        <Tooltip id="global-tooltip" place="right" variant="dark" float />
        <Footer />
      </div>
    </>
  );
};
