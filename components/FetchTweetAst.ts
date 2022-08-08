import GithubSlugger from 'github-slugger';
import { fetchTweetHtml } from './twitter/api';
import { getTweetData } from './twitter/embed/tweet-html';
import getTweetHtml from './twitter/getTweetHtml';
import htmlToAst from './twitter/htmlToAst';

import { tweetBasicInfo } from '@types';
import { ReactChild } from 'react';

export interface conText {
  slugger: GithubSlugger;
  get(id: string | undefined): { data: tweetBasicInfo; nodes: ReactChild[] };
  add(data: unknown, nodes?: unknown): number;
}

class Context {
  slugger = new GithubSlugger();
  map = [];

  get(id: string | undefined): { data: tweetBasicInfo; nodes: ReactChild[] } {
    return this.map[Number(id)];
  }

  add(data: unknown, nodes: unknown) {
    return this.map.push(<never>{ data, nodes }) - 1;
  }
}

export async function fetchTweetAst(tweetId: string): Promise<unknown | null> {
  const tweetHtml = await fetchTweetHtml(tweetId);
  const tweet = tweetHtml && getTweetData(tweetHtml);

  if (!tweet) return null;

  const context = new Context();
  const html = await getTweetHtml(tweet, context);
  const ast = await htmlToAst(html, context);

  return ast;
}
