import cheerio from 'cheerio';

import { contentData, tweetBasicInfo } from '@types';

function getTweetContent($: cheerio.Root) {
  const container = $('.EmbeddedTweet-tweetContainer');

  if (!container.length) return;

  // This is the blockquote with the tweet
  const subject = container.find('[data-scribe="section:subject"]');

  // Tweet header with the author info
  const header = subject.children('.Tweet-header');
  const avatar = header.find('[data-scribe="element:avatar"]');
  const author = header.find('[data-scribe="component:author"]');
  const name = author.find('[data-scribe="element:name"]');
  const screenName = author.find('[data-scribe="element:screen_name"]');

  // Tweet body
  const tweet = subject.children('[data-scribe="component:tweet"]');
  const tweetContent = tweet.children('p');
  const card = tweet.children('.Tweet-card');
  const tweetInfo = tweet.children('.TweetInfo');
  const fullTimestamp = tweetInfo.find(
    '[data-scribe="element:full_timestamp"]'
  );
  const heartCount = tweetInfo.find('[data-scribe="element:heart_count"]');

  // Tweet footer
  const callToAction = container.children(
    '[data-scribe="section:cta component:news"]'
  );
  const profileText = callToAction.children(
    '[data-scribe="element:profile_text"]'
  );
  const conversationText = callToAction.children(
    '[data-scribe="element:conversation_text"]'
  );

  let quotedTweet;
  let mediaHtml;

  const textMatch = conversationText.text().match(/^[^\s]+/);

  const get_id = subject.attr('data-tweet-id');
  const id = get_id ? get_id : '';

  const meta: tweetBasicInfo = {
    id: id,
    avatar: { normal: avatar.attr('data-src-1x') },
    name: name.text(),
    username: screenName.text().substring(1), // Omit the initial @
    createdAt: new Date(
      fullTimestamp.attr('data-datetime') as string
    ).getTime(),
    heartCount: heartCount.text(),
    ctaType: profileText.length ? 'profile' : 'conversation',
    // Get the formatted count and skip the rest
    ctaCount: conversationText.length ? (textMatch ? textMatch[0] : '') : '',
    likes: 0,
    options: [{ votes: 0, position: null, label: null }],
    endsAt: '',
  };

  // If some text ends without a trailing space, it's missing a <br>
  tweetContent.contents().each(function (this: { element: Element }) {
    const el = $(this);
    const type = el[0].type;

    if (type !== 'text') return;

    const text = el.text();

    if (text.length && text.trim() === '') {
      if (el.next().children().length) {
        el.after($('<br>'));
      }
    } else if (
      !/\s$/.test(el.text()) &&
      el.next().children().length &&
      !/^[#@]/.test(el.next().text())
    ) {
      el.after($('<br>'));
    }
  });

  card
    .children()
    .each(function (this: { attribs: { [attr: string]: string } }) {
      const props = this.attribs;
      const scribe = props['data-scribe'];
      const el = $(this);

      if (scribe === 'section:quote') {
        const tweetCard = el.children('a');
        const dataTweetId = tweetCard.attr('data-tweet-id');
        const id = dataTweetId ? dataTweetId : '';
        const urlHref = tweetCard.attr('data-tweet-id');
        const url = urlHref ? urlHref : '';

        quotedTweet = { id, url };
        return;
      }

      const media = $('<div>');

      if (scribe === 'component:card') {
        const photo = el.children('[data-scribe="element:photo"]');
        const photoGrid = el.children('[data-scribe="element:photo_grid"]');
        const photos = photo.length ? photo : photoGrid;

        if (photos.length) {
          const images = photos.find('img');

          images.each(function (this: { attribs: { [attr: string]: string } }) {
            const img = $(this);
            const alt = img.attr('alt');
            const url = img.attr('data-image');
            const format = img.attr('data-image-format');
            const height = <string>img.attr('height');
            const width = <string>img.attr('width');

            this.attribs = {
              'data-type': 'media-image',
              src: `${url}?format=${format}`,
              height,
              width,
            };
            if (alt) {
              this.attribs.alt = alt;
            }
            // Move the media img to a new container
            media.append(img);
          });
          media.attr('data-type', `image-container ${images.length}`);
          mediaHtml = $('<div>').append(media).html();
        }
      }
    });

  tweetContent
    .children('img')
    .each(function (this: { attribs: { [attr: string]: string } }) {
      const props = this.attribs;

      // Handle emojis inside the text
      if (props.class?.includes('Emoji--forText')) {
        this.attribs = {
          'data-type': 'emoji-for-text',
          src: props.src,
          alt: props.alt,
        };
        return;
      }

      console.error(
        'An image with the following props is not being handled:',
        props
      );
    });

  tweetContent
    .children('a')
    .each(function (this: { attribs: { [attr: string]: string } }) {
      const props = this.attribs;
      const scribe = props['data-scribe'];
      const el = $(this);
      const asTwitterLink = (type: string) => {
        this.attribs = {
          'data-type': type,
          href: props.href,
        };
        // Replace custom tags inside the anchor with text
        el.text(el.text());
      };

      // @mention
      if (scribe === 'element:mention') {
        return asTwitterLink('mention');
      }

      // #hashtag
      if (scribe === 'element:hashtag') {
        // A hashtag may be a $cashtag too
        const type: string =
          props['data-query-source'] === 'cashtag_click'
            ? 'cashtag'
            : 'hashtag';
        return asTwitterLink(type);
      }

      if (scribe === 'element:url') {
        const url = props['data-expanded-url'];
        // const quotedTweetId = props['data-tweet-id']

        // Remove link to quoted tweet to leave the card only
        // if (quotedTweetId && quotedTweetId === quotedTweet?.id) {
        //   el.remove();
        //   return;
        // }

        // Handle normal links
        const text: cheerio.TextElement = {
          type: 'text',
          data: url,
          next: null,
          prev: null,
          parent: {
            tagName: '',
            type: 'tag',
            name: '',
            attribs: { attr: '' },
            'x-attribsNamespace': { attr: '' },
            'x-prefixNamespace': { attr: '' },
            children: [],
            childNodes: null,
            lastChild: null,
            firstChild: null,
            next: null,
            nextSibling: <cheerio.Element>{},
            prev: null,
            previousSibling: <cheerio.Element>{},
            parent: <cheerio.Element>{},
            parentNode: <cheerio.Element>{},
            nodeValue: '',
          },
        };
        // Replace the link with plain text and markdown will take care of it
        el.replaceWith(text);
      }
    });

  let html = tweetContent.html();
  !html ? (html = '') : '';

  const content: contentData = {
    meta: meta,
    html: html,
    quotedTweet: quotedTweet,
    mediaHtml: mediaHtml,
  };

  return content;
}

export function getTweetData(html: string): contentData | undefined {
  const $ = cheerio.load(html, {
    decodeEntities: false,
    xmlMode: false,
  });

  const tweetContent = getTweetContent($);

  return tweetContent;
}
