import React from 'react';
import { NextSeo, BlogJsonLd } from 'next-seo'
import settings from '../settings.yml'

export const SEO = ({data, url}) => {
    var tags = [];
    for(var topic of data.topics) {
        tags.push(topic.topics);
    }
    const description = data.seo_description || settings.general[0].description;
    const type = data.seo_type || settings.blogs[0].type;
    const authors = data.seo_authors || settings.blogs[0].authors;
    const images_url = data.seo_images_url || settings.blogs[0].images[0].url;
    const images_width = data.seo_images_width || settings.blogs[0].images[0].width;
    const images_height = data.seo_images_height || settings.blogs[0].images[0].height;
    const images_alt = data.seo_images_alt || settings.blogs[0].images[0].alt;

  return (
    <>
        <NextSeo
        openGraph={{
        title: data.seo_title ? data.seo_title : `${settings.blogs[0].description} ${data.title}`,
        description: description,
        url: url,
        type: type,
        article: {
            publishedTime: data.publishedAt,
            modifiedTime: data.updatedAt,
            authors: [
                authors
            ],
            tags: tags,//Unix/Linux, Bash/Shell ・・・
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
        title={data.seo_title ? data.seo_title : `${settings.blogs[0].description} ${data.title}`}
        images={[
            images_url,
        ]}
        datePublished={data.publishedAt}
        dateModified={data.updatedAt}
        authorName={authors}
        description={description}
        />
    </>
  );
};
