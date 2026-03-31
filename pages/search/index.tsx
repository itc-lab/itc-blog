import React, { useMemo } from 'react';
import Image from 'next/image';
import { NextPage } from 'next';
import { Layout } from '../../components/Layout';
import settings from '../../settings';
import { TopicsLinks } from '../../components/TopicsLinks';
import { Topics } from '../../components/Topics';
import { Indexes } from '../../components/Indexes';
import { HomeIcon } from '../../components/HomeIcon';
import Link from 'next/link';
import Head from 'next/head';
import { BlogService } from '@/utils/BlogService.client';
import { ITopic, SEO_DATA } from '@types';
import { useQuery } from '@tanstack/react-query';
import FadeLoader from 'react-spinners/FadeLoader';
import { useRouter } from 'next/router';
import { BreadCrumbs } from '../../components/BreadCrumbs';
import { ReSearchBox } from '@components/SearchBox';

const Page: NextPage = () => {
  const router = useRouter();

  const cdnOrigin = (process.env.NEXT_PUBLIC_CDN_URL ?? '').replace(/\/$/, '');
  const toCdnUrl = (path: string): string =>
    `${cdnOrigin}/${path.replace(/^\//, '')}`;

  const searchValue = useMemo((): string => {
    if (!router.isReady) return '';
    const q = router.query.q;
    if (Array.isArray(q)) return q[0] ?? '';
    return typeof q === 'string' ? q : '';
  }, [router.isReady, router.query.q]);

  const q = searchValue.trim();

  const { isLoading, data } = useQuery({
    queryKey: ['blogs', q],
    queryFn: async () => {
      return await new BlogService().getBlogsByQuery(q);
    },
    staleTime: Infinity,
    enabled: q.length > 0,
  });

  const title = q
    ? `「${q}」の検索結果 - ${settings.general.name}`
    : `検索結果 - ${settings.general.name}`;

  const url = `${settings.general.url}/search?q=${encodeURIComponent(q)}`;

  // To avoid hydration mismatches:
  // The search page is not an article page, so do not use the current time and treat it as a website
  const seo_data: SEO_DATA = {
    publishedAt: '',
    updatedAt: '',
    revisedAt: '',
    description: settings.general.description,
    topics: [],
    seo_type: 'website',
  };

  const topics = useMemo<ITopic[]>(() => {
    if (!data?.contents) return [];

    const seen = new Set<ITopic['id']>();
    const result: ITopic[] = [];

    for (const content of data.contents) {
      for (const topic of content.topics ?? []) {
        if (seen.has(topic.id)) continue;
        seen.add(topic.id);
        result.push(topic);
      }
    }

    return result;
  }, [data]);

  return (
    <Layout title={title} seo_data={seo_data} seo_url={url}>
      <Head>
        <link rel="preload" href={toCdnUrl(settings.general.logo)} as="image" />
      </Head>

      <nav className="sticky top-0 bg-blue-600 text-white z-50 border-t border-b border-l-0 border-r-0 border-gray-200">
        <div className="max-w-(--breakpoint-xl) px-1 iphone:px-8 md:px-9 mx-auto">
          <div className="flex items-center h-10 justify-between">
            <Link href={'/'} as={'/'} prefetch={false} className="h-full">
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
                  src={toCdnUrl(settings.blogs.logo)}
                />
              </div>
            </Link>
          </div>
        </div>
      </nav>

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
                    contents: '検索結果',
                    path: url,
                  },
                ]}
              />
            </div>
          </div>

          <div className="max-w-(--breakpoint-xl) m-auto px-10">
            <div className="relative text-center">
              <div className="inline-block h-40 w-80">
                <Link href={'/'} as={'/'} prefetch={false}>
                  <div className="relative h-full">
                    <Image
                      width={433}
                      height={64}
                      loading="eager"
                      className="w-full h-full object-contain"
                      style={{
                        display: 'block',
                      }}
                      alt="blog logo"
                      src={toCdnUrl(settings.general.logo)}
                    />
                  </div>
                </Link>
              </div>
              <br />
              <h1 className="inline-block text-left text-4xl mt-1 mb-0 leading-normal max-w-(--breakpoint-md)">
                [検索結果]
              </h1>
            </div>
          </div>
        </header>

        <div className="flex justify-center px-5 pb-5">
          <ReSearchBox searchValue={searchValue} />
        </div>

        <div className="relative pb-2 max-w-(--breakpoint-xl) my-0 mx-auto pt-0 px-0 md:px-10">
          <div>
            <div className="hidden desktop:block absolute -left-5 w-12 h-full">
              <div className="sticky top-32 text-xs flex flex-col items-center justify-between left-div-h">
                <div></div>
                <div>
                  <HomeIcon />
                </div>
                <div></div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <section className="content-area m-0">
              <div className="bg-white rounded-lg shadow pt-3 pb-8 md:pt-5 md:pb-10 lg:pt-10 lg:pb-10 text-sm md:text-base">
                <div className="max-w-(--breakpoint-lg) m-auto px-2 iphone:px-6 md:px-10">
                  {isLoading && (
                    <div className="text-center h-20">
                      <div className="inline-block">
                        <div className="relative" style={{ left: '-20px' }}>
                          <FadeLoader color={'#4A90E2'} loading={isLoading} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="overflow-hidden">
                    {q.length > 0 &&
                      !isLoading &&
                      (!data || data.contents.length === 0) && (
                        <p className="text-center">記事がありません</p>
                      )}

                    <TopicsLinks topics={topics} />
                    <Indexes contents={data ? data.contents : []} />
                  </div>
                </div>
              </div>
            </section>

            <aside className="hidden lg:block lg:w-81">
              <div className="h-full">
                {!isLoading && (
                  <Topics title="[関連技術で絞り込み]" topics={topics} />
                )}

                {isLoading && (
                  <div className="mb-6 pt-4 px-5 pb-6 text-xs md:text-sm bg-white rounded-lg shadow">
                    <div className="font-sans text-sm md:text-base leading-normal font-bold mb-1 h-28">
                      [関連技術で絞り込み]
                      <br />
                      <br />
                      <FadeLoader color={'#4A90E2'} loading={isLoading} />
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default Page;
