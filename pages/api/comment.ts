import type { NextApiRequest, NextApiResponse } from 'next';
import fetchComment from '../../components/comment/lib/fetchComment';
import createComments from '../../components/comment/lib/createComment';
import deleteComments from '../../components/comment/lib/deleteComment';
import { pickHeaderString } from '../../components/comment/lib/commentHelpers';

export type reqInterface = NextApiRequest & {
  body: {
    id?: string;
    url?: string;
    created_at?: number;
    text?: string;
    name?: string;
    comment?: string;
  };
  query: NextApiRequest['query'] & {
    url?: string | string[];
  };
};

export type resInterface = NextApiResponse;

export default async function handler(
  req: reqInterface,
  res: resInterface,
): Promise<void> {
  switch (req.method) {
    case 'GET':
      await fetchComment(req, res);
      return;

    case 'POST':
      await createComments(req, res);
      return;

    case 'DELETE': {
      const adminToken = pickHeaderString(req.headers['x-comment-admin-token']);

      if (
        !process.env.COMMENT_ADMIN_TOKEN ||
        !adminToken ||
        adminToken !== process.env.COMMENT_ADMIN_TOKEN
      ) {
        res.status(403).json({ message: 'Forbidden.' });
        return;
      }

      await deleteComments(req, res);
      return;
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).json({ message: 'Method Not Allowed' });
      return;
  }
}
