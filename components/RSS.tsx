import fs from 'fs';

import { Feed } from 'feed';

import { IBlogService, BlogService } from '@utils/BlogService';
import { IBlog, MicroCmsResponse } from '@/types/interface';
import settings from '@settings.yml';
//import { renderToString } from 'react-dom/server';
//import { Markdown } from '@components/Markdown';
//import React from 'react';

export async function generateRssFeed(): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  const service: IBlogService = new BlogService();
  const posts: MicroCmsResponse<IBlog> = await service.getBlogs(9999, 1); //全コンテンツ取得
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/`
    : 'https://itc-engineering-blog.netlify.app/';
  const date = new Date();
  const author = {
    name: settings.rss.author.name,
    email: settings.rss.author.email,
    link: settings.rss.author.link,
  };

  const feed = new Feed({
    title: settings.general.name,
    description: settings.general.description,
    id: baseUrl,
    link: baseUrl,
    image: `${baseUrl}favicon-32x32.png`,
    favicon: `${baseUrl}favicon-32x32.png`,
    copyright: `All rights reserved ${date.getFullYear()}, ${
      settings.rss.author.name
    }`,
    updated: date,
    generator: 'Feed for Node.js',
    feedLinks: {
      rss2: `${baseUrl}rss/feed.xml`,
      json: `${baseUrl}rss/feed.json`,
      atom: `${baseUrl}rss/atom.xml`,
    },
    author,
  });

  posts.contents.forEach((post) => {
    const url = `${baseUrl}blogs/${post.id}`;
    const update_timestamp =
      (post.reflect_updatedAt && post.updatedAt) ||
      (post.reflect_revisedAt && post.revisedAt) ||
      post.publishedAt;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description,
      content: post.description,
      //content: renderToString(<Markdown source={post.content} />),
      author: [author],
      contributor: [author],
      date: new Date(update_timestamp),
    });
  });

  fs.mkdirSync('./public/rss', { recursive: true });
  fs.writeFileSync('./public/rss/feed.xml', feed.rss2());
  fs.writeFileSync('./public/rss/atom.xml', feed.atom1());
  fs.writeFileSync('./public/rss/feed.json', feed.json1());
}
