import { IBlog, ITopic, MicroCmsResponse } from '@/types/interface';
import { fetch as undiciFetch, ProxyAgent } from 'undici';
import type { Dispatcher, RequestInit as UndiciRequestInit } from 'undici';

const headers: Record<string, string> = {
  'X-MICROCMS-API-KEY': process.env.API_KEY ?? '',
};

const microCmsContentUrlReplaceFrom =
  process.env.CMS_CONTENT_URL_REPLACE_FROM ?? '';

const microCmsContentUrlReplaceTo =
  process.env.CMS_CONTENT_URL_REPLACE_TO ?? '';

const proxy =
  process.env.HTTPS_PROXY ??
  process.env.https_proxy ??
  process.env.HTTP_PROXY ??
  process.env.http_proxy ??
  '';

const dispatcher: Dispatcher | undefined = proxy
  ? new ProxyAgent(proxy)
  : undefined;

const opt: UndiciRequestInit = dispatcher
  ? { headers, dispatcher }
  : { headers };

const MICROCMS_MAX_LIMIT = 100;
const BLOG_NO_CONTENT_FIELDS =
  'id,reflect_updatedAt,updatedAt,reflect_revisedAt,revisedAt,publishedAt,title,description';

function replaceMicroCmsContentUrlsInString(value: string): string {
  if (
    !microCmsContentUrlReplaceFrom ||
    !microCmsContentUrlReplaceTo ||
    microCmsContentUrlReplaceFrom === microCmsContentUrlReplaceTo
  ) {
    return value;
  }

  return value
    .split(microCmsContentUrlReplaceFrom)
    .join(microCmsContentUrlReplaceTo);
}

function replaceMicroCmsContentUrlsDeep<T>(value: T): T {
  if (typeof value === 'string') {
    return replaceMicroCmsContentUrlsInString(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceMicroCmsContentUrlsDeep(item)) as T;
  }

  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(
      value as Record<string, unknown>,
    )) {
      result[key] = replaceMicroCmsContentUrlsDeep(item);
    }

    return result as T;
  }

  return value;
}

