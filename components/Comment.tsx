import React from 'react';
import Comment from './comment';

function CommentForm({ url }: { url: string }): JSX.Element {
  return (
    <div className="my-6 md:my-10 bg-white rounded-lg shadow py-10 text-base">
      <div className="max-w-screen-lg m-auto px-5 iphone:px-10"></div>
      <Comment url={url} />
    </div>
  );
}

export default CommentForm;
