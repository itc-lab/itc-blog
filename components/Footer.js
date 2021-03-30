import React from 'react';

export const Footer = ({title}) => {
  const date = new Date();
  const footer_year = date.getFullYear();
  return (
    <footer className="py-2 mb-1 bg-white">
      <div className="text-xs md:text-sm text-gray-700 text-center">
        ©{footer_year} ITC Engineering Blog / <span className="hidden iphone:inline">produced by </span><a className="text-gray-800 hover:text-pink-800" href="https://itccorporation.jp/">株式会社アイティーシー</a>
      </div>
    </footer>
  );
};
