import React, { useEffect, useState } from 'react';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { Layout } from '../../components/Layout';
import Tocbot from '../../components/Tocbot';
import { useMediaQuery } from '../../libs/Functions';
import { Markdown } from '../../components/Markdown';
import ReactTooltip from 'react-tooltip';
import '../../settings.d.ts';
import settings from '../../settings.yml';
import { Jadate } from '../../components/Jadate';
import { TwitterIcon } from '../../components/TwitterIcon';
import { HatenaIcon } from '../../components/HatenaIcon';
import { TopicsLinks } from '../../components/TopicsLinks';
import { Topics } from '../../components/Topics';
import Link from 'next/link';
import { ArticleFooter } from '../../components/ArticleFooter';
import CommentForm from '../../components/Comment';
import { fetchTweetAst } from '../../components/FetchTweetAst';
import useMobileDevice from '../../hooks/useMobileDevice';
import MobileShare from '../../components/mobileShare';
import tocbot from 'tocbot';
import { useRouter } from 'next/dist/client/router';
import { BlogService, IBlogService } from '@utils/BlogService';
import { IBlog, ITweet, MicroCmsResponse } from '@types';
import { BreadCrumbs } from '../../components/BreadCrumbs';

interface Props {
  blog: IBlog;
  tweets: { id: string; ast: unknown }[];
}

type Slug = {
  id: string;
};

