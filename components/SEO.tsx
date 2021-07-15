import React, { FC } from 'react';
import { NextSeo, BlogJsonLd } from 'next-seo';
import '../settings.d.ts';
import settings from '../settings.yml';
import { OpenGraphImages } from 'next-seo/lib/types';

interface Topic {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  topics: string;
  logo: string;
  needs_title: boolean;
}
interface SEO_DATA {
  publishedAt: string;
  updatedAt: string;
  revisedAt?: string;
  reflect_updatedAt?: boolean;
  reflect_revisedAt?: boolean;
  topics: Topic[];
  description?: string;
  seo_type?: string;
  seo_authors?: { author: string }[];
  seo_images?: OpenGraphImages[];
  twitter_handle?: string;
  twitter_site?: string;
  twitter_cardtype?: string;
}
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
  const type = data.seo_type || settings.blogs[0].type;
  const authors: string | string[] = [];
  for (const author of data.seo_authors || settings.blogs[0].authors) {
    authors.push(author.author);
  }
  const image_urls: string[] = [];
  for (const image_url of data.seo_images || settings.blogs[0].images) {
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
          images: data.seo_images || settings.blogs[0].images,
        }}
        twitter={{
          handle: data.twitter_handle || settings.general[0].twitter_handle,
          site: data.twitter_site || settings.general[0].twitter_site,
          cardType:
            data.twitter_cardtype || settings.general[0].twitter_cardtype,
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
