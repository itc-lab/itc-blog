import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { Layout } from '../../components/Layout';
import Tocbot from '../../components/Tocbot';
import { useMediaQuery } from '../../libs/Functions';
import { Markdown } from '../../components/Markdown';
import settings from '../../settings';
import { SearchBoxMobil } from '@components/SearchBox';
import { SearchBox } from '@components/SearchBox';
import { HomeIcon } from '../../components/HomeIcon';
import { XIcon } from '../../components/XIcon';
import { UpdateDate } from '../../components/UpdateDate';
import { ReleaseDate } from '../../components/ReleaseDate';
import { HatenaIcon } from '../../components/HatenaIcon';
import { TopicsLinks } from '../../components/TopicsLinks';
import { Topics } from '../../components/Topics';
import Link from 'next/link';
import CommentForm from '../../components/Comment';
import tocbot from 'tocbot';
import { BlogService, IBlogService } from '@utils/BlogService';
import { getRanking } from '@utils/Ranking';
import { IBlog, MicroCmsResponse } from '@types';
import { BreadCrumbs } from '../../components/BreadCrumbs';
import { ArticleFooter } from '@components/ArticleFooter';
import { buildXShareUrl } from '@/utils/share';

interface Props {
  blog: IBlog;
  ranking: IBlog[] | null;
}

type Slug = {
  id: string;
};

const MobileShareMobileOnly = dynamic(
  () => import('../../components/MobileShareMobileOnly'),
  { ssr: false },
);

