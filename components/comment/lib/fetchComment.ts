import redis from './redis';
import type { CommentData } from 'types/interface';
import type { reqInterface, resInterface } from 'pages/api/comment';
import { isAllowedCommentUrl } from './commentHelpers';

interface ResData {
  id?: string;
  created_at?: number;
  url?: string;
  text?: string;
  name?: string;
}

function pickSingle(param: string | string[] | undefined): string | undefined {
  if (!param) return undefined;
  return Array.isArray(param) ? param[0] : param;
}

export default async function fetchComment(
  req: reqInterface,
  res: resInterface,
): Promise<void> {
  const url = pickSingle(req.query.url);

  if (!url || url.trim() === '') {
    res.status(400).json({ message: 'Missing parameter.' });
    return;
  }

  if (!isAllowedCommentUrl(url)) {
    res.status(400).json({ message: 'Invalid URL.' });
    return;
  }

  try {
    const rawComments = await redis.lrange(url, 0, -1);

    const comments: ResData[] = rawComments.map((c: string) => {
      const comment = JSON.parse(c) as CommentData;
      return {
        id: comment.id,
        created_at: comment.created_at,
        url: comment.url,
        text: comment.text,
        name: comment.name,
      };
    });

    res.status(200).json(comments);
  } catch {
    res.status(400).json({ message: 'Unexpected error occurred.' });
  }
}
