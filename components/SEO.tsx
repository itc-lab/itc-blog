import React, { FC } from 'react';
import { NextSeo, BlogJsonLd } from 'next-seo';
import '../settings.d.ts';
import settings from '../settings.yml';
import { SEO_DATA } from '@/types';

interface Props {
  data: SEO_DATA;
  title: string;
  url: string;
}

export const SEO: FC<Props> = ({ data, title, url }) => {
  const tags = [];
  for (const topic of data.topics) {
    tags.push(topic.topics);
  }
  const description = data.description || '';
  const type = data.seo_type || settings.blogs.type;
  const authors: string | string[] = [];
  for (const author of data.seo_authors || settings.blogs.authors) {
    authors.push(author.author);
  }
  const image_urls: string[] = [];
  for (const image_url of data.seo_images || settings.blogs.images) {
    image_urls.push(image_url.url);
  }
  const update_timestamp =
    (data.reflect_updatedAt && data.updatedAt) ||
    (data.reflect_revisedAt && data.revisedAt) ||
    data.publishedAt;
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          title: title,
          description: description,
          url: url,
          type: type,
          article: {
            publishedTime: data.publishedAt,
            modifiedTime: update_timestamp,
            authors: authors,
            tags: tags, //Unix/Linux, Bash/Shell ・・・
          },
          images: data.seo_images || settings.blogs.images,
        }}
        twitter={{
          handle: data.twitter_handle || settings.general.twitter_handle,
          site: data.twitter_site || settings.general.twitter_site,
          cardType: data.twitter_cardtype || settings.general.twitter_cardtype,
        }}
      />
      <BlogJsonLd
        url={url}
        title={title}
        images={image_urls}
        datePublished={data.publishedAt}
        dateModified={update_timestamp}
        authorName={authors}
        description={description}
      />
    </>
  );
};
