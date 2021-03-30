import React from 'react';
import Tweet from '../components/post/tweet';
import { Tweets } from '../lib/tweets';
import { GitHubIcon } from '../components/GitHubIcon';

export const ArticleFooter = ({tweets, tweets_id_data}) => {
  return (
    <div className="my-6 md:my-10 bg-white rounded-lg shadow py-10 text-base">
      <div className="max-w-screen-lg m-auto px-5 iphone:px-10">
        <Tweets.Provider value={tweets}>
          {tweets_id_data
            .map((value) => {
                return (
                  <Tweet id={value.twitter_id} />
                )
            })
          }
        </Tweets.Provider>
        <div className="ml-5 my-7 flex items-center">
          {/* GitHubアイコン */}
          <GitHubIcon/>
        </div>
      </div>
    </div>
  );
};
