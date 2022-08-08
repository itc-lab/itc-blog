import React from 'react';
import cs from 'classnames';
import format from 'date-fns/format';

import formatNumber from '../../format-number';
import useMounted from '../../use-mounted';

import { tweetBasicInfo } from '@types';

export default function TweetInfo({
  tweet,
  className = undefined,
}: {
  tweet: tweetBasicInfo;
  className?: string | undefined;
}): JSX.Element {
  const mounted = useMounted();
  const likeUrl = `https://twitter.com/intent/like?tweet_id=${tweet.id}`;
  const tweetUrl = `https://twitter.com/${tweet.username}/status/${tweet.id}`;
  const createdAt =
    typeof window !== 'undefined' && mounted ? new Date(tweet.createdAt) : null;

  return (
    <div className={cs('static-tweet-info', className)}>
      <a
        className="static-tweet-like"
        href={likeUrl}
        title="Like"
        target="_blank"
        rel="noopener noreferrer">
        <div className="static-tweet-heart">
          <div
            className="static-tweet-icon static-tweet-icon-heart"
            role="img"
          />
        </div>

        {(tweet.heartCount || tweet.likes > 0) && (
          <span className="static-tweet-likes">
            {tweet.heartCount || formatNumber(tweet.likes)}
          </span>
        )}
      </a>

      {createdAt && (
        <a
          className="static-tweet-time"
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer">
          <time
            title={`Time Posted: ${createdAt.toUTCString()}`}
            dateTime={createdAt.toISOString()}>
            {format(createdAt, 'h:mm a - MMM d, y')}
          </time>
        </a>
      )}
    </div>
  );
}
