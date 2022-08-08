import React from 'react';
import TweetHeader from './tweet-header';
import TweetInfo from './tweet-info';

import { tweetBasicInfo } from '@types';

interface useTweetData {
  id?: string | undefined;
  username?: string;
}

const TweetContext = React.createContext<useTweetData>({});

export const useTweet = (): useTweetData => React.useContext(TweetContext);

export default function Tweet({
  children,
  data,
}: {
  children: (JSX.Element | string | null)[];
  data: tweetBasicInfo;
}): JSX.Element {
  return (
    <div className="static-tweet-body">
      <blockquote className="static-tweet-body-blockquote">
        <TweetHeader tweet={data} />
        <TweetContext.Provider value={data}>{children}</TweetContext.Provider>
        <TweetInfo tweet={data} />
      </blockquote>
    </div>
  );
}
