import React, { FC } from 'react';
import Image from 'next/image';
import '../settings.d.ts';
import settings from '../settings.yml';

export const Footer: FC = () => {
  const date = new Date();
  const footer_year = date.getFullYear();
  return (
    <footer className="py-2 mb-1 bg-white">
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
              <Image
                src={settings.general.company_logo}
                layout="fill"
                objectFit="contain"
              />
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
