import redis from './redis';
import { nanoid } from 'nanoid';
import type { reqInterface, resInterface } from 'pages/api/comment';
import {
  COMMENT_NAME_MAX_LENGTH,
  COMMENT_RATE_LIMIT_MAX_REQUESTS,
  COMMENT_RATE_LIMIT_WINDOW_SECONDS,
  COMMENT_TEXT_MAX_LENGTH,
  getClientIp,
  isAllowedCommentUrl,
  pickString,
} from './commentHelpers';

export default async function createComments(
  req: reqInterface,
  res: resInterface,
): Promise<void> {
  const url = pickString(req.body?.url);
  const text = pickString(req.body?.text);
  const name = pickString(req.body?.name);

  if (!url || !text) {
    res.status(400).json({ message: 'Missing parameter.' });
    return;
  }

  if (!isAllowedCommentUrl(url)) {
    res.status(400).json({ message: 'Invalid URL.' });
    return;
  }

  if (text.length > COMMENT_TEXT_MAX_LENGTH) {
    res.status(400).json({
      message: `Comment text must be ${COMMENT_TEXT_MAX_LENGTH} characters or less.`,
    });
    return;
  }

  if (name !== undefined && name.length > COMMENT_NAME_MAX_LENGTH) {
    res.status(400).json({
      message: `Name must be ${COMMENT_NAME_MAX_LENGTH} characters or less.`,
    });
    return;
  }

  try {
    const clientIp = getClientIp(req);
    const rateLimitKey = `comment-rate:${clientIp}:${url}`;
    const requestCount = await redis.incr(rateLimitKey);

    if (requestCount === 1) {
      await redis.expire(rateLimitKey, COMMENT_RATE_LIMIT_WINDOW_SECONDS);
    }

    if (requestCount > COMMENT_RATE_LIMIT_MAX_REQUESTS) {
      res.status(429).json({
        message: 'Too many requests. Please try again later.',
      });
      return;
    }

    const comment = {
      id: nanoid(),
      created_at: Date.now(),
      url,
      text,
      name,
    };

    await redis.lpush(url, JSON.stringify(comment));

    res.status(200).json(comment);
  } catch {
    res.status(400).json({ message: 'Unexpected error occurred.' });
  }
}
