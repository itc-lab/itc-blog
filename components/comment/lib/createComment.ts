import redis from './redis';
import { nanoid } from 'nanoid';
import { reqInterface, resInterface } from '../../../pages/api/comment';

export default async function createComments(
  req: reqInterface,
  res: resInterface
): Promise<unknown> {
  const { url, text, name } = req.body;

  if (!url || !text) {
    return res.status(400).json({ message: 'Missing parameter.' });
  }

  try {
    const comment = {
      id: nanoid(),
      created_at: Date.now(),
      url,
      text,
      name,
    };

    // write data
    await redis.lpush(url, JSON.stringify(comment));

    return res.status(200).json(comment);
  } catch (_) {
    return res.status(400).json({ message: 'Unexpected error occurred.' });
  }
}
