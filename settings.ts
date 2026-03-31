export type Settings = {
  general: {
    url: string;
    name: string;
    description: string;
    logo: string;
    hashtag: string;
    per_page: number;
    pagination: number;
    github: string;
    company_name: string;
    company_logo: string;
    company_url: string;
    x_handle: string;
    x_site: string;
    x_cardtype: string;
    search_result_title: string;
  };
  blogs: {
    url: string;
    logo: string;
    logo_mini: string;
    comments: string;
    title_suffix: string;
    type: string;
    authors: Array<{ author: string }>;
    images: Array<{ url: string; width: number; height: number; alt: string }>;
  };
  rss: {
    author: {
      name: string;
      email: string;
      link: string;
    };
  };
};

const settings: Settings = {
  general: {
    url: 'https://itc-engineering-blog.netlify.app',
    name: 'ITC Engineering Blog',
    description:
      '豊田市のシステム開発会社 株式会社アイティーシーの技術情報発信ブログです。過去の知見、新たな知見を公開しています。ブログ自体のソースコードも公開しています。ご意見、ご感想は、お気軽にXアカウントまで！',
    logo: '/ITC_Engineering_Blog1.png',
    hashtag: 'blog_itc',
    per_page: 20,
    pagination: 5,
    github: 'https://github.com/itc-lab',
    company_name: '株式会社アイティーシー',
    company_logo: '/ITC_logo.png',
    company_url: 'https://itccorporation.jp',
    x_handle: '@blog_itc',
    x_site: '@blog_itc',
    x_cardtype: 'summary_large_image',
    search_result_title: 'ITC Engineering Blog 検索結果',
  },
  blogs: {
    url: 'https://itc-engineering-blog.netlify.app/blogs',
    logo: '/ITC_Engineering_Blog2.png',
    logo_mini: '/ITC_Engineering_Blog3.png',
    comments: '/comments.png',
    title_suffix: '',
    type: 'article',
    authors: [{ author: 'https://itccorporation.jp' }],
    images: [
      {
        url: 'https://res.cloudinary.com/dt8zu6zzd/image/upload/Logo.png',
        width: 1200,
        height: 649,
        alt: 'ITC Engineering Blog',
      },
    ],
  },
  rss: {
    author: {
      name: '株式会社アイティーシー',
      email: 'tasho@itccorporation.jp',
      link: 'https://x.com/blog_itc',
    },
  },
};

export default settings;
