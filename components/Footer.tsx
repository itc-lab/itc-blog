import React from 'react';
import Image from 'next/image';
import '../settings.d.ts'
import settings from '../settings.yml';

export const Footer = ({
  title
}: any) => {
  const date = new Date();
  const footer_year = date.getFullYear();
  return (
    <footer className="py-2 mb-1 bg-white">
      <div className="flex items-center justify-center text-xs md:text-sm text-gray-700">
        <div>©{footer_year} {settings.general[0].name} / <span className="hidden iphone:inline">produced by </span></div>
        <div className="h-4">
          <div style={{ position: 'relative', width: '50px', height: '100%' }}>
          <a className="text-gray-800 hover:text-pink-800" href={settings.general[0].company_url}><Image src={settings.general[0].company_logo} layout='fill' objectFit="contain"/></a>
          </div>
        </div>
        <div><a className="text-gray-800 hover:text-pink-800" href={settings.general[0].company_url}>{settings.general[0].company_name}</a></div>
      </div>
    </footer>
  );
};
