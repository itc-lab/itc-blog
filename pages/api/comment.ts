import fetchComment from '../../components/comment/lib/fetchComment';
import createComments from '../../components/comment/lib/createComment';
import deleteComments from '../../components/comment/lib/deleteComment';

export interface reqInterface {
  method?: unknown;
  body: {
    id: string;
    url: string;
    created_at: number;
    text: string;
    name: string;
    comment: string;
  };
  query: { url: string };
}

export interface resInterface {
  status: (arg0: number) => {
    (): unknown;
    new (): unknown;
    json: {
      (arg0: {
        message?: string;
        id?: string;
        created_at?: number;
        url?: string;
        text?: string;
        name?: string;
      }): unknown;
      new (): unknown;
    };
  };
}

export default async function handler(
  req: reqInterface,
  res: resInterface
): Promise<unknown> {
  switch (req.method) {
    case 'GET':
      return fetchComment(req, res);
    case 'POST':
      return createComments(req, res);
    case 'DELETE':
      return deleteComments(req, res);
    default:
      return res.status(400).json({ message: 'Invalid method.' });
  }
}
