import React, { useState } from 'react';
import distanceToNow from './lib/dateRelative';
import { CommentData } from 'types/interface';

function CommentList({
  comments,
  onDelete,
}: {
  comments: CommentData[];
  onDelete: (comment: CommentData) => Promise<void>;
}): JSX.Element {
  const [isConfirm, setConfirm] = useState(false);
  const [delcomment, setDelData] = useState({
    id: '',
    url: '',
    created_at: 0,
    text: '',
    name: '',
  });

  const handleDeleteData = (comment: CommentData) => {
    setDelData(comment);
    setConfirm(true);
  };

  return (
    <div className="space-y-6 mt-10 -my-5">
      {comments !== undefined ? (
        comments.map((comment: CommentData) => {
          return (
            <div key={comment.created_at} className="flex space-x-4">
              <div className="flex-grow">
                <div className="flex space-x-2">
                  <b>{comment.name}</b>
                  <time className="text-gray-400 whitespace-nowrap">
                    {distanceToNow(comment.created_at)}
                  </time>
                  {process.env.NEXT_PUBLIC_MAINTENANCE_MODE ? (
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => handleDeleteData(comment)}
                      aria-label="Close">
                      x
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="whitespace-pre-wrap">{comment.text}</div>
              </div>
            </div>
          );
        })
      ) : (
        <></>
      )}
      {isConfirm && (
        <div
          style={{ margin: '0px', zIndex: 999 }}
          className={'bg-gray-200 bg-opacity-70 fixed inset-0 w-full h-full'}>
          <div className={'h-screen w-screen flex justify-center items-center'}>
            <div className={'rounded-xl bg-white'}>
              <div className={'m-5'}>コメントを削除しますか？</div>
              <div className={'text-right m-3'}>
                <button
                  className={
                    'py-2 px-4 rounded bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700  mx-1'
                  }
                  type="button"
                  onClick={() => {
                    onDelete(delcomment);
                    setConfirm(false);
                  }}>
                  削除
                </button>
                <button
                  className={
                    'py-2 px-4 border border-gray-300 rounded bg-white text-blue-700 disabled:opacity-40 hover:bg-gray-100 mx-1'
                  }
                  type="button"
                  onClick={() => setConfirm(false)}
                  autoFocus>
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentList;
