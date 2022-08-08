import React, { useEffect, useState } from 'react';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { Layout } from '../../components/Layout';
import ReactTooltip from 'react-tooltip';
import '../../settings.d.ts';
import settings from '../../settings.yml';
import { TwitterIcon } from '../../components/TwitterIcon';
import { HatenaIcon } from '../../components/HatenaIcon';
import { TopicsLinks } from '../../components/TopicsLinks';
import { Topics } from '../../components/Topics';
import { Indexes } from '../../components/Indexes';
import { Pagination } from '../../components/Pagination';
import Link from 'next/link';
import { fetchTweetAst } from '../../components/FetchTweetAst';
import { ArticleFooter } from '../../components/ArticleFooter';
import useMobileDevice from '../../hooks/useMobileDevice';
import MobileShare from '../../components/mobileShare';
import Head from 'next/head';
import { useRouter } from 'next/dist/client/router';
import {
  IBlog,
  ITopic,
  MicroCmsResponse,
  ITweet,
  SEO_DATA,
} from '@/types/interface';
import { IBlogService, BlogService } from '@utils/BlogService';
import { generateRssFeed } from '@/components/RSS';
import { BreadCrumbs } from '../../components/BreadCrumbs';

interface Props {
  contents: IBlog[];
  topics: ITopic[];
  totalCount: number;
  thisPage: number;
  tweets: { id: string; ast: unknown }[];
  currentTopic: ITopic | null;
}

type Slug = {
  slug: string[];
};