const Page: NextPage<Props> = ({ blog, tweets }) => {
  const [isMobileOrTablet] = useMobileDevice();

  const [isCheck, setCheckbox] = useState(false);
  const [isSearchModal, setSearchModal] = useState(false);

  const [isTooltipVisible, setTooltipVisibility] = useState(false);
  useEffect(() => {
    setTooltipVisibility(true);
  }, []);

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isBreakpoint = useMediaQuery(1024);
    if (!isBreakpoint && isCheck) {
      setCheckbox(false);
      tocbot.refresh();
    }
    if (isBreakpoint && !isCheck) {
      tocbot.destroy();
    }
  }

  const closeWithClickOutSideMethod = (
    //e: React.MouseEvent<HTMLElement>,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    setter: {
      (value: React.SetStateAction<boolean>): void;
      (arg0: boolean): void;
    }
  ) => {
    if (e.target === e.currentTarget) {
      tocbot.destroy();
      setter(false);
    } else if ((e.target as Element).classList.contains('toc-link')) {
      setTimeout(function () {
        tocbot.destroy();
        setter(false);
      }, 500); //スクロール中に描画が起きると、エラーになるため、描画遅延
    }
  };

  const router = useRouter();
  const onEnterKeyEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value.trim()) {
      return;
    }
    if (e.key === 'Enter') {
      router.push(`/search?q=${e.currentTarget.value}`);
    }
  };
  const onClickSearchButton = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const { value } = (e.currentTarget as HTMLButtonElement)
      .previousElementSibling as HTMLInputElement;
    if (!value.trim()) {
      return;
    }
    router.push(`/search?q=${value}`);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const title = `${blog.title}${settings.blogs.title_suffix}`;
  const url = `${settings.blogs.url}/${blog.id}`;

  const twitter_param =
    '&text=' +
    encodeURIComponent(blog.title) +
    `&hashtags=${settings.general.hashtag}`;
  const twitter_href = `https://twitter.com/share?url=${url}${twitter_param}`;

  const hatena_href = 'https://b.hatena.ne.jp/entry/' + encodeURIComponent(url);
  const hatena_title = encodeURIComponent(title);

  const update_timestamp =
    (blog.reflect_updatedAt && blog.updatedAt) ||
    (blog.reflect_revisedAt && blog.revisedAt) ||
    blog.publishedAt;

  return (
    <>
      <Layout
        title={title}
        seo_data={blog}
        seo_url={`${settings.blogs.url}/${blog.id}`}>
        <nav className="sticky top-0 bg-blue-600 text-white z-50 border-t border-b border-l-0 border-r-0 border-gray-200">
          <div className="max-w-screen-xl px-1 iphone:px-8 md:px-9 mx-auto">
            <div className="flex items-center h-10 justify-between">
              <Link href={'/'} as={'/'} prefetch={false}>
                <a className="hidden lg:flex h-full">
                  <div
                    className="relative"
                    style={{
                      width: '230px',
                      height: '80%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}>
                    <img
                      loading="lazy"
                      className="w-full h-full object-contain"
                      style={{
                        display: 'block',
                      }}
                      alt="navbar logo"
                      src={
                        (process.env.NEXT_PUBLIC_CDN_URL
                          ? process.env.NEXT_PUBLIC_CDN_URL.replace(/\/$/, '')
                          : '') +
                        '/' +
                        settings.blogs.logo.replace(/^\//, '')
                      }></img>
                  </div>
                </a>
              </Link>
              <Link href={'/'} as={'/'} prefetch={false}>
                <a
                  className="relative lg:hidden"
                  style={{
                    width: '45px',
                    height: '70%',
                  }}>
                  <div
                    className="relative h-full"
                    onClick={() => setCheckbox(false)}>
                    <img
                      loading="lazy"
                      className="w-full h-full object-contain"
                      style={{
                        display: 'block',
                      }}
                      alt="navbar logo mini"
                      src={
                        (process.env.NEXT_PUBLIC_CDN_URL
                          ? process.env.NEXT_PUBLIC_CDN_URL.replace(/\/$/, '')
                          : '') +
                        '/' +
                        settings.blogs.logo_mini.replace(/^\//, '')
                      }></img>
                  </div>
                </a>
              </Link>

              <div className="ml-1 iphone:ml-2 md:ml-6 flex-1 text-sm truncate">
                {blog.title}
              </div>
              {/* サイト内検索 */}
              <div className="hidden lg:flex border-2 rounded focus-within:ring focus-within:border-blue-300 text-gray-600 focus-within:text-black h-3/4">
                <input
                  type="text"
                  className="px-2 py-2 w-48 text-black text-sm border-0 rounded-none focus:outline-none"
                  placeholder="サイト内検索"
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    onEnterKeyEvent(e)
                  }
                />
                <button
                  className="flex items-center justify-center px-3 border-0 bg-white"
                  onClick={(e) => onClickSearchButton(e)}>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                  </svg>
                </button>
              </div>
              <div
                className="flex lg:hidden items-center mr-1"
                onClick={() => setSearchModal(true)}>
                <svg
                  className="w-6 h-6 text-white cursor-pointer"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24">
                  <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                </svg>
              </div>
              {/* ハンバーガーメニュー lg:=幅1024px 以上の時は表示しない。*/}
              <div className="flex lg:hidden items-center ml-2 pr-4 flex-shrink-0">
                <input
                  type="checkbox"
                  id="toggle"
                  checked={isCheck}
                  onChange={() => setCheckbox(!isCheck)}
                />
                <label htmlFor="toggle" className="toggle-label">
                  <div className="hamburger-wrapper">
                    目次
                    <div className="hamburger">
                      <div className="line"></div>
                      <div className="line"></div>
                      <div className="line"></div>
                    </div>
                  </div>
                </label>
                {isCheck && (
                  <div
                    className={`menuWrapper ${
                      isCheck ? 'menuWrapper__active' : ''
                    }`}
                    onClick={(e) => {
                      closeWithClickOutSideMethod(e, setCheckbox);
                    }}>
                    <div className="menu iphone5se:mr-6 bg-white pt-5 px-5 pb-6 overflow-auto rounded-lg shadow-lg">
                      <div className="font-sans text-base leading-normal font-bold mb-3">
                        [目次]
                      </div>
                      <div className="toc js-toc" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {isSearchModal && (
          <div
            className={`menuWrapper ${
              isSearchModal ? 'menuWrapper__active' : ''
            }`}
            onClick={(e) => {
              closeWithClickOutSideMethod(e, setSearchModal);
            }}>
            <form
              className="block absolute top-12 right-0 left-0 z-50 w-11/12 my-0 mx-auto"
              action="/search"
              method="get">
              <input
                type="text"
                className="w-full h-11 border border-solid border-gray-200 bg-white shadow text-base pl-2"
                autoComplete="off"
                placeholder="サイト内検索"
                defaultValue=""
                name="q"
              />
            </form>
          </div>
        )}

        <article className="bg-indigo-50">
          <header className="pb-10">
            <div className="max-w-screen-xl h-10 ml-auto mr-auto px-2 iphone:px-10 md:px-11">
              <div className="relative text-center">
                <BreadCrumbs
                  breadcrumbslist={[
                    {
                      contents: '記事一覧',
                      path: '/',
                    },
                    {
                      contents: 'ブログ記事',
                      path: '/',
                    },
                  ]}
                />
              </div>
            </div>
            <div className="max-w-screen-xl m-auto px-10">
              <div className="relative text-center">
                {/* 最も関連する技術 */}
                {blog.category.needs_title && blog.category.topics}
                {/* ロゴに文字が無い場合、文字表示 */}
                <div className="flex items-center justify-center h-20">
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                    }}>
                    <img
                      loading="lazy"
                      className="w-full h-full object-contain"
                      style={{
                        display: 'block',
                      }}
                      alt="category logo"
                      src={
                        (process.env.NEXT_PUBLIC_CDN_URL
                          ? process.env.NEXT_PUBLIC_CDN_URL.replace(/\/$/, '')
                          : '') +
                        '/' +
                        blog.category.logo.replace(/^\//, '')
                      }></img>
                  </div>
                </div>
                {/* タイトル表示 */}
                <h1 className="inline-block text-left text-2xl iphone:text-3xl md:text-4xl mt-1 mb-0 leading-normal max-w-screen-md">
                  {blog.title}
                </h1>
              </div>
              <div className="flex items-center justify-center text-center text-gray-500 text-xs iphone:text-sm mt-3 mb-0 -mr-2 -ml-2">
                <span className="mx-3 mt-1 inline-flex items-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <span className="relative outline-none ml-1">
                    <Jadate date={update_timestamp} /> (更新)
                  </span>
                </span>
                <span className="mx-3 mt-1 inline-flex items-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
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
                    <TwitterIcon twitter_href={twitter_href} />
                  </div>
                  <div>
                    <Link href={'/'} as={'/'} prefetch={false}>
                      <button
                        onClick={() => scrollToTop()}
                        data-tip="記事一覧へ遷移">
                        {/* 家のアイコン */}
                        <svg
                          className="w-7 h-7 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          width="32"
                          height="32">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                      </button>
                    </Link>
                  </div>
                  <div>
                    {/* はてなブックマークアイコン */}
                    <HatenaIcon
                      hatena_href={hatena_href}
                      hatena_title={hatena_title}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <section className="content-area m-0">
                <div className="bg-white rounded-lg shadow pt-3 pb-8 md:pt-5 md:pb-10 lg:pt-10 lg:pb-10 text-sm md:text-base">
                  <div className="max-w-screen-lg m-auto px-2 iphone:px-6 md:px-10">
                    <TopicsLinks topics={blog.topics} />
                    <div id="toc-target-content">
                      <div className="js-toc-content overflow-hidden">
                        <Markdown source={blog.content} />
                      </div>
                    </div>
                    <div className="ml-5 mt-7 flex items-center desktop:hidden">
                      {/* ツイッターアイコン */}
                      <div className="">
                        <TwitterIcon twitter_href={twitter_href} />
                      </div>
                      {/* はてなブックマークアイコン */}
                      <div className="ml-5">
                        <HatenaIcon
                          hatena_title={hatena_title}
                          hatena_href={hatena_href}
                        />
                      </div>
                      {/* シェア(共有)アイコン */}
                      {isMobileOrTablet && (
                        <div className="ml-5">
                          <MobileShare postTitle={title} siteTitle={title} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <CommentForm url={url} />
                <ArticleFooter tweets={tweets} />
              </section>
              <aside className="hidden lg:block lg:w-81">
                <div className="h-full">
                  <Topics title="[関連技術]" topics={blog.topics} />
                  {/* 目次は、lg:=幅1024px 未満になったら非表示にして、ハンバーガーメニューで対応*/}
                  <div className="sticky top-20 right-bottom-div-h flex flex-col">
                    {!isCheck && (
                      <div className="mt-6 bg-white pt-5 px-5 pb-6 overflow-auto rounded-lg shadow">
                        <div className="font-sans text-base leading-normal font-bold mb-3">
                          [目次]
                        </div>
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
      <Tocbot />
      {
        isTooltipVisible && (
          <ReactTooltip place="right" type="dark" effect="float" />
        ) /*DOMがマウントされてから実装*/
      }
    </>
  );
};

export const getStaticProps: GetStaticProps<Props, Slug> = async ({
  params,
}) => {
  const id = params?.id;

  const service: IBlogService = new BlogService();
  //ブログ全件数取得。データは無くて良いので、limit=0。
  const data: IBlog = await service.getBlogById(id);

  const tweets_id_data: MicroCmsResponse<ITweet> = await service.getTweets();
  const twitter_ids: string[] = [];
  tweets_id_data.contents.forEach((content) =>
    twitter_ids.push(content.twitter_id)
  );
  const tweets = await Promise.all(
    twitter_ids.map(async (id: string) => {
      const ast = await fetchTweetAst(id);
      return { id, ast };
    })
  );

  return {
    props: {
      blog: data,
      tweets,
    },
  };
};

export const getStaticPaths: GetStaticPaths<Slug> = async () => {
  const service: IBlogService = new BlogService();
  const data: MicroCmsResponse<{ id: string }> = await service.getBlogsIds();
  const paths = data.contents.map((content) => `/blogs/${content.id}`);
  return { paths, fallback: false };
};

export default Page;
