import React, { useEffect, useState } from 'react';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { Layout } from '../../components/Layout';
import ReactTooltip from 'react-tooltip';
import Image from 'next/image';
import '../../settings.d.ts';
import settings from '../../settings.yml';
import { TwitterIcon } from '../../components/TwitterIcon';
import { HatenaIcon } from '../../components/HatenaIcon';
import { TopicsLinks } from '../../components/TopicsLinks';
import { Topics } from '../../components/Topics';
import { Indexes } from '../../components/Indexes';
import { Pagination } from '../../components/Pagination';
import Link from 'next/link';
import { fetchTweetAst } from 'static-tweets';
import { ArticleFooter } from '../../components/ArticleFooter';
import useMobileDevice from '../../hooks/useMobileDevice';
import MobileShare from '../../components/mobileShare';
import { OpenGraphImages } from 'next-seo/lib/types';
import { HttpsProxyAgent } from 'https-proxy-agent';

interface Tweet {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  twitter_id: string;
  caption: string;
  memo: string;
}

interface TweetRootObject {
  contents: Tweet[];
  totalCount: number;
  offset: number;
  limit: number;
}

interface Category {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  topics: string;
  logo: string;
  needs_title: boolean;
}

interface Topic {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  topics: string;
  logo: string;
  needs_title: boolean;
}

interface TopicRootObject {
  contents: Topic[];
  totalCount: number;
  offset: number;
  limit: number;
}

interface TopicIDs {
  contents: { id: string }[];
  totalCount: number;
  offset: number;
  limit: number;
}

interface Content {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  reflect_updatedAt: boolean;
  reflect_revisedAt: boolean;
  title: string;
  category: Category;
  topics: Topic[];
  content: string;
  seo_description: string;
  seo_type: string;
  seo_authors: string;
  seo_images_url: string;
  seo_images_width: string;
  seo_images_height: string;
  seo_images_alt: string;
}

interface ContentRootObject {
  contents: Content[];
  totalCount: number;
  offset: number;
  limit: number;
}

interface Props {
  contents: Content[];
  topics: Topic[];
  totalCount: number;
  thisPage: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tweets: { id: string; ast: any }[];
  currentTopic?: Topic | null;
}

type Slug = {
  slug: string[];
};

interface SEO_DATA {
  publishedAt: string;
  updatedAt: string;
  revisedAt?: string;
  reflect_updatedAt?: boolean;
  reflect_revisedAt?: boolean;
  topics: Topic[];
  description?: string;
  seo_type?: string;
  seo_authors?: { author: string }[];
  seo_images?: OpenGraphImages[];
  twitter_handle?: string;
  twitter_site?: string;
  twitter_cardtype?: string;
}

