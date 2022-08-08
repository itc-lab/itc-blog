import React, { useState, Dispatch, SetStateAction } from 'react';
import settings from '../../settings.yml';

function CommentForm({
  text,
  setText,
  name,
  setName,
  onSubmit,
}: {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  onSubmit: () => Promise<void>;
}): JSX.Element {
  const [isConfirm, setConfirm] = useState(false);

  return (
    <div>
      <div
        className="p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800"
        role="alert">
        <span className="font-medium">
          コメント投稿機能です。以下のように投稿されます。
        </span>
        <img
          loading="lazy"
          className="mt-1"
          alt="comments example"
          src={
            (process.env.NEXT_PUBLIC_CDN_URL
              ? process.env.NEXT_PUBLIC_CDN_URL.replace(/\/$/, '')
              : '') +
            '/' +
            settings.blogs.comments.replace(/^\//, '')
          }></img>
      </div>
      <div
        className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
        role="alert">
        <span className="font-medium">
          個人情報に関わることは自己紹介であっても絶対に書き込まないでください。
          <br />
          その他、宣伝、誹謗中傷等、当方が不適切と判断した書き込みは、理由の如何を問わず、投稿者に断りなく削除します。
          <br />
          書き込み内容について、一切の責任を負いません。
          <br />
          このコメント機能は、予告無く廃止する可能性があります。ご了承ください。
          <br />
          コメントの削除をご依頼の場合はTwitterのDM等でご連絡ください。
        </span>
      </div>
      <textarea
        className="flex w-11/12 max-h-40 p-3 my-2 rounded resize-y bg-gray-200 text-gray-900 placeholder-gray-500"
        rows={3}
        placeholder={`この記事に関するあなたの意見や疑問、他の閲覧者にも役立つ補足情報などを投稿してください。`}
        onChange={(e) => setText(e.target.value)}
        value={text}
        disabled={false}
      />
      <textarea
        className="w-40 max-h-20 p-3 mt-2 my-2 rounded resize-y bg-gray-200 text-gray-900 placeholder-gray-500"
        rows={1}
        placeholder={`ニックネーム`}
        onChange={(e) => setName(e.target.value)}
        value={name}
        disabled={false}
      />
      <div
        className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
        role="alert">
        <span className="font-medium">
          個人情報に繋がる名前は入力しないでください。
        </span>
      </div>

      <div className="flex items-center mt-2">
        <div className="flex items-center space-x-6">
          <div>
            {text !== '' && name !== '' ? (
              <button
                className="py-2 px-4 rounded bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700"
                onClick={() => setConfirm(true)}>
                書き込む
              </button>
            ) : (
              <button className="py-2 px-4 rounded bg-gray-500 text-white disabled:opacity-40 disabled">
                書き込む
              </button>
            )}
            {isConfirm && (
              <div
                style={{ margin: '0px', zIndex: 999 }}
                className={
                  'bg-gray-200 bg-opacity-70 fixed inset-0 w-full h-full'
                }>
                <div
                  className={
                    'h-screen w-screen flex justify-center items-center'
                  }>
                  <div className={'rounded-xl bg-white'}>
                    <div className={'m-5'}>
                      <span className={'text-red-600 font-semibold'}>
                        一度書き込むと削除が行えません。
                      </span>
                      <br /> 本当に書き込みますか？
                    </div>
                    <div className={'text-right m-3'}>
                      <button
                        className={
                          'py-2 px-4 rounded bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700 mx-1'
                        }
                        type="button"
                        onClick={() => {
                          onSubmit();
                          setConfirm(false);
                        }}>
                        書き込む
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
        </div>
      </div>
    </div>
  );
}

export default CommentForm;
