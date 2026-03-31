import type { IBlog, MicroCmsResponse } from '@/types/interface';

export class BlogService {
  public async getBlogsByQuery(
    query: string,
  ): Promise<MicroCmsResponse<IBlog>> {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(
        `search api failed: ${res.status} ${res.statusText} ${text}`,
      );
    }

    return (await res.json()) as MicroCmsResponse<IBlog>;
  }
}
