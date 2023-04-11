import React, { FC } from 'react';
import { GitHubIcon } from '../components/GitHubIcon';
import { IBlog } from '@types';
import { Indexes } from './Indexes';

interface Props {
  ranking: IBlog[] | null;
}

export const ArticleFooter: FC<Props> = ({ ranking }) => {
  return (
    <div className="bg-white rounded-lg shadow pt-3 pb-8 md:pt-5 md:pb-10 lg:pt-10 lg:pb-10 text-sm md:text-base">
      <div className="text-center mb-2 md:mb-5">
        <span className="text-xl iphone:text-2xl font-bold">
          よく読まれている記事
        </span>
      </div>
      <div className="max-w-screen-lg m-auto px-2 iphone:px-6 md:px-10">
        <div className="overflow-hidden">
          {ranking ? <Indexes contents={ranking} /> : <></>}
        </div>
        <div className="ml-5 my-7 flex items-center">
          {/* GitHubアイコン */}
          <GitHubIcon />
        </div>
      </div>
    </div>
  );
};
