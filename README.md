# ITC Engineering Blog

https://user-images.githubusercontent.com/76575923/132984785-a549c1a3-021f-433d-8798-3a2a67443411.mp4

The Jamstack static site using [microCMS](https://microcms.io) and [Netlify](https://www.netlify.com).  
Made with [Next.js](https://nextjs.org), [TypeScript](https://www.typescriptlang.org), [Tailwind CSS](https://tailwindcss.com), [PostCSS](https://postcss.org), [ESLint](https://eslint.org), [Prettier](https://prettier.io), Google Analytics

[![Netlify Status](https://api.netlify.com/api/v1/badges/72088f84-0392-4546-9902-818d4babed11/deploy-status)](https://app.netlify.com/sites/itc-engineering-blog/deploys)

## Demo

Access the following demo site:

[ITC Engineering Blog](https://itc-engineering-blog.netlify.app/)

## Features

- [Next.js](https://nextjs.org) : used for static site generation
  - Integrate with [Tailwind CSS](https://tailwindcss.com)
  - [PostCSS](https://postcss.org) for processing [Tailwind CSS](https://tailwindcss.com)
  - Support [TypeScript](https://www.typescriptlang.org)
- Headless CMS : built with [microCMS](https://microcms.io) for quick posting, maintenance
- Table of contents (TOC) : [Tocbot](https://tscanlin.github.io/tocbot/) builds a table of contents (TOC) from headings in an HTML document
- Static Tweet : tweets are rendered statically using [static-tweet](https://github.com/lfades/static-tweet), [react-static-tweets](https://github.com/transitive-bullshit/react-static-tweets)
- Syntax Highlighting : with [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- Markdown : supported by [react-markdown](https://github.com/remarkjs/react-markdown)
- Pagination : limits the number of posts per page
- SEO : [Next SEO](https://github.com/garmeeh/next-seo) supports openGraph and JSON-LD
  - Access analysis is possible with Google analytics
  - [next-sitemap](https://github.com/iamvishnusankar/next-sitemap) generate sitemap(s) and robots.txt
- Lint : Linter with [ESLint](https://eslint.org)
- Formatter : Code formatted by [Prettier](https://prettier.io)
- Site search : implemented in SSR, uses the microCMS API
- RSS/Atom : Generate RSS / Atom feeds using [feed](https://github.com/jpmonette/feed)

## Requirements

- Node.js and npm

## Headless CMS (microCMS) API Schema

### SEO-IMAGES

endpoint: seo-images  
type: リスト形式

| フィールド ID | 表示名 | 種類               |
| ------------- | ------ | ------------------ |
| url           | url    | テキストフィールド |
| alt           | alt    | テキストフィールド |
| width         | width  | 数字               |
| height        | height | 数字               |

### SEO-AUTHORS

endpoint: seo-authors  
type: リスト形式

| フィールド ID | 表示名 | 種類               |
| ------------- | ------ | ------------------ |
| author        | author | テキストフィールド |

### Twitter

endpoint: twitter  
type: リスト形式

| フィールド ID | 表示名     | 種類               |
| ------------- | ---------- | ------------------ |
| twitter_id    | twitter_id | テキストフィールド |
| caption       | caption    | テキストエリア     |
| memo          | memo       | テキストエリア     |

### 関連技術

endpoint: topics  
type: リスト形式

| フィールド ID | 表示名       | 種類               |
| ------------- | ------------ | ------------------ |
| topics        | 関連技術名   | テキストフィールド |
| logo          | ロゴ画像パス | テキストフィールド |
| needs_title   | 文字必要有無 | 真偽値             |

### コンテンツ

endpoint: contents  
type: リスト形式

| フィールド ID     | 表示名            | 種類                             |
| ----------------- | ----------------- | -------------------------------- |
| title             | タイトル          | テキストフィールド               |
| category          | カテゴリ          | コンテンツ参照 - 関連技術        |
| topics            | 関連技術          | 複数コンテンツ参照 - 関連技術    |
| content           | 記事内容          | テキストエリア                   |
| description       | description       | テキストフィールド               |
| reflect_updatedAt | reflect_updatedAt | 真偽値                           |
| reflect_revisedAt | reflect_revisedAt | 真偽値                           |
| seo_images        | seo_images        | 複数コンテンツ参照 - SEO-IMAGES  |
| seo_type          | seo_type          | テキストフィールド               |
| seo_authors       | seo_authors       | 複数コンテンツ参照 - SEO-AUTHORS |
| twitter_handle    | twitter_handle    | テキストフィールド               |
| twitter_site      | twitter_site      | テキストフィールド               |
| twitter_cardtype  | twitter_cardtype  | テキストフィールド               |

## Getting started

Create a .env.local file similar to .env.example:

```
API_URL=[microCMS API URL]
API_KEY=[microCMS API KEY]
TWITTER_API_TOKEN=[Twitter API Token]
NEXT_PUBLIC_CDN_URL=[CDN(Cloudinary) URL for images]
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=[Google Analytics Tracking ID]
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_META_CODE=[Google Search Console Site Verification Code for meta tag]
GOOGLE_SITE_VERIFICATION_HTML_CODE=[Google Search Console Site Verification Code for html content]
GOOGLE_SITE_VERIFICATION_HTML_FILE_NAME=[Google Search Console Site Verification html file name]
NEXT_PUBLIC_BASEURL=[Base Url, e.g. https://itc-engineering-blog.netlify.app]
#If you use a proxy server, add the following.
#https_proxy=[Proxy Server Url, e.g. http://192.168.0.10:3128/]
```

Run the following command on your local environment:

```
git clone --depth=1 https://github.com/itc-lab/itc-blog.git my-project-name
cd my-project-name
npm install
```

Then, you can run locally in development mode with live reload:

```
npm run dev
```

Open http://localhost:3000 with your favorite browser to see your project.

## Deploy to Netlify

[Next.js microCMS GitHub Netlify で Jamstack なブログを公開 - ITC Engineering Blog](https://itc-engineering-blog.netlify.app/blogs/efxq_5j84z)
を参考に Netlify へデプロイしてください。(Japanese text only)

## License

MIT
