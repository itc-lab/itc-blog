# ITC Engineering Blog

<p align="center">
  <a href="https://itc-engineering-blog.netlify.app/"><img src="https://res.cloudinary.com/dt8zu6zzd/image/upload/v1619948175/itc-engineering-blog-readme.png" alt="ITC Engineering Blog"></a>
</p>

The Jamstack static site using [microCMS](https://microcms.io) and [Netlify](https://www.netlify.com).  
Made with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), [PostCSS](https://postcss.org).

## Demo

Access the following demo site:

[ITC Engineering Blog](https://itc-engineering-blog.netlify.app/)

## Features
- [Next.js](https://nextjs.org) : used for static site generation  
    - Integrate with [Tailwind CSS](https://tailwindcss.com)  
    - [PostCSS](https://postcss.org) for processing [Tailwind CSS](https://tailwindcss.com)  
- microCMS : built with [microCMS](https://microcms.io) for quick posting, maintenance 
- Table of contents (TOC) : [Tocbot](https://tscanlin.github.io/tocbot/) builds a table of contents (TOC) from headings in an HTML document  
- Static Tweet : tweets are rendered statically using [static-tweet](https://github.com/lfades/static-tweet), [react-static-tweets](https://github.com/transitive-bullshit/react-static-tweets)  
- Syntax Highlighting : with [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- Markdown : supported by [react-markdown](https://github.com/remarkjs/react-markdown)  
- Pagination : limits the number of posts per page  
- SEO : [Next SEO](https://github.com/garmeeh/next-seo) supports openGraph and JSON-LD  

## Requirements

- Node.js and npm

## microCMS API Schema

### Twitter
endpoint: twitter  
type: リスト形式

| フィールドID | 表示名 | 種類 |
| ------------- | ------------- | ----- |
| twitter_id | twitter_id | テキストフィールド |
| caption | caption | テキストエリア |
| memo | memo | テキストエリア |

### 関連技術
endpoint: topics  
type: リスト形式

| フィールドID | 表示名 | 種類 |
| ------------- | ------------- | ----- |
| topics | 関連技術名 | テキストフィールド |
| logo | ロゴ画像パス | テキストエリア |
| needs_title | 文字必要有無 | 真偽値 |

### コンテンツ
endpoint: contents  
type: リスト形式

| フィールドID | 表示名 | 種類 |
| ------------- | ------------- | ----- |
| title | タイトル | テキストフィールド |
| category | カテゴリ | コンテンツ参照 - 関連技術※１つのみ |
| topics | 関連技術 | コンテンツ参照 - 関連技術※複数 |
| content | 記事内容 | テキストエリア |
| seo_description | 内容の説明 | テキストフィールド |
| seo_type | openGraph_type | テキストフィールド |
| seo_authors | openGraph_authors | テキストフィールド |
| seo_images_url | openGraph_images | テキストエリア |
| seo_images_width | openGraph_images_width | テキストエリア |
| seo_images_height | openGraph_images_height | テキストエリア |
| seo_images_alt | openGraph_images_alt | テキストエリア |

## Getting started

Create a .env.local file similar to .env.example:

```
API_URL=[microCMS API URL]
API_KEY=[microCMS API KEY]
TWITTER_API_TOKEN=[Twitter API Token]
CDN_URL=[CDN(Cloudinary) URL for images]
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

## License

MIT
