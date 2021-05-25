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
  }

  interface Image {
    url: string;
    width: number;
    height: number;
    alt: string;
  }

  interface Blog {
    url: string;
    logo: string;
    logo_mini: string;
    description: string;
    type: string;
    authors: string;
    images: Image[];
  }

  interface RootObject {
    general: General[];
    blogs: Blog[];
  }

  const data: RootObject;
  export default data;
}
