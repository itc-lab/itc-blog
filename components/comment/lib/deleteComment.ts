import { reqInterface, resInterface } from '@pages/api/comment';
import redis from './redis';

export default async function deleteComments(
  req: reqInterface,
  res: resInterface
): Promise<unknown> {
  const { url, comment } = req.body;

  if (!url || !comment) {
    return res.status(400).json({ message: 'Missing parameter.' });
  }

  try {
    // delete
    await redis.lrem(url, 0, JSON.stringify(comment));

    return res.status(200).json({ message: 'Success.' });
  } catch (err) {
    return res.status(400);
  }
}
