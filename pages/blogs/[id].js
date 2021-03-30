import { Layout } from "../../components/Layout";
import Tocbot from '../../components/Tocbot'
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '../../libs/Functions'
import { Markdown } from '../../components/Markdown';
import ReactTooltip from 'react-tooltip';
import Image from 'next/image';
import settings from '../../settings.yml'
import Jadate from "../../components/Jadate";
import { TwitterIcon } from "../../components/TwitterIcon";
import { HatenaIcon } from "../../components/HatenaIcon";
import { TopicsLinks } from "../../components/TopicsLinks";
import { Topics } from "../../components/Topics";
import Link from 'next/link';
import { ArticleFooter } from "../../components/ArticleFooter";
import getTweets from '../../lib/get-tweets';
import useMobileDevice from '../../hooks/useMobileDevice';
import MobileShare from '../../components/mobileShare';

export default function Home({ blog, tweets, tweets_id_data }) {
  const [isMobileOrTablet] = useMobileDevice();

  const [ isCheck, setCheckbox ]   = useState(false);

  const [isTooltipVisible, setTooltipVisibility] = useState(false);
  useEffect(() => {
    setTooltipVisibility(true);
  }, []);

  if (typeof window !== 'undefined') {
    const isBreakpoint = useMediaQuery(768);
    if ( !isBreakpoint && isCheck ) {setCheckbox(false);tocbot.refresh();}//isCheck = false;//ハンバーガーメニューＯＮのまま画面が大きくなったら、ハンバーガーメニューＯＦＦ。
    if ( isBreakpoint && !isCheck ) {tocbot.destroy();}//小さい画面かつ、ハンバーガーメニューＯＦＦの場合、tocbotをdestroy
  }

  const closeWithClickOutSideMethod = (e, setter) => {//目次の中、外のクリックを判定
    if (e.target === e.currentTarget) {//目次の外側をクリック
      tocbot.destroy();
      setter(false);//isCheck->false
    } else if (e.target.classList.contains('toc-link')) {//TOCのリンク部分をクリック
      //isCheck->false
      setTimeout( function() { tocbot.destroy();setter(false); }, 500 );//scrollSmoothDuration: 420,　スクロール中に描画が起きると、エラーになるため、描画遅延
    }
  };

  const scrollToTop = ()=> {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  const title = `${settings.blogs[0].description}${blog.title}`;
  const url = `${settings.blogs[0].url}/${blog.id}`;

  const twitter_param = "&text=" + encodeURIComponent(blog.title) + `&hashtags=${settings.general[0].hashtag}`;
  const twitter_href = `https://twitter.com/share?url=${url}${twitter_param}`;

  const hatena_param = "&title=" + encodeURIComponent(title);
  const hatena_href = `https://b.hatena.ne.jp/add?mode=confirm&url=${url}/${hatena_param}`;

  return (
    <>
      <Layout title={title} seo_data={blog} seo_url={`${settings.blogs[0].url}/${blog.id}`}>
        <nav className="sticky top-0 bg-blue-600 text-white z-50 border-t border-b border-l-0 border-r-0 border-gray-200">
          <div className="max-w-screen-xl m-auto px-10">
            <div className="flex items-center justify-between h-10">
              <div className="mr-4 flex-shrink-0 items-center" onClick={() => setCheckbox(false)}>
                <Link href={"/"} as={"/"}><a><img src={settings.blogs[0].logo} className="object-none"></img></a></Link>
              </div>
              <div className="flex-1 text-sm truncate">
                {blog.title}
              </div>
              {/* ハンバーガーメニュー md:=幅768px 以上の時は表示しない。*/}
              <div className="flex md:hidden items-center ml-2 flex-shrink-0">
                <input type="checkbox" id="toggle" checked={isCheck} onChange={() => setCheckbox(!isCheck)} />
                <label htmlFor="toggle" className="toggle-label">
                  <div className="hamburger-wrapper">目次
                    <div className="hamburger">
                      <div className="line"></div>
                      <div className="line"></div>
                      <div className="line"></div>
                    </div>
                  </div>
                </label>
                  {isCheck && (
                <div
                  className={`menuWrapper ${isCheck ? "menuWrapper__active" : ""}`}
                  onClick={(e) => {
                    closeWithClickOutSideMethod(e, setCheckbox);
                  }}
                >
                  <div className="menu iphone5se:mr-6 bg-white pt-5 px-5 pb-6 overflow-auto rounded-lg shadow-lg">
                    <div className="font-sans text-base leading-normal font-bold mb-3">[目次]</div>
                    <div className="toc js-toc" />
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </nav>

        <article className="bg-indigo-50">
          
          <header className="py-10">
            <div className="max-w-screen-xl m-auto px-10">
              <div className="relative text-center">
                {/* 最も関連する技術 */}
                {blog.category.needs_title && blog.category.topics}{/* ロゴに文字が無い場合、文字表示 */}
                <div className="flex items-center justify-center h-20">
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}><Image src={blog.category.logo} layout='fill' objectFit="contain"/></div>
                </div>
                {/* タイトル表示 */}
                <div className="inline-block text-left text-2xl iphone:text-3xl md:text-4xl mt-1 mb-0 leading-normal max-w-screen-md">
                  {blog.title}
                </div>
              </div>
              <div className="flex items-center justify-center text-center text-gray-500 text-xs iphone:text-sm mt-3 mb-0 -mr-2 -ml-2">
                <span className="mx-3 mt-1 inline-flex items-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  <span className="relative outline-none ml-1">
                    <Jadate date={blog.updatedAt} /> (更新)
                  </span>
                </span>
                <span className="mx-3 mt-1 inline-flex items-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  <span className="relative outline-none ml-1">
                    <Jadate date={blog.publishedAt} /> (公開)
                  </span>
                </span>
              </div>
            </div>
          </header>
          
          <div className="relative pb-2 max-w-screen-xl my-0 mx-auto pt-0 px-0 md:px-10">
            <div>
              <div className="hidden desktop:block absolute -left-5 w-12 h-full">
                <div className="sticky top-32 text-xs flex flex-col items-center justify-between left-div-h">
                  <div>
                    {/* ツイッターアイコン */}
                    <TwitterIcon twitter_href={twitter_href}/>
                  </div>
                  <div>
                    <Link href={"/"} as={"/"}>
                      <button onClick={() => scrollToTop()} data-tip="記事一覧へ遷移">
                        {/* 家のアイコン */}
                        <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                      </button>
                    </Link>
                  </div>
                  <div>
                    {/* はてなブックマークアイコン */}
                    <HatenaIcon hatena_href={hatena_href}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <section className="content-area m-0">
                <div className="bg-white rounded-lg shadow py-10 text-sm md:text-base">
                  <div className="max-w-screen-lg m-auto px-2 iphone:px-6 md:px-10">
                    <TopicsLinks topics={blog.topics}/>
                    <div id="toc-target-content">
                      <div className="js-toc-content overflow-hidden">
                        <Markdown source={blog.content} />
                      </div>
                    </div>
                    <div className="ml-5 mt-7 flex items-center desktop:hidden">
                      {/* ツイッターアイコン */}
                      <div className=""><TwitterIcon twitter_href={twitter_href}/></div>
                      {/* はてなブックマークアイコン */}
                      <div className="ml-5"><HatenaIcon hatena_href={hatena_href}/></div>
                      {/* シェア(共有)アイコン */}
                      {isMobileOrTablet && (<div className="ml-5"><MobileShare postTitle={title} siteTitle={title} /></div>)} 
                    </div>
                  </div>
                </div>
                <ArticleFooter tweets={tweets} tweets_id_data={tweets_id_data}/>
              </section>
              <aside className="hidden md:block md:w-81">
                <div className="h-full">
                  <Topics title="[関連技術]" topics={blog.topics}/>
                  {/* 目次は、md:=幅768px 未満になったら非表示にして、ハンバーガーメニューで対応*/}
                  <div className="sticky top-20 right-bottom-div-h flex flex-col">
                    {!isCheck && (
                    <div className="mt-6 bg-white pt-5 px-5 pb-6 overflow-auto rounded-lg shadow">
                      <div className="font-sans text-base leading-normal font-bold mb-3">[目次]</div>
                      <div className="toc js-toc" />
                    </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </article>
      </Layout>
      <Tocbot isCheck={isCheck}/>
      {isTooltipVisible && <ReactTooltip place="right" type="dark" effect="float"/>/*DOMがマウントされてから実装*/}
    </>
  )
}

export const getStaticProps = async content => {
  const id = content.params.id;

  const key = {
    headers: {'X-API-KEY': process.env.API_KEY},
  };
  const data = await fetch('https://itccorporation.microcms.io/api/v1/contents/' + id, key)
    .then(res => res.json())
    .catch(() => null);

  const tweets_id_data = await fetch(`https://itccorporation.microcms.io/api/v1/twitter?limit=9999&orders=-updatedAt`, key)
    .then(res => res.json())
    .catch(() => null);
  const twitter_ids = [];
  tweets_id_data.contents.forEach(content => twitter_ids.push(content.twitter_id));
  const tweets = await getTweets(twitter_ids);

  return {
    props: {
      blog: data,
      tweets,
      tweets_id_data: tweets_id_data.contents,
    },
  };
};

export const getStaticPaths = async () => {
  const key = {
    headers: {'X-API-KEY': process.env.API_KEY},
  };
  const data = await fetch('https://itccorporation.microcms.io/api/v1/contents?limit=9999&fields=id', key)
    .then(res => res.json())
    .catch(() => null);
  const paths = data.contents.map(content => `/blogs/${content.id}`);
  return {paths, fallback: false};
};