async function fetchJson<T>(url: string, init?: UndiciRequestInit): Promise<T> {
  const res = await undiciFetch(url, init);

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Request failed: ${res.status} ${res.statusText} ${body}`);
  }

  const data = (await res.json()) as T;
  return replaceMicroCmsContentUrlsDeep(data);
}

/**
 * Interface for the blog service
 */
export interface IBlogService {
  /**
   * Retrieves blog posts
   * @param limit Number of items per page
   * @param page Page number
   */
  getBlogs(limit: number, page?: number): Promise<MicroCmsResponse<IBlog>>;

  /**
   * Retrieves blog posts without article content
   * @param limit Number of items per page
   * @param page Page number
   */
  getBlogsNoContent(
    limit: number,
    page?: number,
  ): Promise<MicroCmsResponse<IBlog>>;

  /**
   * Retrieves all blog posts without article content
   */
  getAllBlogsNoContent(): Promise<MicroCmsResponse<IBlog>>;

  /**
   * Retrieves a single blog post
   * @param id Article ID
   */
  getBlogById(id?: string): Promise<IBlog>;

  /**
   * Retrieves blog IDs only
   */
  getBlogsIds(): Promise<MicroCmsResponse<{ id: string }>>;

  /**
   * Retrieves the total number of blog posts
   */
  getBlogsCount(): Promise<number>;

  /**
   * Retrieves blog posts filtered by topic
   * @param limit Maximum number of items
   * @param page Page number
   * @param topic_id Topic ID
   */
  getBlogsByTopicId(
    limit: number,
    page: number,
    topic_id: string,
  ): Promise<MicroCmsResponse<IBlog>>;

  /**
   * Retrieves the number of blog posts filtered by topic
   * @param topic_id Topic ID
   */
  getBlogsCountByTopicId(topic_id: string): Promise<number>;

  /**
   * Retrieves topics
   */
  getTopics(): Promise<MicroCmsResponse<ITopic>>;

  /**
   * Retrieves topic IDs only
   */
  getTopicsIds(): Promise<MicroCmsResponse<{ id: string }>>;

  /**
   * Retrieves topic data for the given topic_id
   * @param topic_id Topic ID
   */
  getTopicById(topic_id: string): Promise<ITopic>;

  /**
   * Retrieves blog posts filtered by query
   * @param query Search query
   */
  getBlogsByQuery(query: string): Promise<MicroCmsResponse<IBlog>>;
}

export class BlogService implements IBlogService {
  private async fetchAllPages<T>(
    endpoint: string,
    query: Record<string, string> = {},
  ): Promise<MicroCmsResponse<T>> {
    const contents: T[] = [];
    let totalCount = 0;
    let offset = 0;

    do {
      const params = new URLSearchParams({
        ...query,
        offset: String(offset),
        limit: String(MICROCMS_MAX_LIMIT),
      });
      const separator = endpoint.includes('?') ? '&' : '?';
      const url = `${process.env.API_URL}${endpoint}${separator}${params.toString()}`;
      const response = await fetchJson<MicroCmsResponse<T>>(url, opt);

      contents.push(...response.contents);
      totalCount = response.totalCount;
      offset += response.contents.length;

      if (response.contents.length === 0) {
        break;
      }
    } while (offset < totalCount);

    return {
      contents,
      totalCount,
      offset: 0,
      limit: contents.length,
    };
  }

  public async getBlogsNoContent(
    limit: number,
    page?: number,
  ): Promise<MicroCmsResponse<IBlog>> {
    const offset = page ? (page - 1) * limit : 0;

    const url =
      `${process.env.API_URL}contents?offset=${offset}&limit=${limit}` +
      `&orders=-publishedAt&fields=${BLOG_NO_CONTENT_FIELDS}`;

    return fetchJson<MicroCmsResponse<IBlog>>(url, opt);
  }

  public async getAllBlogsNoContent(): Promise<MicroCmsResponse<IBlog>> {
    return this.fetchAllPages<IBlog>('contents', {
      orders: '-publishedAt',
      fields: BLOG_NO_CONTENT_FIELDS,
    });
  }

  public async getBlogs(
    limit: number,
    page?: number,
  ): Promise<MicroCmsResponse<IBlog>> {
    const offset = page ? (page - 1) * limit : 0;

    const url =
      `${process.env.API_URL}contents?offset=${offset}&limit=${limit}` +
      `&orders=-publishedAt`;

    return fetchJson<MicroCmsResponse<IBlog>>(url, opt);
  }

  public async getBlogById(id?: string): Promise<IBlog> {
    if (!id) {
      throw new Error('id is required');
    }

    const url = `${process.env.API_URL}contents/${id}`;
    return fetchJson<IBlog>(url, opt);
  }

  public async getBlogsIds(): Promise<MicroCmsResponse<{ id: string }>> {
    return this.fetchAllPages<{ id: string }>('contents', { fields: 'id' });
  }

  public async getBlogsCount(): Promise<number> {
    const url = `${process.env.API_URL}contents/?limit=0`;
    const data = await fetchJson<MicroCmsResponse<unknown>>(url, opt);
    return data.totalCount as number;
  }

  public async getBlogsByTopicId(
    limit: number,
    page: number,
    topic_id: string,
  ): Promise<MicroCmsResponse<IBlog>> {
    const offset = page ? (page - 1) * limit : 0;

    const url =
      `${process.env.API_URL}contents?offset=${offset}&limit=${limit}` +
      `&filters=topics[contains]${topic_id}`;

    return fetchJson<MicroCmsResponse<IBlog>>(url, opt);
  }

  public async getBlogsCountByTopicId(topic_id: string): Promise<number> {
    const url =
      `${process.env.API_URL}contents?limit=0` +
      `&filters=topics[contains]${topic_id}`;

    const data = await fetchJson<MicroCmsResponse<unknown>>(url, opt);
    return data.totalCount as number;
  }

  public async getTopicById(topic_id: string): Promise<ITopic> {
    const url = `${process.env.API_URL}topics/${topic_id}`;
    return fetchJson<ITopic>(url, opt);
  }

  public async getTopics(): Promise<MicroCmsResponse<ITopic>> {
    return this.fetchAllPages<ITopic>('topics');
  }

  public async getTopicsIds(): Promise<MicroCmsResponse<{ id: string }>> {
    return this.fetchAllPages<{ id: string }>('topics', { fields: 'id' });
  }

  public async getBlogsByQuery(
    query: string,
  ): Promise<MicroCmsResponse<IBlog>> {
    const url = `${
      process.env.NEXT_PUBLIC_BASEURL
    }/api/search?q=${encodeURIComponent(query)}`;

    return fetchJson<MicroCmsResponse<IBlog>>(url, opt);
  }
}
