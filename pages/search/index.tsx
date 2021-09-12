import React, { useEffect, useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { Layout } from '../../components/Layout';
import ReactTooltip from 'react-tooltip';
import Image from 'next/image';
import '../../settings.d.ts';
import settings from '../../settings.yml';
import { TopicsLinks } from '../../components/TopicsLinks';
import { Topics } from '../../components/Topics';
import { Indexes } from '../../components/Indexes';
import Link from 'next/link';
import Head from 'next/head';
import { IBlogService, BlogService } from '@utils/BlogService';
import { IBlog, ITopic, MicroCmsResponse, SEO_DATA } from '@types';
import { useSearchByQuery } from '@hooks/useSearchByQuery';

type Props = {
  blogs: MicroCmsResponse<IBlog>;
  query: string;
};

const Page: NextPage<Props> = ({ blogs, query }) => {
  const {
    searchValue,
    setSearchValue,
    onEnterKeyEvent,
    onClickSearchButton,
    data,
  } = useSearchByQuery(query, blogs);

  const [isTooltipVisible, setTooltipVisibility] = useState(false);
  useEffect(() => {
    setTooltipVisibility(true);
  }, []);
  const title = `「${query}」の検索結果 - ${settings.general[0].name}`;
  const url = `${settings.general[0].url}/search?q=${query}`;

  const date = new Date();
  const seo_data: SEO_DATA = {
    publishedAt: date.toISOString(),
    updatedAt: date.toISOString(),
    revisedAt: date.toISOString(),
    description: settings.general[0].description,
    topics: [],
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  let topics: ITopic[] = [];
  data &&
    data.contents.map(
      (content) =>
        content.topics &&
        (topics = [
          ...topics,
          ...content.topics.filter(
            (topic) => !new Set(topics.map((topic) => topic.id)).has(topic.id)
          ),
        ])
    );

  return (
    <Layout title={title} seo_data={seo_data} seo_url={url}>
      <Head>
        <link
          rel="preload"
          href={process.env.NEXT_PUBLIC_CDN_URL + settings.general[0].logo}
          as="image"
        />
      </Head>
      <nav className="sticky top-0 bg-blue-600 text-white z-50 border-t border-b border-l-0 border-r-0 border-gray-200">
        <div className="max-w-screen-xl px-1 iphone:px-8 md:px-9 mx-auto">
          <div className="flex items-center h-10 justify-between">
            <div
              style={{ position: 'relative', width: '230px', height: '80%' }}>
              <Link href={'/'} as={'/'} prefetch={false}>
                <a>
                  <Image
                    src={settings.blogs[0].logo}
                    layout="fill"
                    objectFit="contain"
                  />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <article className="bg-indigo-50">
        <header className="py-10">
          <div className="max-w-screen-xl m-auto px-10">
            <div className="relative text-center">
              <div className="flex items-center justify-center h-40">
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                  }}>
                  <Link href={'/'} as={'/'} prefetch={false}>
                    <a>
                      <Image
                        src={settings.general[0].logo}
                        layout="fill"
                        objectFit="contain"
                      />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="inline-block text-left text-4xl mt-1 mb-0 leading-normal max-w-screen-md">
                [検索結果]
              </div>
            </div>
          </div>
        </header>
        {/* 再検索欄 */}
        <div className="flex justify-center px-5 pb-5">
          <div className="flex w-full max-w-screen-sm border-2 rounded focus-within:ring focus-within:border-blue-300 text-gray-600 focus-within:text-black">
            <input
              type="text"
              value={searchValue}
              className="w-full px-2 py-2 text-black border-0 rounded-none focus:outline-none"
              placeholder="サイト内検索"
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => onEnterKeyEvent(e)}
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
        </div>
        <div className="relative pb-2 max-w-screen-xl my-0 mx-auto pt-0 px-0 md:px-10">
          <div>
            <div className="hidden desktop:block absolute -left-5 w-12 h-full">
              <div className="sticky top-32 text-xs flex flex-col items-center justify-between left-div-h">
                <div></div>
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
                <div></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <section className="content-area m-0">
              <div className="bg-white rounded-lg shadow py-10 text-sm md:text-base">
                <div className="max-w-screen-lg m-auto px-2 iphone:px-6 md:px-10">
                  <div className="overflow-hidden">
                    {!data ||
                      (data.contents.length === 0 && (
                        <p className="text-center">記事がありません</p>
                      ))}
                    <TopicsLinks topics={topics} />
                    <Indexes contents={data ? data.contents : []} />
                  </div>
                </div>
              </div>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query.q;
  const service: IBlogService = new BlogService();
  const blogs = await service.getBlogsByQuery(query as string);
  return {
    props: {
      blogs: blogs,
      query: query,
    },
  };
};

export default Page;
