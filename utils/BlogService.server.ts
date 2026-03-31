import { ProxyAgent } from 'undici';
import type { Dispatcher } from 'undici';
import type { IBlog, IBlogs, ITopic, MicroCmsResponse } from '../types';

const MICROCMS_MAX_LIMIT = 100;

export interface IBlogServiceServer {
  getBlogs(limit: number, page: number): Promise<IBlogs>;
  getBlogsNoContent(limit: number, page: number): Promise<IBlogs>;
  getBlogsByTopicId(
    limit: number,
    page: number,
    topicId: string,
  ): Promise<IBlogs>;
  getBlogsCount(): Promise<number>;
  getBlogsCountByTopicId(topicId: string): Promise<number>;
  getBlog(id: string): Promise<IBlog>;
  getTopics(): Promise<MicroCmsResponse<ITopic>>;
}

function getDispatcher() {
  const proxy =
    process.env.PROXY ||
    process.env.https_proxy ||
    process.env.http_proxy ||
    process.env.HTTPS_PROXY ||
    process.env.HTTP_PROXY;
  return proxy ? new ProxyAgent(proxy) : undefined;
}

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

function assertEnv() {
  if (!API_URL) throw new Error('Missing env: API_URL');
  if (!API_KEY) throw new Error('Missing env: API_KEY');
}

export class BlogServiceServer implements IBlogServiceServer {
  private createInit(): RequestInit & { dispatcher?: Dispatcher } {
    const dispatcher = getDispatcher();

    return {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-MICROCMS-API-KEY': API_KEY as string,
      },
      ...(dispatcher ? { dispatcher } : {}),
    };
  }

  private async fetchAllPages<T>(
    endpoint: string,
    query = '',
  ): Promise<MicroCmsResponse<T>> {
    assertEnv();

    const contents: T[] = [];
    let totalCount = 0;
    let offset = 0;

    do {
      const joiner = query ? '&' : '';
      const url = `${API_URL}${endpoint}?${query}${joiner}limit=${MICROCMS_MAX_LIMIT}&offset=${offset}`;
      const res = await fetch(url, this.createInit());
      const json = (await res.json()) as MicroCmsResponse<T>;

      contents.push(...json.contents);
      totalCount = json.totalCount;
      offset += json.contents.length;

      if (json.contents.length === 0) {
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

  async getBlogs(limit: number, page: number): Promise<IBlogs> {
    assertEnv();
    const offset = limit * (page - 1);
    const url = `${API_URL}blogs?limit=${limit}&offset=${offset}&orders=-publishedAt,-createdAt`;
    const res = await fetch(url, this.createInit());
    return await res.json();
  }

  async getBlogsNoContent(limit: number, page: number): Promise<IBlogs> {
    assertEnv();
    const offset = limit * (page - 1);
    const url = `${API_URL}blogs?fields=id,createdAt,publishedAt,revisedAt,updatedAt,title,topics&limit=${limit}&offset=${offset}&orders=-publishedAt,-createdAt`;
    const res = await fetch(url, this.createInit());
    return await res.json();
  }

  async getBlogsByTopicId(
    limit: number,
    page: number,
    topicId: string,
  ): Promise<IBlogs> {
    assertEnv();
    const offset = limit * (page - 1);
    const url = `${API_URL}blogs?filters=topics[contains]${topicId}&limit=${limit}&offset=${offset}&orders=-publishedAt,-createdAt`;
    const res = await fetch(url, this.createInit());
    return await res.json();
  }

  async getBlogsCount(): Promise<number> {
    assertEnv();
    const url = `${API_URL}blogs?limit=0`;
    const res = await fetch(url, this.createInit());
    const json = await res.json();
    return json.totalCount;
  }

  async getBlogsCountByTopicId(topicId: string): Promise<number> {
    assertEnv();
    const url = `${API_URL}blogs?filters=topics[contains]${topicId}&limit=0`;
    const res = await fetch(url, this.createInit());
    const json = await res.json();
    return json.totalCount;
  }

  async getBlog(id: string): Promise<IBlog> {
    assertEnv();
    const url = `${API_URL}blogs/${id}`;
    const res = await fetch(url, this.createInit());
    return await res.json();
  }

  async getTopics(): Promise<MicroCmsResponse<ITopic>> {
    return this.fetchAllPages<ITopic>('topics');
  }
}
