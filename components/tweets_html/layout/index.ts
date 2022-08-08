import { Div, A, Mention, Hashtag, Cashtag, Emoji, Poll } from './components';
import { Argument, Mapping } from 'classnames';
import { Img } from './media';
import Tweet from './tweet/tweet';
import EmbeddedTweet from './components';

import { tweetBasicInfo } from '@types';

export interface ComponentsInterFace {
  div: (p: {
    className: string | undefined;
    children:
      | boolean
      | React.ReactChild
      | React.ReactFragment
      | React.ReactPortal
      | null
      | undefined;
  }) => JSX.Element;
  a: (p: {
    href?: string | undefined;
    title?: string | undefined;
    className?:
      | string
      | number
      | boolean
      | Mapping
      | Argument[]
      | null
      | undefined;
    children: (JSX.Element | string | null)[];
  }) => JSX.Element;
  Mention: (p: {
    href: string | undefined;
    children: (JSX.Element | string | null)[];
  }) => JSX.Element;
  Hashtag: (p: {
    href: string | undefined;
    children: (JSX.Element | string | null)[];
  }) => JSX.Element;
  Cashtag: (p: {
    href: string | undefined;
    children: (JSX.Element | string | null)[];
  }) => JSX.Element;
  Emoji: ({
    className,
    ...props
  }: {
    className: string | undefined;
    width: number;
    height: number;
    alt: string;
    src: string;
  }) => JSX.Element;
  Poll: ({
    data,
  }: {
    data: {
      options: {
        votes: number;
        position: React.Key | null | undefined;
        label:
          | boolean
          | React.ReactChild
          | React.ReactFragment
          | React.ReactPortal
          | null
          | undefined;
      }[];
      endsAt: string;
    };
  }) => JSX.Element;
  img: ({
    ...props
  }: {
    width: number;
    height: number;
    alt: string;
    src: string;
  }) => JSX.Element;
  Tweet: ({
    children,
    data,
  }: {
    children: (JSX.Element | string | null)[];
    data: tweetBasicInfo;
  }) => JSX.Element;
  EmbeddedTweet: ({ href }: { href: string | undefined }) => JSX.Element;
}

export default {
  div: Div,

  a: A,

  Mention,
  Hashtag,
  Cashtag,
  Emoji,
  Poll,

  img: Img,

  Tweet,
  EmbeddedTweet,
};
