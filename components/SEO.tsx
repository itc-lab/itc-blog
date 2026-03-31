import Head from 'next/head';
import { generateNextSeo, type NextSeoProps } from 'next-seo/pages';
import { ArticleJsonLd } from 'next-seo';
import settings from '../settings';
import { SEO_DATA } from '@/types';

interface Props {
  data: SEO_DATA;
  title: string;
  url: string;
}

export const SEO = ({ data, title, url }: Props) => {
  const tags = (data.topics ?? []).map((t) => t.topics);
  const description = data.description ?? '';
  const type = data.seo_type ?? settings.blogs.type;
  const isArticle = type === 'article';
  const authors = (data.seo_authors ?? settings.blogs.authors).map(
    (a) => a.author,
  );
  const images = data.seo_images ?? settings.blogs.images;
  const imageUrls = images.map((img) => img.url);
  const updatedTimestamp =
    (data.reflect_updatedAt && data.updatedAt) ||
    (data.reflect_revisedAt && data.revisedAt) ||
    data.publishedAt;

  const seoConfig: NextSeoProps = {
    title,
    description,
    canonical: url,

    openGraph: {
      title,
      description,
      url,
      type,
      ...(isArticle
        ? {
            article: {
              publishedTime: data.publishedAt,
              modifiedTime: updatedTimestamp,
              authors,
              tags,
            },
          }
        : {}),
      images,
    },

    twitter: {
      handle: data.x_handle ?? settings.general.x_handle,
      site: data.x_site ?? settings.general.x_site,
      cardType: data.x_cardtype ?? settings.general.x_cardtype,
    },
  };

  return (
    <>
      <Head>{generateNextSeo(seoConfig)}</Head>
      {isArticle && data.publishedAt && (
        <ArticleJsonLd
          type="BlogPosting"
          url={url}
          headline={title}
          image={imageUrls}
          datePublished={data.publishedAt}
          dateModified={updatedTimestamp}
          author={authors}
          description={description}
        />
      )}
    </>
  );
};
