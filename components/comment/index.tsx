import React from 'react';
import CommentForm from './form';
import CommentList from './list';
import useComments from '../../hooks/useComment';

function Comment(): JSX.Element {
  const { text, setText, name, setName, comments, onSubmit, onDelete } =
    useComments();

  return (
    <div className="mx-8">
      <CommentForm
        onSubmit={onSubmit}
        text={text}
        setText={setText}
        name={name}
        setName={setName}
      />
      <CommentList comments={comments} onDelete={onDelete} />
    </div>
  );
}

export default Comment;
