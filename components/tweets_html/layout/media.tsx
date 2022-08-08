import React from 'react';
import { useTweet } from './tweet/tweet';

export const Img = ({
  ...props
}: {
  width: number;
  height: number;
  alt: string;
  src: string;
}): JSX.Element => {
  const tweet = useTweet();
  const tweetUrl = `https://twitter.com/${tweet.username}/status/${tweet.id}`;

  return (
    <details className="static-tweet-details">
      <summary className="static-tweet-summary">
        <a
          href={tweetUrl}
          className="avatar"
          target="_blank"
          rel="noopener noreferrer">
          <img {...props} src={`${props.src}&name=small`} />
        </a>
      </summary>
    </details>
  );
};