const Page: NextPage<Props> = ({ blog, ranking }) => {
  const [isCheck, setCheckbox] = useState(false);
  const [isSearchModal, setSearchModal] = useState(false);
  const isBreakpoint = useMediaQuery(1024);

  useEffect(() => {
    // On mobile widths, destroy the table of contents only when the menu is closed
    // When the menu is open, use the mobile-side .js-toc instead
    if (isBreakpoint) {
      if (!isCheck) {
        tocbot.destroy();
      }
      return;
    }

    // While the mobile menu is open, do not show the desktop table of contents
    if (isCheck) {
      tocbot.destroy();
      return;
    }

    // Rebuild the table of contents only in desktop view
    const timer = window.setTimeout(() => {
      try {
        tocbot.refresh();
      } catch {
        // If refresh fails, such as on the initial render, fall back to init
        try {
          tocbot.init({
            tocSelector: '.js-toc',
            contentSelector: '.js-toc-content',
            headingSelector: 'h1, h2, h3',
            hasInnerContainers: false,
          });
        } catch {
          // Ignore the error
        }
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      tocbot.destroy();
    };
  }, [isBreakpoint, isCheck]);

  const closeWithClickOutSideMethod = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    setter: {
      (value: React.SetStateAction<boolean>): void;
      (arg0: boolean): void;
    },
  ) => {
    if (e.target === e.currentTarget) {
      tocbot.destroy();
      setter(false);
    } else if ((e.target as Element).classList.contains('toc-link')) {
      setTimeout(() => {
        tocbot.destroy();
        setter(false);
      }, 500);
    }
  };

  const title = `${blog.title}${settings.blogs.title_suffix}`;
  const url = `${settings.blogs.url}/${blog.id}`;

  const x_href = buildXShareUrl(url, blog.title, settings.general.hashtag);

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
          <div className="max-w-(--breakpoint-xl) px-1 iphone:px-8 md:px-9 mx-auto">
            <div className="flex items-center h-10 justify-between">
              <Link
                href={'/'}
                as={'/'}
                prefetch={false}
                className="hidden lg:flex h-full">
                <div
                  className="relative"
                  style={{
                    width: '230px',
                    height: '80%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}>
                  <Image
                    width={433}
                    height={64}
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
                    }
                  />
                </div>
              </Link>

              <Link
                href={'/'}
                as={'/'}
                prefetch={false}
                className="relative lg:hidden"
                style={{
                  width: '45px',
                  height: '70%',
                }}>
                <div
                  className="relative h-full"
                  onClick={() => setCheckbox(false)}>
                  <Image
                    width={568}
                    height={307}
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
                    }
                  />
                </div>
              </Link>

              <div className="ml-1 iphone:ml-2 md:ml-6 flex-1 text-sm truncate">
                {blog.title}
              </div>

              <SearchBox setSearchModal={setSearchModal} />

              <div className="flex lg:hidden items-center ml-2 pr-4 shrink-0">
                <input
                  type="checkbox"
                  id="toggle"
                  checked={isCheck}
                  onChange={() => setCheckbox((prev) => !prev)}
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
                    <div className="menu iphone5se:mr-6 bg-white pt-5 px-5 pb-6 overflow-auto rounded-lg shadow-lg max-h-[95vh]">
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

        {isSearchModal && <SearchBoxMobil setSearchModal={setSearchModal} />}

        <article className="bg-indigo-50">
          <header className="pb-10">
            <div className="max-w-(--breakpoint-xl) h-10 ml-auto mr-auto px-2 iphone:px-10 md:px-11">
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

            <div className="max-w-(--breakpoint-xl) m-auto px-10">
              <div className="relative text-center">
                {blog.category.needs_title && blog.category.topics}

                <div className="flex items-center justify-center h-20">
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                    }}>
                    <Image
                      width={433}
                      height={64}
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
                      }
                    />
                  </div>
                </div>

                <h1
                  className="
                    inline-block text-left text-2xl leading-normal
                    iphone:text-3xl
                    md:text-4xl/10
                    sm:leading-9
                    mt-1 mb-0 max-w-(--breakpoint-md)">
                  {blog.title}
                </h1>
              </div>

              <div className="flex items-center justify-center text-center text-gray-500 text-xs iphone:text-sm mt-3 mb-0 -mr-2 -ml-2">
                <UpdateDate date={update_timestamp} />
                <ReleaseDate date={blog.publishedAt} />
              </div>
            </div>
          </header>

          <div className="relative pb-2 max-w-(--breakpoint-xl) my-0 mx-auto pt-0 px-0 md:px-10">
            <div>
              <div className="hidden desktop:block absolute -left-5 w-12 h-full">
                <div className="sticky top-32 text-xs flex flex-col items-center justify-between left-div-h">
                  <div>
                    <XIcon x_href={x_href} />
                  </div>
                  <div>
                    <HomeIcon />
                  </div>
                  <div>
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
                  <div className="max-w-(--breakpoint-lg) m-auto px-2 iphone:px-6 md:px-10">
                    <TopicsLinks topics={blog.topics} />
                    <div id="toc-target-content">
                      <div className="js-toc-content overflow-hidden">
                        <Markdown source={blog.content} />
                      </div>
                    </div>

                    <div className="ml-5 mt-7 flex items-center desktop:hidden">
                      <div>
                        <XIcon x_href={x_href} />
                      </div>
                      <div className="ml-5">
                        <HatenaIcon
                          hatena_title={hatena_title}
                          hatena_href={hatena_href}
                        />
                      </div>

                      <MobileShareMobileOnly
                        className="ml-5"
                        postTitle={title}
                        siteTitle={title}
                      />
                    </div>
                  </div>
                </div>

                <CommentForm url={url} />
                <ArticleFooter ranking={ranking} />
              </section>

              <aside className="hidden lg:block lg:w-81">
                <div className="h-full">
                  <Topics title="[関連技術]" topics={blog.topics} />
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
    </>
  );
};

export const getStaticProps: GetStaticProps<Props, Slug> = async ({
  params,
}) => {
  const id = params?.id;

  const service: IBlogService = new BlogService();
  const data: IBlog = await service.getBlogById(id);

  const ranking_data: IBlog[] | string | null = await getRanking();
  if (typeof ranking_data === 'string') {
    console.log('error:', ranking_data);
    return {
      props: {
        blog: data,
        ranking: null,
      },
    };
  }

  return {
    props: {
      blog: data,
      ranking: ranking_data,
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