const Page: NextPage<Props> = ({
  contents,
  topics,
  totalCount,
  thisPage,
  tweets,
  currentTopic,
}) => {
  const [isSearchModal, setSearchModal] = useState(false);
  const [isMobileOrTablet] = useMobileDevice();
  const [isTooltipVisible, setTooltipVisibility] = useState(false);
  useEffect(() => {
    setTooltipVisibility(true);
  }, []);
  const title = currentTopic
    ? `${settings.general.name}/${currentTopic.topics}`
    : settings.general.name;
  const url =
    (thisPage === 1 && !currentTopic && settings.general.url) ||
    (currentTopic
      ? `${settings.general.url}/list/${thisPage}/${currentTopic.id}`
      : `${settings.general.url}/list/${thisPage}`);
  const twitter_param =
    '&text=' +
    encodeURIComponent(title) +
    `&hashtags=${settings.general.hashtag}`;
  const twitter_href = `https://twitter.com/share?url=${url}/${twitter_param}`;
  const hatena_href = 'https://b.hatena.ne.jp/entry/' + encodeURIComponent(url);
  const hatena_title = encodeURIComponent(title);
  const date = new Date();
  const seo_data: SEO_DATA = {
    publishedAt: date.toISOString(),
    updatedAt: date.toISOString(),
    revisedAt: date.toISOString(),
    description:
      thisPage === 1 && !currentTopic ? settings.general.description : '',
    topics: topics,
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

  const closeWithClickOutSideMethod = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    setter: {
      (value: React.SetStateAction<boolean>): void;
      (arg0: boolean): void;
    }
  ) => {
    if (e.target === e.currentTarget) {
      setter(false);
    }
  };

  const breadcrumbslist = [
    { contents: `記事一覧`, path: `/` },
    ...(!currentTopic && !(thisPage == 1)
      ? [
          {
            contents: thisPage + 'ページ目',
            path: '/list/' + thisPage + '/',
          },
        ]
      : currentTopic && !(thisPage == 1)
      ? [
          {
            contents: currentTopic.topics,
            path: '/list/1/' + '/' + currentTopic.id + '/',
          },
          {
            contents: thisPage + 'ページ目',
            path: '/list/' + thisPage + '/' + currentTopic.id + '/',
          },
        ]
      : currentTopic
      ? [
          {
            contents: currentTopic.topics,
            path: '/list/1/' + '/' + currentTopic.id + '/',
          },
        ]
      : []),
  ];

  return (
    <Layout title={title} seo_data={seo_data} seo_url={url}>
      {!currentTopic && (
        <Head>
          <link
            rel="preload"
            href={
              (process.env.NEXT_PUBLIC_CDN_URL
                ? process.env.NEXT_PUBLIC_CDN_URL.replace(/\/$/, '')
                : '') +
              '/' +
              settings.general.logo.replace(/^\//, '')
            }
            as="image"
          />
        </Head>
      )}
      <nav className="sticky top-0 bg-blue-600 text-white z-50 border-t border-b border-l-0 border-r-0 border-gray-200">
        <div className="max-w-screen-xl px-1 iphone:px-8 md:px-9 mx-auto">
          <div className="flex items-center h-10 justify-between">
            <Link href={'/'} as={'/'} prefetch={false}>
              <a className="h-full">
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
              className="flex lg:hidden items-center mr-2 md:mr-10"
              onClick={() => setSearchModal(true)}>
              <svg
                className="w-6 h-6 text-white cursor-pointer"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
              </svg>
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
        <header className="pb-5 md:pb-8">
          <div className="max-w-screen-xl px-2 iphone:px-10 md:px-11 mx-auto">
            <div className="flex items-center h-7 md:h-10 justify-between">
              {<BreadCrumbs breadcrumbslist={breadcrumbslist} />}
            </div>
          </div>
          <div className="max-w-screen-xl m-auto px-10">
            <div className="relative text-center">
              {/* currentTopic有り=関連技術で絞り込み有り */}
              {currentTopic && currentTopic.needs_title && currentTopic.topics}
              {!currentTopic ? (
                <div className="inline-block h-40 w-80">
                  <Link href={'/'} as={'/'} prefetch={false}>
                    <a>
                      <div className="relative h-full">
                        <img
                          loading="lazy"
                          className="w-full h-full object-contain"
                          style={{
                            display: 'block',
                          }}
                          alt="blog logo"
                          src={
                            process.env.NEXT_PUBLIC_CDN_URL +
                            settings.general.logo
                          }></img>
                      </div>
                    </a>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center h-20">
                    <div className="relative w-full h-full">
                      <img
                        loading="lazy"
                        className="w-full h-full object-contain"
                        style={{
                          display: 'block',
                        }}
                        alt="current topic logo"
                        src={
                          process.env.NEXT_PUBLIC_CDN_URL + currentTopic.logo
                        }></img>
                    </div>
                  </div>
                  <h1 className="inline-block text-left text-4xl mt-1 mb-0 leading-normal max-w-screen-md">
                    [関連技術で絞り込み結果]
                  </h1>
                </>
              )}
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
                <div></div>
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
                  <div className="overflow-hidden">
                    <TopicsLinks topics={topics} />
                    <Indexes contents={contents} />
                    <div className="ml-5 mt-1 flex items-center desktop:hidden">
                      {/* ツイッターアイコン */}
                      <div className="">
                        <TwitterIcon twitter_href={twitter_href} />
                      </div>
                      {/* はてなブックマークアイコン */}
                      <div className="ml-5">
                        <HatenaIcon
                          hatena_href={hatena_href}
                          hatena_title={hatena_title}
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
              </div>
              <Pagination
                thisPage={thisPage}
                totalCount={totalCount}
                currentTopic={currentTopic}
              />
              <ArticleFooter tweets={tweets} />
            </section>
            <aside className="hidden lg:block lg:w-81">
              <div className="h-full">
                <Topics title="[関連技術で絞り込み]" topics={topics} />
              </div>
            </aside>
          </div>
        </div>
      </article>
      {
        isTooltipVisible && (
          <ReactTooltip place="right" type="dark" effect="float" />
        ) /*DOMがマウントされてから実装*/
      }
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<Props, Slug> = async ({
  params,
}) => {
  if (!params) await generateRssFeed();
  const [page, topic_id] = !params ? ['1'] : [params.slug[0], params.slug[1]];
  //const offset = page ? (parseInt(page) - 1) * settings.general.per_page : 0;

  const service: IBlogService = new BlogService();
  const contents: MicroCmsResponse<IBlog> = !topic_id
    ? await service.getBlogs(settings.general.per_page, parseInt(page)) //topic_idがundefinedの場合、全ブログ
    : //topic_idがある場合、topic_idで絞り込み
      await service.getBlogsByTopicId(
        settings.general.per_page,
        parseInt(page),
        topic_id
      );

  const topics: MicroCmsResponse<ITopic> = await service.getTopics();

  //topic_idがある場合、関連技術で絞り込み
  const currentTopic: ITopic | null = topic_id
    ? await service.getTopicById(topic_id)
    : null;

  const tweets_id_data: MicroCmsResponse<ITweet> = await service.getTweets();
  const twitter_ids: string[] = [];
  tweets_id_data.contents.forEach((content) =>
    twitter_ids.push(content.twitter_id)
  );
  const tweets = await Promise.all(
    twitter_ids.map(async (id) => {
      const ast = await fetchTweetAst(id);
      return { id, ast };
    })
  );

  const props = {
    contents: contents.contents,
    topics: topics.contents,
    totalCount: contents.totalCount,
    thisPage: parseInt(page),
    tweets,
    currentTopic,
  };
  return {
    props: props,
  };
};

export const getStaticPaths: GetStaticPaths<Slug> = async () => {
  const service: IBlogService = new BlogService();
  //ブログ全件数取得。データは無くて良いので、limit=0。
  const total_count: number = await service.getBlogsCount();
  const total_pages: number = Math.ceil(
    total_count / settings.general.per_page
  );
  const paths = Array.from(Array(total_pages).keys()).map((it) => ({
    params: { slug: [(it + 1).toString()] },
  }));
  //関連技術のIDだけ取得
  const topics_id_data: MicroCmsResponse<{ id: string }> =
    await service.getTopicsIds();
  for (const topic of topics_id_data.contents) {
    //関連技術に関連する記事の件数だけ取得。データは無くて良いので、limit=0。
    const topic_posts_count: number = await service.getBlogsCountByTopicId(
      topic.id
    );
    const topic_pages = Math.ceil(
      topic_posts_count / settings.general.per_page
    );
    for (let i = 0; i < topic_pages; i++) {
      paths.push({
        params: {
          slug: [(i + 1).toString(), topic.id],
        },
      });
    }
  }
  return {
    paths: paths,
    fallback: false,
  };
};

export default Page;
