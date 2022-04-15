import React, { FC } from 'react';
import '../settings.d.ts';
import settings from '../settings.yml';

export const Footer: FC = () => {
  const date = new Date();
  const footer_year = date.getFullYear();
  return (
    <footer className="py-2 mb-1 bg-white w-full absolute bottom-0">
      <div className="flex items-center justify-center text-xs md:text-sm text-gray-700">
        <div>
          ©{footer_year} {settings.general.name} /{' '}
          <span className="hidden iphone:inline">produced by </span>
        </div>
        <div className="h-4">
          <a
            className="text-gray-800 hover:text-pink-800"
            href={settings.general.company_url}>
            <div
              style={{ position: 'relative', width: '50px', height: '100%' }}>
              <img
                loading="lazy"
                className="w-full h-full object-contain"
                style={{
                  display: 'block',
                }}
                alt="company logo"
                src={
                  (process.env.NEXT_PUBLIC_CDN_URL
                    ? process.env.NEXT_PUBLIC_CDN_URL.replace(/\/$/, '')
                    : '') +
                  '/' +
                  settings.general.company_logo.replace(/^\//, '')
                }></img>
            </div>
          </a>
        </div>
        <div>
          <a
            className="text-gray-800 hover:text-pink-800"
            href={settings.general.company_url}>
            {settings.general.company_name}
          </a>
        </div>
      </div>
    </footer>
  );
};
