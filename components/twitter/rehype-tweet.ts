import { resolve } from 'url';
import visit from 'unist-util-visit';
import toString from 'mdast-util-to-string';
import { conText } from '../FetchTweetAst';

import { tweetBasicInfo } from '@types';
import { ReactChild } from 'react';
import { Node, Data } from 'unist';

const TWITTER_URL = 'https://twitter.com';
const ABSOLUTE_URL = /^https?:\/\/|^\/\//i;
const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

type NodeCustom = Node & {
  tagName: string;
  properties: { href: string; dataId: string | undefined };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function visitAnchor(node: any): void {
  if (!node.properties) return;

  const { href } = node.properties;

  if (!href) return;

  const isAbsoluteUrl = ABSOLUTE_URL.test(href);

  if (!isAbsoluteUrl) {
    node.properties.href = resolve(TWITTER_URL, href);
  }
}

export default function rehypeTweet(
  context: conText
): (tree: Node<Data>) => void {
  // Nodes may have custom data required by the UI

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function visitData(node: any): void {
    const ctx: { data: tweetBasicInfo; nodes: ReactChild[] } = context.get(
      node.properties.dataId
    );

    if (ctx?.data) node.data = ctx.data;

    // Add markdown content to the tweet container
    if (ctx?.nodes) {
      node.children.unshift(...ctx.nodes);
    }

    delete node.properties.dataId;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function visitHeading(node: any): void {
    const text = toString(node);

    if (!text) return;

    const id = context.slugger.slug(text);

    node.data = { id };
  }

  return function transformer(tree: Node<Data>): void {
    visit(tree, (node: NodeCustom) => node.properties?.dataId, visitData);
    visit(tree, (node: NodeCustom) => node.tagName === 'a', visitAnchor);
    visit(
      tree,
      (node: NodeCustom) => HEADINGS.includes(node.tagName),
      visitHeading
    );
  };
}
