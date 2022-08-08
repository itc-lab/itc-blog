import React, { forwardRef, createContext, ReactNode, useContext } from 'react';
import cs from 'classnames';
import useSWR, { SWRConfiguration } from 'swr';

import Node from './tweets_html/node';
import components from './tweets_html/layout';

import { tweetAst } from '@types';

type TweetProps = {
  id: string;
  ast?: unknown;
  caption?: string;
  className?: string;
  // TODO: understand what br is used for
  // br?: string
};

// TODO: make this more specific
export type TweetAst = Array<tweetAst>;

export type TwitterContextValue = {
  // static tweet ast info
  tweetAstMap: TweetAstMap;

  // SWR config for dynamically fetching tweet ast info
  swrOptions: SWRConfiguration;
};

export type TweetAstMap = {
  [tweetId: string]: TweetAst;
};

export interface TwitterContextProviderProps {
  value: Partial<TwitterContextValue>;
  children?: ReactNode;
}

// Saves the tweets returned as props to the page
const TwitterContext = createContext<TwitterContextValue>({
  tweetAstMap: {},
  swrOptions: {
    fetcher: (id) =>
      fetch(`https://twitter-search.vercel.app/api/get-tweet-ast/${id}`).then(
        (r) => r.json()
      ),
  },
});

export function useTwitterContext(): TwitterContextValue {
  return useContext(TwitterContext);
}

const Tweet = forwardRef<HTMLElement, TweetProps>(function useForwardRefContent(
  { id, ast, caption, className }: TweetProps,
  ref
) {
  const twitter = useTwitterContext();
  const { data: tweetAst } = useSWR(
    id,
    (id) => ast || twitter.tweetAstMap[id] || twitter.swrOptions.fetcher?.(id),
    twitter.swrOptions
  );

  return (
    <article ref={ref} className={cs('static-tweet', className)}>
      {tweetAst && (
        <>
          <Node components={components} node={tweetAst[0]} />

          {caption != null ? (
            <p className="static-tweet-caption">{caption}</p>
          ) : null}
        </>
      )}
    </article>
  );
});

export { Tweet };
