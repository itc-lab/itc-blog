import React, { FC } from 'react';
import * as gtag from '../lib/gtag';

interface Props {
  postTitle: string;
  siteTitle: string;
}

const MobileShare: FC<Props> = ({ postTitle, siteTitle }) => {
  const handleOnClick = () => {
    gtag.event({
      action: 'Click',
      category: 'Share',
      label: 'Share',
      value: '0',
    });

    if (navigator.share) {
      navigator
        .share({
          title: `${postTitle} | ${siteTitle}`,
          text: `Check out ${postTitle} on ${siteTitle}`,
          url: document.location.href,
        })
        .then(() => {
          console.log('Successfully shared');
        })
        .catch((error) => {
          console.error('Something went wrong sharing the blog', error);
        });
    }
  };

  return (
    <button
      data-tip="シェア(共有)メニューを開く"
      onClick={() => handleOnClick()}>
      <ShareIcon />
    </button>
  );
};

const ShareIcon = () => (
  <svg
    className="w-7 h-7 text-gray-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 20"
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>
);

export default MobileShare;
