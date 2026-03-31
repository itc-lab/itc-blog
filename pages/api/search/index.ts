import type { NextApiRequest, NextApiResponse } from 'next';
import { fetch as undiciFetch, ProxyAgent } from 'undici';
import type { Dispatcher, RequestInit as UndiciRequestInit } from 'undici';

const headers: Record<string, string> = {
  'X-MICROCMS-API-KEY': process.env.API_KEY ?? '',
};

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

function mustEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

async function fetchJson<T>(url: string, init?: UndiciRequestInit): Promise<T> {
  const res = await undiciFetch(url, init);

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Request failed: ${res.status} ${res.statusText} ${body}`);
  }

  return (await res.json()) as T;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const raw = req.query.q;
  const q = Array.isArray(raw) ? raw[0] : raw;

  if (!q || typeof q !== 'string') {
    res.status(400).json({ error: 'missing queryparameter: q' });
    return;
  }

  try {
    const apiUrl = mustEnv('API_URL', process.env.API_URL);

    // Since pagination is not implemented, limit=100 is used.
    const url = `${apiUrl}contents?limit=100&q=${encodeURIComponent(q)}`;

    const data = await fetchJson<unknown>(url, opt);

    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
}
