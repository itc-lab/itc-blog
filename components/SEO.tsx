import React, { FC } from 'react';
import { NextSeo, BlogJsonLd } from 'next-seo';
import '../settings.d.ts';
import settings from '../settings.yml';

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
  topics: Topic[];
  seo_title?: string;
  seo_description?: string;
  seo_type?: string;
  seo_authors?: string;
  seo_images_url?: string;
  seo_images_width?: number;
  seo_images_height?: number;
  seo_images_alt?: string;
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
  const description = data.seo_description || settings.general[0].description;
  const type = data.seo_type || settings.blogs[0].type;
  const authors = data.seo_authors || settings.blogs[0].authors;
  const images_url = data.seo_images_url || settings.blogs[0].images[0].url;
  const images_width =
    data.seo_images_width || settings.blogs[0].images[0].width;
  const images_height =
    data.seo_images_height || settings.blogs[0].images[0].height;
  const images_alt = data.seo_images_alt || settings.blogs[0].images[0].alt;

  return (
    <>
      <NextSeo
        openGraph={{
          title: data.seo_title
            ? data.seo_title
            : `${title}${settings.blogs[0].description}`,
          description: description,
          url: url,
          type: type,
          article: {
            publishedTime: data.publishedAt,
            modifiedTime: data.updatedAt,
            authors: [authors],
            tags: tags, //Unix/Linux, Bash/Shell ・・・
          },
          images: [
            {
              url: images_url,
              width: images_width,
              height: images_height,
              alt: images_alt,
            },
          ],
        }}
      />
      <BlogJsonLd
        url={url}
        title={
          data.seo_title
            ? data.seo_title
            : `${title}${settings.blogs[0].description}`
        }
        images={[images_url]}
        datePublished={data.publishedAt}
        dateModified={data.updatedAt}
        authorName={authors}
        description={description}
      />
    </>
  );
};
