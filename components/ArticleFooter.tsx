import React, { FC } from 'react';
import { Tweet } from './Tweets';
import { GitHubIcon } from '../components/GitHubIcon';

interface Props {
  tweets: { id: string; ast: unknown }[];
}

export const ArticleFooter: FC<Props> = ({ tweets }) => {
  return (
    <div className="my-6 md:my-10 bg-white rounded-lg shadow py-10 text-base">
      <div className="max-w-screen-lg m-auto px-5 iphone:px-10">
        {tweets.map((tweet) => {
          return <Tweet key={tweet.id} id={tweet.id} ast={tweet.ast} />;
        })}

        <div className="ml-5 my-7 flex items-center">
          {/* GitHubアイコン */}
          <GitHubIcon />
        </div>
      </div>
    </div>
  );
};
