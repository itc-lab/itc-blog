import { useState, Dispatch, SetStateAction } from 'react';
import useSWR from 'swr';
import { CommentData } from 'types/interface';

export default function useComments(url: string): {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  comments: CommentData[];
  onSubmit: () => Promise<void>;
  onDelete: (comment: CommentData) => Promise<void>;
} {
  const [text, setText] = useState('');
  const [name, setName] = useState('');

  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: comments, mutate } = useSWR(() => {
    const query = new URLSearchParams({ url });
    return `/api/comment?${query.toString()}`;
  }, fetcher);

  const onSubmit = async () => {
    try {
      await fetch('/api/comment', {
        method: 'POST',
        body: JSON.stringify({ url, text, name }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setText('');
      setName('');
      await mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = async (comment: CommentData) => {
    try {
      await fetch('/api/comment', {
        method: 'DELETE',
        body: JSON.stringify({ url, comment }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
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
