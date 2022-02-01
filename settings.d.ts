declare module '*.yml' {
  interface General {
    url: string;
    name: string;
    description: string;
    logo: string;
    hashtag: string;
    per_page: number;
    github: string;
    company_name: string;
    company_logo: string;
    company_url: string;
    twitter_handle: string;
    twitter_site: string;
    twitter_cardtype: string;
    search_result_title: string;
  }

  interface Image {
    url: string;
    width: number;
    height: number;
    alt: string;
  }

  interface Authors {
    author: string;
  }

  interface Blog {
    url: string;
    logo: string;
    logo_mini: string;
    description: string;
    type: string;
    authors: Authors[];
    images: Image[];
  }

  interface RSS {
    author: {
      name: string;
      email: string;
      link: string;
    };
  }

  interface RootObject {
    general: General;
    blogs: Blog;
    rss: RSS;
  }

  const data: RootObject;
  export default data;
}
