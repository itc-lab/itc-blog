import redis from './redis';
import type { reqInterface, resInterface } from 'pages/api/comment';
import { isAllowedCommentUrl, pickString } from './commentHelpers';

export default async function deleteComments(
  req: reqInterface,
  res: resInterface,
): Promise<void> {
  const url = pickString(req.body?.url);
  const comment = req.body?.comment;

  if (!url || !comment) {
    res.status(400).json({ message: 'Missing parameter.' });
    return;
  }

  if (!isAllowedCommentUrl(url)) {
    res.status(400).json({ message: 'Invalid URL.' });
    return;
  }

  const serialized =
    typeof comment === 'string' ? comment : JSON.stringify(comment);

  try {
    await redis.lrem(url, 0, serialized);
    res.status(200).json({ message: 'Success.' });
  } catch {
    res.status(400).json({ message: 'Unexpected error occurred.' });
  }
}