const Page: NextPage<Props> = ({
  contents,
  topics,
  totalCount,
  thisPage,
  tweets,
  currentTopic,
}) => {
  const [isMobileOrTablet] = useMobileDevice();
  const [isTooltipVisible, setTooltipVisibility] = useState(false);
  useEffect(() => {
    setTooltipVisibility(true);
  }, []);
  const title = currentTopic
    ? `${settings.general[0].name}/${currentTopic.topics}`
    : settings.general[0].name;
  const url =
    (thisPage === 1 && !currentTopic && settings.general[0].url) ||
    (currentTopic
      ? `${settings.general[0].url}/list/${thisPage}/${currentTopic.id}`
      : `${settings.general[0].url}/list/${thisPage}`);
  const twitter_param =
    '&text=' +
    encodeURIComponent(title) +
    `&hashtags=${settings.general[0].hashtag}`;
  const twitter_href = `https://twitter.com/share?url=${url}/${twitter_param}`;
  const hatena_href = 'https://b.hatena.ne.jp/entry/' + encodeURIComponent(url);
  const hatena_title = encodeURIComponent(title);
  const date = new Date();
  const seo_data: SEO_DATA = {
    publishedAt: date.toISOString(),
    updatedAt: date.toISOString(),
    description:
      thisPage === 1 && !currentTopic ? settings.general[0].description : '',
    topics: topics,
  };

  return (
    <Layout title={title} seo_data={seo_data} seo_url={url}>
      <nav className="sticky top-0 bg-blue-600 text-white z-50 border-t border-b border-l-0 border-r-0 border-gray-200">
        <div className="max-w-screen-xl pl-2 iphone:pl-8 md:pl-16">
          <div className="flex items-center h-10">
            <div
              style={{ position: 'relative', width: '230px', height: '80%' }}>
              <Link href={'/'} as={'/'}>
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
              {/* currentTopic有り=関連技術で絞り込み有り */}
              {currentTopic && currentTopic.needs_title && currentTopic.topics}
              {!currentTopic ? (
                <div className="flex items-center justify-center h-40">
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                    }}>
                    <Link href={'/'} as={'/'}>
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
              ) : (
                <>
                  <div className="flex items-center justify-center h-20">
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                      }}>
                      <Image
                        src={currentTopic.logo}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  </div>
                  <div className="inline-block text-left text-4xl mt-1 mb-0 leading-normal max-w-screen-md">
                    [関連技術で絞り込み結果]
                  </div>
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
              <div className="bg-white rounded-lg shadow py-10 text-sm md:text-base">
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
            <aside className="hidden md:block md:w-81">
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
  const [page, topic_id] = !params ? ['1'] : [params.slug[0], params.slug[1]];
  const header: HeadersInit = new Headers();
  header.set('X-API-KEY', process.env.API_KEY || '');
  const proxy = process.env.https_proxy;
  const key = proxy ? {
    headers: header,
    agent: new HttpsProxyAgent(proxy)
  } : {
    headers: header
  };
  const offset = page ? (parseInt(page) - 1) * settings.general[0].per_page : 0;
  //topic_idがundefinedの場合、全データページ切り替え
  const contents: ContentRootObject = !topic_id
    ? await fetch(
      `${process.env.API_URL}contents?offset=${offset}&limit=${settings.general[0].per_page}&orders=-publishedAt`,
      key
    )
      .then((res) => res.json())
      .catch(() => null)
    : await fetch(
      `${process.env.API_URL}contents?offset=${offset}&limit=${settings.general[0].per_page}&filters=topics[contains]${topic_id}`,
      key
    )
      .then((res) => res.json())
      .catch(() => null);
  const topics: TopicRootObject = await fetch(
    `${process.env.API_URL}topics?limit=9999`,
    key
  )
    .then((res) => res.json())
    .catch(() => null);
  //topic_idがある場合、関連技術で絞り込み
  const currentTopic: TopicRootObject =
    topic_id &&
    (await fetch(
      `${process.env.API_URL}topics?filters=id[equals]${topic_id}`,
      key
    )
      .then((res) => res.json())
      .catch(() => null));
  const tweets_id_data: TweetRootObject = await fetch(
    `${process.env.API_URL}twitter?limit=9999`,
    key
  )
    .then((res) => res.json())
    .catch(() => null);
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
    currentTopic: topic_id ? currentTopic.contents[0] : null,
  };
  return {
    props: props,
  };
};
export const getStaticPaths: GetStaticPaths<Slug> = async () => {
  const header: HeadersInit = new Headers();
  header.set('X-API-KEY', process.env.API_KEY || '');
  const proxy = process.env.https_proxy;
  const key = proxy ? {
    headers: header,
    agent: new HttpsProxyAgent(proxy)
  } : {
    headers: header
  };
  const total_count_data: ContentRootObject = await fetch(
    `${process.env.API_URL}contents/?limit=0`,
    key
  ) //データは無くて良いので、limit=0
    .then((res) => res.json())
    .catch(() => null);
  const total_pages: number = Math.ceil(
    total_count_data.totalCount / settings.general[0].per_page
  ); //coutPosts=全記事数を返す。pages=ページ数
  const paths = Array.from(Array(total_pages).keys()).map((it) => ({
    params: { slug: [(it + 1).toString()] },
  }));
  const topics_id_data: TopicIDs = await fetch(
    `${process.env.API_URL}topics?limit=9999&fields=id`,
    key
  ) //関連技術のidだけ抽出
    .then((res) => res.json())
    .catch(() => null);
  for (const topic of topics_id_data.contents) {
    const topic_posts = await fetch(
      `${process.env.API_URL}contents?limit=0&filters=topics[contains]${topic.id}`,
      key
    )
      .then((res) => res.json())
      .catch(() => null);
    const topic_pages = Math.ceil(
      topic_posts.totalCount / settings.general[0].per_page
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
