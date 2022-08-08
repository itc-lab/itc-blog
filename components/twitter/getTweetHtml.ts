import { getVideo } from './tweet-html';
import {
  fetchUserStatus,
  getEmbeddedTweetHtml,
  fetchTweetWithPoll,
} from './api';
import { fetchTweetAst, conText } from '../FetchTweetAst';
import markdownToAst from './markdownToAst';

import { contentData } from '@types';
import { ReactChild } from 'react';

function getVideoData(userStatus: {
  extended_entities: {
    media: {
      media_url_https: string;
      video_info: { variants: { url: string }[] };
    }[];
  };
}) {
  const video = userStatus.extended_entities.media[0];
  const poster = video.media_url_https;
  // Find the first mp4 video in the array, if the results are always properly sorted, then
  // it should always be the mp4 video with the lowest bitrate
  const mp4Video = video.video_info.variants.find(
    (v: { url: string }) => v.url === 'video/mp4'
  );

  if (!mp4Video) return;

  return { poster, ...mp4Video };
}

function getPollData(tweet: {
  includes: {
    polls: {
      end_datetime: number;
      duration_minutes: string;
      voting_status: string;
      options: string;
    }[];
  };
}) {
  const polls = tweet.includes && tweet.includes.polls;
  return polls && polls[0];
}

async function getMediaHtml(tweet: contentData) {
  let media: string | null | undefined = tweet.mediaHtml;

  if (tweet.hasVideo) {
    const userStatus = await fetchUserStatus(tweet.meta.id);
    const video = userStatus && getVideoData(userStatus);

    media = video ? (media ? getVideo(media, video) : null) : null;
  }

  return media;
}

async function getQuotedTweetHtml(
  { quotedTweet }: contentData,
  context: conText
) {
  if (!quotedTweet) return;

  if (process.env.NEXT_PUBLIC_TWITTER_LOAD_WIDGETS === 'true') {
    const data = await getEmbeddedTweetHtml(quotedTweet.url);
    return data?.html;
  } else {
    const ast = await fetchTweetAst(quotedTweet.id);
    // The AST of embedded tweets is always sent as data
    return ast && `<blockquote data-id="${context.add({ ast })}"></blockquote>`;
  }
}

async function getPollHtml(tweet: contentData, context: conText) {
  if (!tweet.hasPoll) return null;

  const tweetData = await fetchTweetWithPoll(tweet.meta.id);
  const poll = tweetData && getPollData(tweetData);

  if (poll) {
    const meta = {
      type: 'poll-container',
      endsAt: poll.end_datetime,
      duration: poll.duration_minutes,
      status: poll.voting_status,
      options: poll.options,
    };

    return `<div data-id="${context.add(meta)}"></div>`;
  }

  return null;
}

export default async function getTweetHtml(
  tweet: contentData,
  context: conText
): Promise<string> {
  const meta = { ...tweet.meta, type: 'tweet' };
  const md = <{ children: ReactChild }>await markdownToAst(tweet.html);

  const html = [
    // md.children is the markdown content, which is later added as children to the container
    `<div data-id="${context.add(meta, md.children)}">`,
    (await getMediaHtml(tweet)) || '',
    (await getQuotedTweetHtml(tweet, context)) || '',
    (await getPollHtml(tweet, context)) || '',
    `</div>`,
  ].join('');

  return html;
}
