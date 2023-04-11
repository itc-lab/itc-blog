import redis from './redis';
import { CommentData } from 'types/interface';

import { reqInterface, resInterface } from 'pages/api/comment';

interface resData {
  id?: string;
  created_at?: number;
  url?: string;
  text?: string;
  name?: string;
}

export default async function fetchComment(
  req: reqInterface,
  res: resInterface
): Promise<unknown> {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ message: 'Missing parameter.' });
  }

  try {
    // get data
    const rawComments = await redis.lrange(url, 0, -1);

    // string data to object
    const comments = rawComments.map((c: string) => {
      const comment = <CommentData>JSON.parse(c);
      const resdata: resData = {
        id: comment.id,
        created_at: comment.created_at,
        url: comment.url,
        text: comment.text,
        name: comment.name,
      };
      return resdata;
    });

    return res.status(200).json(comments as resData);
  } catch (_) {
    return res.status(400).json({ message: 'Unexpected error occurred.' });
  }
}
