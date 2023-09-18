import { IBlog, ITopic, MicroCmsResponse } from '@/types/interface';
import { HttpsProxyAgent } from 'https-proxy-agent';

const header: HeadersInit = new Headers();
header.set('X-API-KEY', process.env.API_KEY || '');
const proxy = process.env.https_proxy;
const opt = proxy
  ? {
      headers: header,
      agent: new HttpsProxyAgent(proxy),
    }
  : {
      headers: header,
    };

/**
 * blog取得用サービスのインターフェース
 */
export interface IBlogService {
  /**
   * contentsを取得します
   * @param limit 一ページあたりの表示件数
   * @param page ページ
   */
  getBlogs(limit: number, page?: number): Promise<MicroCmsResponse<IBlog>>;

  /**
   * 記事本文を除くcontentsを取得します
   * @param limit 一ページあたりの表示件数
   * @param page ページ
   */
  getBlogsNoContent(limit: number, page?: number): Promise<MicroCmsResponse<IBlog>>;

  /**
   * ブログを一件取得します。
   * @param id 記事ID
   */
  getBlogById(id?: string): Promise<IBlog>;

  /**
   * ブログのIDだけを取得します
   */
  getBlogsIds(): Promise<MicroCmsResponse<{ id: string }>>;

  /**
   * contentsの全件数を取得します
   */
  getBlogsCount(): Promise<number>;

  /**
   * 関連技術で絞ったblogを取得します
   * @param limit 上限
   * @param page ページNumber
   * @param topic_id カテゴリーID
   */
  getBlogsByTopicId(
    limit: number,
    page: number,
    topic_id: string
  ): Promise<MicroCmsResponse<IBlog>>;

  /**
   * 関連技術で絞ったblogの件数を取得します
   * @param topic_id カテゴリーID
   */
  getBlogsCountByTopicId(topic_id: string): Promise<number>;

  /**
   * 関連技術を取得します
   */
  getTopics(): Promise<MicroCmsResponse<ITopic>>;

  /**
   * 関連技術のIDだけを取得します
   */
  getTopicsIds(): Promise<MicroCmsResponse<{ id: string }>>;

  /**
   * topic_idに合致する関連技術データを取得します
   * @param topic_id 関連技術ID
   */
  getTopicById(topic_id: string): Promise<ITopic>;

  /**
   * クエリで絞ったblogを取得します。
   * @param query クエリ
   */
  getBlogsByQuery(query: string): Promise<MicroCmsResponse<IBlog>>;
}

export class BlogService implements IBlogService {
  public async getBlogsNoContent(
    limit: number,
    page: number
  ): Promise<MicroCmsResponse<IBlog>> {
    const offset = page ? (page - 1) * limit : 0;
    return await fetch(
      `${process.env.API_URL}contents?offset=${offset}&limit=${limit}&orders=-publishedAt&fields=id,reflect_updatedAt,updatedAt,reflect_revisedAt,revisedAt,publishedAt,title,description`,
      opt
    )
      .then((res) => res.json())
      .catch(() => null);
  }

  public async getBlogs(
    limit: number,
    page: number
  ): Promise<MicroCmsResponse<IBlog>> {
    const offset = page ? (page - 1) * limit : 0;
    return await fetch(
      `${process.env.API_URL}contents?offset=${offset}&limit=${limit}&orders=-publishedAt`,
      opt
    )
      .then((res) => res.json())
      .catch(() => null);
  }

  public async getBlogById(id?: string): Promise<IBlog> {
    return await fetch(`${process.env.API_URL}contents/${id}`, opt)
      .then((res) => res.json())
      .catch(() => null);
  }

  public async getBlogsIds(): Promise<MicroCmsResponse<{ id: string }>> {
    return await fetch(
      `${process.env.API_URL}contents?limit=9999&fields=id`,
      opt
    )
      .then((res) => res.json())
      .catch(() => null);
  }

  public async getBlogsCount(): Promise<number> {
    const data = await fetch(`${process.env.API_URL}contents/?limit=0`, opt)
      .then((res) => res.json())
      .catch(() => null);
    return data.totalCount as number;
  }

  public async getBlogsByTopicId(
    limit: number,
    page: number,
    topic_id: string
  ): Promise<MicroCmsResponse<IBlog>> {
    const offset = page ? (page - 1) * limit : 0;
    return await fetch(
      `${process.env.API_URL}contents?offset=${offset}&limit=${limit}&filters=topics[contains]${topic_id}`,
      opt
    )
      .then((res) => res.json())
      .catch(() => null);
  }

  public async getBlogsCountByTopicId(topic_id: string): Promise<number> {
    const data = await fetch(
      `${process.env.API_URL}contents?limit=0&filters=topics[contains]${topic_id}`,
      opt
    )
      .then((res) => res.json())
      .catch(() => null);
    return data.totalCount as number;
  }

  public async getTopicById(topic_id: string): Promise<ITopic> {
    return await fetch(`${process.env.API_URL}topics/${topic_id}`, opt)
      .then((res) => res.json())
      .catch(() => null);
  }

  public async getTopics(): Promise<MicroCmsResponse<ITopic>> {
    return await fetch(`${process.env.API_URL}topics?limit=9999`, opt)
      .then((res) => res.json())
      .catch(() => null);
  }

  public async getTopicsIds(): Promise<MicroCmsResponse<{ id: string }>> {
    return await fetch(`${process.env.API_URL}topics?limit=9999&fields=id`, opt)
      .then((res) => res.json())
      .catch(() => null);
  }

  public async getBlogsByQuery(
    query: string
  ): Promise<MicroCmsResponse<IBlog>> {
    return await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/search?q=${encodeURIComponent(
        query
      )}`
    )
      .then((res) => {
        return res.json();
      })
      .catch(() => null);
  }
}
