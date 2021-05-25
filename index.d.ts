export interface Category {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  revisedAt: Date;
  topics: string;
  logo: string;
  needs_title: boolean;
}

export interface Topic {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  revisedAt: Date;
  topics: string;
  logo: string;
  needs_title: boolean;
}

export interface Content {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  revisedAt: Date;
  title: string;
  category: Category;
  topics: Topic[];
  content: string;
  seo_description: string;
}

export interface RootObject {
  contents: Content[];
  totalCount: number;
  offset: number;
  limit: number;
}
