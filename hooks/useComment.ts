import { useState, Dispatch, SetStateAction } from 'react';
import useSWR from 'swr';
import { CommentData, Message } from 'types/interface';

async function getResponseMessage(
  response: Response,
): Promise<string | undefined> {
  try {
    const data = (await response.json()) as Message;
    return data.message;
  } catch {
    return undefined;
  }
}

export default function useComments(url: string): {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  comments: CommentData[] | Message | undefined;
  onSubmit: () => Promise<void>;
  onDelete: (comment: CommentData) => Promise<void>;
} {
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [commentAdminToken, setCommentAdminToken] = useState('');

  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: comments, mutate } = useSWR(() => {
    const query = new URLSearchParams({ url });
    return `/api/comment?${query.toString()}`;
  }, fetcher);

  const onSubmit = async () => {
    try {
      const response = await fetch('/api/comment', {
        method: 'POST',
        body: JSON.stringify({ url, text, name }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const message = await getResponseMessage(response);
        window.alert(message ?? 'コメントの投稿に失敗しました。');
        return;
      }

      setText('');
      setName('');
      await mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = async (comment: CommentData) => {
    let adminToken = commentAdminToken;

    if (!adminToken) {
      const inputToken = window.prompt(
        'コメント削除用の管理者トークンを入力してください。',
      );

      if (!inputToken) {
        return;
      }

      adminToken = inputToken.trim();

      if (!adminToken) {
        return;
      }

      setCommentAdminToken(adminToken);
    }

    try {
      const response = await fetch('/api/comment', {
        method: 'DELETE',
        body: JSON.stringify({ url, comment }),
        headers: {
          'Content-Type': 'application/json',
          'x-comment-admin-token': adminToken,
        },
      });

      if (!response.ok) {
        const message = await getResponseMessage(response);
        window.alert(message ?? 'コメントの削除に失敗しました。');

        if (response.status === 403) {
          setCommentAdminToken('');
        }

        return;
      }

      await mutate();
    } catch (err) {
      console.log(err);
    }
  };

  return {
    text,
    setText,
    name,
    setName,
    comments,
    onSubmit,
    onDelete,
  };
}
