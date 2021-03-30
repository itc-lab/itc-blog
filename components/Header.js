import React from 'react';
import Head from 'next/head';

export const Header = ({title}) => {
  return (
    <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        {/*viewport=スマホやタブレットのモバイル端末で最適にWeb表示させるため（Google推奨のレスポンシブWebデザイン適用時）に必要*/}
        {/*width=device-width=表示領域の幅で、端末画面の幅に合わせる指定*/}
        {/*initial-scale=1=初期のズーム倍率*/}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/*PWA=ホーム画面にアプリとして追加されたときの定義*/}
        <link rel="manifest" href="/site.webmanifest" />
        {/*apple-touch-icon=iPhoneやiPadのsafariや、AndroidでWebサイトをホーム画面に追加した時に表示される*/}
        <link rel="apple-touch-icon" href="/icon.png" />
        {/*theme-color=ブラウザの枠に色を付ける スマホ版Googleのみ #2563eb=bg-blue-600*/}
        <meta name="theme-color" content="#2563eb" />
    </Head>
  );
};
