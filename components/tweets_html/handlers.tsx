import React from 'react';
import { ComponentsInterFace } from './layout';

import { tweetBasicInfo } from '@types';

function getContainerClassName(dataType: string) {
  if (!dataType) return;

  const [type, count] = dataType.split(' ');

  switch (type) {
    case 'image-container':
      return `image-container image-count-${count}`;
    case 'gif-container':
    case 'video-container':
      return type;
  }
}

interface ISomeObject {
  [key: string]: (
    arg0: PropsInterFace & {
      dataTyp?: string;
      width?: number;
      height?: number;
      alt?: string;
      src?: string;
    },
    components: ComponentsInterFace,
    i: number | undefined
  ) => JSX.Element | null;
  div(
    props: PropsInterFace,
    components: ComponentsInterFace,
    i: number | undefined
  ): JSX.Element;
  img(
    {
      dataType,
      ...props
    }: {
      dataType?: string;
      width?: number;
      height?: number;
      alt?: string;
      src?: string;
    },
    components: ComponentsInterFace,
    i: number | undefined
  ): JSX.Element | null;
  a(
    props: PropsInterFace,
    components: ComponentsInterFace,
    i: number | undefined
  ): JSX.Element;
}

interface PropsInterFace {
  dataType?: string;
  href?: string;
  children?: (JSX.Element | string | null)[];
  title?: string;
  nodes?: [
    {
      tag: string;
      nodes: {
        [key: number]:
          | string
          | {
              tag: string;
              props: { href: string };
              nodes: { [key: number]: string };
            };
      };
    }
  ];
  data?: tweetBasicInfo;
  src?: string;
  alt?: string;
}

export default {
  div(
    props: PropsInterFace,
    components: ComponentsInterFace,
    i: number | undefined
  ): JSX.Element {
    const { data } = props;
    const type = props.dataType || (data && data.type);

    if (
      type === 'tweet' &&
      data !== undefined &&
      props.children !== undefined
    ) {
      return (
        <components.Tweet key={i} data={data}>
          {props.children}
        </components.Tweet>
      );
    }

    if (type === 'poll-container' && data !== undefined) {
      return <components.Poll key={i} data={data} />;
    }

    const className = type ? getContainerClassName(type) : '';

    return (
      <components.div key={i} className={className}>
        {props.children}
      </components.div>
    );
  },

  img(
    {
      dataType,
      ...props
    }: {
      dataType: string;
      width: number;
      height: number;
      alt: string;
      src: string;
    },
    components: ComponentsInterFace,
    i: number | undefined
  ): JSX.Element | null {
    const className = getContainerClassName(dataType);
    if (dataType === 'emoji-for-text') {
      return <components.Emoji key={i} className={className} {...props} />;
    }

    if (dataType === 'media-image') {
      return <components.img key={i} {...props} />;
    }

    return null;
  },

  a(
    props: PropsInterFace,
    components: ComponentsInterFace,
    i: number | undefined
  ): JSX.Element | undefined {
    const type = props.dataType;

    if (type === 'mention' && props.children) {
      return (
        <components.Mention key={i} href={props.href}>
          {props.children}
        </components.Mention>
      );
    }

    if (type === 'hashtag' && props.children) {
      return (
        <components.Hashtag key={i} href={props.href}>
          {props.children}
        </components.Hashtag>
      );
    }

    if (type === 'cashtag' && props.children) {
      return (
        <components.Cashtag key={i} href={props.href}>
          {props.children}
        </components.Cashtag>
      );
    }

    if (type === 'quote-tweet') {
      return <components.EmbeddedTweet key={i} href={props.href} />;
    }

    if (props.children) {
      return (
        <components.a key={i} href={props.href} title={props.title}>
          {props.children}
        </components.a>
      );
    }
  },
} as ISomeObject;
