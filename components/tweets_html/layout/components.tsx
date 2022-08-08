import React, { Fragment } from 'react';
import cs, { Argument, Mapping } from 'classnames';
import Node from '../node';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import components from './';

const PROTOCOL = /^(https?:|)\/\//;

const beautifyHref = (href: string) => {
  const text = href.replace(PROTOCOL, '');
  const i = text.indexOf('/');

  if (i === -1) return text;
  // Remove trailing slash
  if (i === text.length - 1) {
    return text.substring(0, i);
  }

  const hostname = text.substring(0, i);
  const pathname = text.substring(i);

  // Hide large paths similarly to how twitter does it
  return pathname.length > 20
    ? `${hostname}${pathname.substring(0, 15)}...`
    : text;
};

export const A = (p: {
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
}): JSX.Element => (
  <a
    href={p.href}
    target="_blank"
    rel="noopener noreferrer"
    title={p.title || p.href}
    className={cs('static-tweet-anchor', p.className)}>
    {p.children[0] === p.href && p.href ? beautifyHref(p.href) : p.children}
  </a>
);

export const TwitterLink = (p: {
  href: string | undefined;
  title?: string;
  type:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
  children:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}): JSX.Element => (
  <a
    href={p.href}
    target="_blank"
    rel="noopener noreferrer"
    title={p.title || p.href}
    className="static-tweet-twitter-link">
    <s>{p.type}</s>

    {p.children}
  </a>
);

export const Mention = (p: {
  href: string | undefined;
  children: (JSX.Element | string | null)[];
}): JSX.Element => (
  <TwitterLink href={p.href} type="@">
    {p.children[0] && typeof p.children[0] !== 'object'
      ? p.children[0].replace(/^@/, '')
      : ''}
  </TwitterLink>
);

export const Hashtag = (p: {
  href: string | undefined;
  children: (JSX.Element | string | null)[];
}): JSX.Element => (
  <TwitterLink href={p.href} type="#">
    {p.children[0] && typeof p.children[0] !== 'object'
      ? p.children[0].replace(/^#/, '')
      : ''}
  </TwitterLink>
);

export const Cashtag = (p: {
  href: string | undefined;
  children: (JSX.Element | string | null)[];
}): JSX.Element => (
  <TwitterLink href={p.href} type="$">
    {p.children[0] && typeof p.children[0] !== 'object'
      ? p.children[0].replace(/^\$/, '')
      : ''}
  </TwitterLink>
);

export const Emoji = ({
  className,
  ...props
}: {
  className: string | undefined;
  width: number;
  height: number;
  alt: string;
  src: string;
}): JSX.Element => (
  <img className={cs('static-tweet-emoji', className)} {...props} />
);

// Note: Poll data is most likely cached, so ongoing polls will not be updated
// until a revalidation happens
export const Poll = ({
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
}): JSX.Element => {
  const votesCount = data.options.reduce(
    (count: number, option: { votes: number }) => count + option.votes,
    0
  );
  const endsAt = new Date(data.endsAt);
  const now = new Date();

  return (
    <div className="static-tweet-poll">
      <div className="static-tweet-options">
        {data.options.map(
          (option: {
            votes: number;
            position: React.Key | null | undefined;
            label:
              | boolean
              | React.ReactChild
              | React.ReactFragment
              | React.ReactPortal
              | null
              | undefined;
          }) => {
            const per = Math.round((option.votes / votesCount) * 100) || 0;
            const width = per || 1 + '%';
            const widthLabel = per + '%';

            return (
              <Fragment key={option.position}>
                <span className="static-tweet-label">{option.label}</span>
                <span className="static-tweet-chart" style={{ width }}></span>
                <span>{widthLabel}</span>
              </Fragment>
            );
          }
        )}
      </div>
      <hr />
      <div className="static-tweet-footer">
        <span className="static-tweet-votes-count">{votesCount} votes</span>
        <span>
          {now > endsAt
            ? 'Final results'
            : `${formatDistanceStrict(endsAt, now)} left`}
        </span>
      </div>
    </div>
  );
};

export const Div = (p: {
  className: string | undefined;
  children:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}): JSX.Element => <div className={p.className}>{p.children}</div>;

export default function EmbeddedTweet({
  href,
}: {
  href: string | undefined;
}): JSX.Element {
  return <Node components={components} node={href} />;
}
