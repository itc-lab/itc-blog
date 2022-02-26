import { OpenGraphMedia } from 'next-seo/lib/types';

export interface IBlog extends IMicroCmsResponseBase {
  reflect_updatedAt?: boolean;
  reflect_revisedAt?: boolean;
  title: string;
  category: ITopic;
  topics: ITopic[];
  content: string;
  description?: string;
  seo_type?: string;
  seo_authors?: ISeoAuthors[];
  seo_images_url?: string;
  seo_images_width?: string;
  seo_images_height?: string;
  seo_images_alt?: string;
}

export interface IBlogs {
  contents: IBlog[];
}

export interface ITopic extends IMicroCmsResponseBase {
  topics: string;
  logo: string;
  needs_title: boolean;
}

export interface ISeoAuthors extends IMicroCmsResponseBase {
  author: string;
}

export interface ITweet extends IMicroCmsResponseBase {
  twitter_id: string;
  caption: string;
  memo: string;
}

export type MicroCmsResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

export interface IMicroCmsResponseBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
}

export interface SEO_DATA {
  publishedAt: string;
  updatedAt: string;
  revisedAt: string;
  reflect_updatedAt?: boolean;
  reflect_revisedAt?: boolean;
  topics: ITopic[];
  description?: string;
  seo_type?: string;
  seo_authors?: { author: string }[];
  seo_images?: OpenGraphMedia[];
  twitter_handle?: string;
  twitter_site?: string;
  twitter_cardtype?: string;
}

export interface BreadCrumbsData {
  contents: string;
  path: string;
}

export interface BreadCrumbsList {
  breadcrumbslist: BreadCrumbsData[];
}
