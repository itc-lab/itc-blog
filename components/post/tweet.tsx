import { useRouter } from "next/router";
import { useTweet } from "../../lib/tweets";
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../static-tweet/components/... Remove this comment to see the full error message
import Node from "../../static-tweet/components/html/node";
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../static-tweet/components/... Remove this comment to see the full error message
import components from "../../static-tweet/components/twitter-layout/components";
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../static-tweet/components/... Remove this comment to see the full error message
import twitterTheme from "../../static-tweet/components/twitter-layout/twitter.module.css";

export default function Tweet({
  id,
  br,
  caption
}: any) {
  const tweet = useTweet(id);

  // Happens when `getStaticProps` is traversing the tree to collect the tweet ids
  if (tweet.ignore) return null;

  return (
    <main className={twitterTheme.theme}>
      <Node components={components} node={tweet.ast[0]} br={br} />
      {caption != null ? <p>{caption}</p> : null}
      <style jsx>{`
        main {
          max-width: 100%;
          min-width: 220px;
          margin: 2rem auto;
        }
        p {
          font-size: 14px;
          color: #999;
          text-align: center;
          margin: 0;
          margin-top: 10px;
          padding: 0;
        }
      `}</style>
    </main>
  );
}
