import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { Layout } from '../../components/Layout';
import settings from '../../settings';
import { XIcon } from '../../components/XIcon';
import { SearchBox } from '@components/SearchBox';
import { SearchBoxMobil } from '@components/SearchBox';
import { HatenaIcon } from '../../components/HatenaIcon';
import { TopicsLinks } from '../../components/TopicsLinks';
import { Topics } from '../../components/Topics';
import { Indexes } from '../../components/Indexes';
import { Pagination } from '../../components/Pagination';
import Link from 'next/link';
import { ArticleFooter } from '../../components/ArticleFooter';
import Head from 'next/head';
import { IBlog, ITopic, MicroCmsResponse, SEO_DATA } from '@/types/interface';
import { IBlogService, BlogService } from '@utils/BlogService';
import { generateRssFeed } from '@/components/RSS';
import { BreadCrumbs } from '../../components/BreadCrumbs';
import { getRanking } from '@utils/Ranking';
import { buildXShareUrl } from '@/utils/share';

const MobileShareMobileOnly = dynamic(
  () => import('../../components/MobileShareMobileOnly'),
  { ssr: false },
);

interface Props {
  contents: IBlog[];
  topics: ITopic[];
  totalCount: number;
  thisPage: number;
  currentTopic: ITopic | null;
  ranking: IBlog[] | null;
}

type Slug = {
  slug: string[];
};

