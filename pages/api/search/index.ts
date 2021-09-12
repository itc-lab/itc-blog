import { NextApiRequest, NextApiResponse } from 'next';
import { HttpsProxyAgent } from 'https-proxy-agent';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const query: string | string[] = req.query.q;
  if (!query) {
    res.status(400).json({ error: `missing queryparamaeter` });
  }
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
  return await fetch(
    //ページネーション未実装のため、limit=100
    `${process.env.API_URL}contents?limit=100&q=${encodeURIComponent(
      query as string
    )}`,
    opt
  )
    .then(async (data) => {
      res.status(200).json(await data.json());
    })
    .catch(async (error) => {
      res.status(500).json(await error.json());
    });
};