const Page: NextPage<Props> = ({
  contents,
  topics,
  totalCount,
  thisPage,
  currentTopic,
  ranking,
}) => {
  const [isSearchModal, setSearchModal] = useState(false);

  const cdnOrigin = (process.env.NEXT_PUBLIC_CDN_URL ?? '').replace(/\/$/, '');
  const toCdnUrl = (path: string): string =>
    `${cdnOrigin}/${path.replace(/^\//, '')}`;

  const title = currentTopic
    ? `${settings.general.name}/${currentTopic.topics}`
    : settings.general.name;

  const url =
    (thisPage === 1 && !currentTopic && settings.general.url) ||
    (currentTopic
      ? `${settings.general.url}/list/${thisPage}/${currentTopic.id}`
      : `${settings.general.url}/list/${thisPage}`);

  const xHref = buildXShareUrl(url, title, settings.general.hashtag);
  const hatenaHref = 'https://b.hatena.ne.jp/entry/' + encodeURIComponent(url);
  const hatenaTitle = encodeURIComponent(title);

  const seo_data: SEO_DATA = {
    publishedAt: '',
    updatedAt: '',
    revisedAt: '',
    description:
      thisPage === 1 && !currentTopic ? settings.general.description : '',
    topics: currentTopic ? [currentTopic] : [],
    seo_type: 'website',
  };

  const heroLogo = currentTopic ? currentTopic.logo : settings.general.logo;
  const heroImageSrc = toCdnUrl(heroLogo);

  const breadcrumbslist = [
    { contents: '記事一覧', path: '/' },
    ...(!currentTopic && thisPage !== 1
      ? [
          {
            contents: `${thisPage}ページ目`,
            path: `/list/${thisPage}/`,
          },
        ]
      : currentTopic && thisPage !== 1
        ? [
            {
              contents: currentTopic.topics,
              path: `/list/1/${currentTopic.id}/`,
            },
            {
              contents: `${thisPage}ページ目`,
              path: `/list/${thisPage}/${currentTopic.id}/`,
            },
          ]
        : currentTopic
          ? [
              {
                contents: currentTopic.topics,
                path: `/list/1/${currentTopic.id}/`,
              },
            ]
          : []),
  ];

  return (
    <Layout title={title} seo_data={seo_data} seo_url={url}>
      <Head>
        <link rel="preload" href={heroImageSrc} as="image" />
      </Head>

      <nav className="sticky top-0 bg-blue-600 text-white z-50 border-t border-b border-l-0 border-r-0 border-gray-200">
        <div className="max-w-(--breakpoint-xl) px-1 iphone:px-8 md:px-9 mx-auto">
          <div className="flex items-center h-10 justify-between mr-1 md:mr-0">
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
                  width={320}
                  height={160}
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

            <SearchBox setSearchModal={setSearchModal} />
          </div>
        </div>
      </nav>

      {isSearchModal && <SearchBoxMobil setSearchModal={setSearchModal} />}

      <article className="bg-indigo-50">
        <header className="pb-5 md:pb-8">
          <div className="max-w-(--breakpoint-xl) px-2 iphone:px-10 md:px-11 mx-auto">
            <div className="flex items-center h-7 md:h-10 justify-between">
              <BreadCrumbs breadcrumbslist={breadcrumbslist} />
            </div>
          </div>

          <div className="max-w-(--breakpoint-xl) m-auto px-10">
            <div className="relative text-center">
              {currentTopic && currentTopic.needs_title && currentTopic.topics}

              {!currentTopic ? (
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
                        src={heroImageSrc}
                      />
                    </div>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center h-20">
                    <div className="relative w-full h-full">
                      <Image
                        width={433}
                        height={64}
                        loading="eager"
                        className="w-full h-full object-contain"
                        style={{
                          display: 'block',
                        }}
                        alt="current topic logo"
                        src={heroImageSrc}
                      />
                    </div>
                  </div>
                  <h1 className="inline-block text-left text-4xl mt-1 mb-0 leading-normal max-w-(--breakpoint-md)">
                    [関連技術で絞り込み結果]
                  </h1>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="relative pb-2 max-w-(--breakpoint-xl) my-0 mx-auto pt-0 px-0 md:px-10">
          <div>
            <div className="hidden desktop:block absolute -left-5 w-12 h-full">
              <div className="sticky top-32 text-xs flex flex-col items-center justify-between left-div-h">
                <div>
                  <XIcon x_href={xHref} />
                </div>
                <div></div>
                <div>
                  <HatenaIcon
                    hatena_href={hatenaHref}
                    hatena_title={hatenaTitle}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <section className="content-area m-0">
              <div className="bg-white rounded-lg shadow pt-3 pb-8 md:pt-5 md:pb-10 lg:pt-10 lg:pb-10 text-sm md:text-base">
                <div className="max-w-(--breakpoint-lg) m-auto px-2 iphone:px-6 md:px-10">
                  <div className="overflow-hidden">
                    <TopicsLinks topics={topics} />
                    <Indexes contents={contents} />

                    <div className="ml-5 mt-1 flex items-center desktop:hidden">
                      <div>
                        <XIcon x_href={xHref} />
                      </div>

                      <div className="ml-5">
                        <HatenaIcon
                          hatena_href={hatenaHref}
                          hatena_title={hatenaTitle}
                        />
                      </div>

                      <div className="ml-5">
                        <MobileShareMobileOnly
                          postTitle={title}
                          siteTitle={title}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Pagination
                thisPage={thisPage}
                totalCount={totalCount}
                currentTopic={currentTopic}
              />

              <ArticleFooter ranking={ranking} />
            </section>

            <aside className="hidden lg:block lg:w-81">
              <div className="h-full">
                <Topics title="[関連技術で絞り込み]" topics={topics} />
              </div>
            </aside>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<Props, Slug> = async ({
  params,
}) => {
  if (!params?.slug) {
    await generateRssFeed();
  }

  const page = params?.slug?.[0] ?? '1';
  const topic_id = params?.slug?.[1];

  const service: IBlogService = new BlogService();

  const contents: MicroCmsResponse<IBlog> = !topic_id
    ? await service.getBlogs(settings.general.per_page, parseInt(page, 10))
    : await service.getBlogsByTopicId(
        settings.general.per_page,
        parseInt(page, 10),
        topic_id,
      );

  const topics: MicroCmsResponse<ITopic> = await service.getTopics();

  const currentTopic: ITopic | null = topic_id
    ? await service.getTopicById(topic_id)
    : null;

  const blog_data = {
    contents: contents.contents,
    topics: topics.contents,
    totalCount: contents.totalCount,
    thisPage: parseInt(page, 10),
    currentTopic,
  };

  const ranking_data: IBlog[] | string | null = await getRanking();

  if (typeof ranking_data === 'string') {
    console.log('error:', ranking_data);
    return {
      props: {
        ...blog_data,
        ranking: null,
      },
    };
  }

  return {
    props: {
      ...blog_data,
      ranking: ranking_data,
    },
  };
};

export const getStaticPaths: GetStaticPaths<Slug> = async () => {
  const service: IBlogService = new BlogService();

  const total_count: number = await service.getBlogsCount();
  const total_pages: number = Math.ceil(
    total_count / settings.general.per_page,
  );

  const paths = Array.from(Array(total_pages).keys()).map((it) => ({
    params: { slug: [(it + 1).toString()] },
  }));

  const topics_id_data: MicroCmsResponse<{ id: string }> =
    await service.getTopicsIds();

  for (const topic of topics_id_data.contents) {
    const topic_posts_count: number = await service.getBlogsCountByTopicId(
      topic.id,
    );

    const topic_pages = Math.ceil(
      topic_posts_count / settings.general.per_page,
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
    paths,
    fallback: false,
  };
};

export default Page;
