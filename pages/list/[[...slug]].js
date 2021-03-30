import React, { useEffect, useState } from 'react';
import { Layout } from "../../components/Layout";
import ReactTooltip from 'react-tooltip';
import Image from 'next/image';
import settings from '../../settings.yml'
//import Date from "../components/Date";
import { TwitterIcon } from "../../components/TwitterIcon";
import { HatenaIcon } from "../../components/HatenaIcon";
import { TopicsLinks } from "../../components/TopicsLinks";
import { Topics } from "../../components/Topics";
import { Indexes } from "../../components/Indexes";
import { Pagination } from "../../components/Pagination";
//import { parseISO, format, formatISO } from "date-fns";
import Link from 'next/link';
import getTweets from '../../lib/get-tweets';
import { ArticleFooter } from "../../components/ArticleFooter";
import useMobileDevice from '../../hooks/useMobileDevice';
import MobileShare from '../../components/mobileShare';

export default function Page({ contents, topics, totalCount, thisPage, tweets, tweets_id_data, currentTopic }) {
  const [isMobileOrTablet] = useMobileDevice();

  const [isTooltipVisible, setTooltipVisibility] = useState(false);
  useEffect(() => {
    setTooltipVisibility(true);
  }, []);

  const scrollToTop = ()=> {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  const title = currentTopic ? `${settings.general[0].name}/${currentTopic.topics}` : settings.general[0].name;
  const url = currentTopic ? `${settings.general[0].url}/${thisPage}/${currentTopic.id}` : `${settings.general[0].url}/${thisPage}`;
  const twitter_param = "&text=" + encodeURIComponent(title) + `&hashtags=${settings.general[0].hashtag}`;
  const twitter_href = `https://twitter.com/share?url=${url}/${twitter_param}`;

  const hatena_param = "&title=" + encodeURIComponent(title);
  const hatena_href = `https://b.hatena.ne.jp/add?mode=confirm&url=${url}/${hatena_param}`;

  const date = new Date();
  let seo_data = {};
  seo_data.publishedAt = date.toISOString();
  seo_data.updatedAt = date.toISOString();
  seo_data.seo_title = settings.general[0].name;
  seo_data.topics = topics;

  return (
    <Layout title={title} seo_data={seo_data} seo_url={settings.general[0].url}>
      <nav className="sticky top-0 bg-blue-600 text-white z-50 border-t border-b border-l-0 border-r-0 border-gray-200">
        <div className="max-w-screen-xl m-auto px-10">
          <div className="flex items-center justify-between h-10">
            <div className="mr-4 flex-shrink-0 items-center">
              <Link href={"/"} as={"/"}><a><img src={settings.blogs[0].logo} className="object-none"></img></a></Link>
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
              <div className="flex items-center justify-center h-20">
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Link href={"/"} as={"/"}><a><Image src={settings.general[0].logo} layout='fill' objectFit="contain"/></a></Link>
                </div>
              </div> 
              ) : ( 
              <>
                <div className="flex items-center justify-center h-20">
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}><Image src={currentTopic.logo} layout='fill' objectFit="contain"/></div>
                </div>
                <div className="inline-block text-left text-4xl mt-1 mb-0 leading-normal max-w-screen-md">
                  [関連技術で絞り込み結果]
                </div>
              </>
              ) }
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
                  
                </div>
                <div>
                  {/* はてなブックマークアイコン */}
                  <HatenaIcon hatena_href={hatena_href}/>
                  {/* <button id="scroll-to-top-button" data-tip="一番上へジャンプ" onClick={() => scrollToTop()}>
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11l7-7 7 7M5 19l7-7 7 7"></path></svg>
                  </button> */}
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
                      <div className=""><TwitterIcon twitter_href={twitter_href}/></div>
                      {/* はてなブックマークアイコン */}
                      <div className="ml-5"><HatenaIcon hatena_href={hatena_href}/></div>
                      {/* シェア(共有)アイコン */}
                      {isMobileOrTablet && (<div className="ml-5"><MobileShare postTitle={title} siteTitle={title} /></div>)} 
                    </div>
                  </div>
                </div>
              </div>
              <Pagination thisPage={thisPage} totalCount={totalCount} currentTopic={currentTopic}/>
              <ArticleFooter tweets={tweets} tweets_id_data={tweets_id_data}/>
            </section>
            <aside className="hidden md:block md:w-81">
              <div className="h-full">
                <Topics title="[関連技術で絞り込み]" topics={topics}/>
              </div>
            </aside>
          </div>
        </div>
      </article>
      {isTooltipVisible && <ReactTooltip place="right" type="dark" effect="float"/>/*DOMがマウントされてから実装*/}
    </Layout>
  )
}

export const getStaticProps = async ({params}) => {
  // paramsは、/list/[[...slug]].js のため、/list/2 でリクエストされたら、{ slug: [ 2 ] } になる。
  // /list/2/yhte0dlvr でリクエストされたら、{ slug: [ 2, 'yhte0dlvr' ] } になる。
  // /でリクエストが来た時は、params、params.slug = undefined のため、[1]を入れる。→page=1,topic_id=undefinedになる。
  const [page, topic_id] = !params ? [1] : [params.slug[0], params.slug[1]];

  const key = {
    headers: {'X-API-KEY': process.env.API_KEY},
  };
  const offset = page ? (parseInt(page)-1)*settings.general[0].per_page : 0;

  //topic_idがundefinedの場合、全データページ切り替え
  const contents = !topic_id
                    ? await fetch(`https://itccorporation.microcms.io/api/v1/contents?offset=${offset}&limit=${settings.general[0].per_page}&orders=-updatedAt`, key)
                        .then(res => res.json())
                        .catch(() => null)
                    : await fetch(`https://itccorporation.microcms.io/api/v1/contents?offset=${offset}&limit=${settings.general[0].per_page}&filters=topics[contains]${topic_id}`, key)
                        .then(res => res.json())
                        .catch(() => null);
  const topics = await fetch(`https://itccorporation.microcms.io/api/v1/topics?limit=9999`, key)
    .then(res => res.json())
    .catch(() => null);
  //topic_idがある場合、関連技術で絞り込み
  const currentTopic = topic_id &&
                        await fetch(`https://itccorporation.microcms.io/api/v1/topics?filters=id[equals]${topic_id}`, key)
                          .then(res => res.json())
                          .catch(() => null);

  const tweets_id_data = await fetch(`https://itccorporation.microcms.io/api/v1/twitter?limit=9999&orders=-updatedAt`, key)
    .then(res => res.json())
    .catch(() => null);
  const twitter_ids = [];
  tweets_id_data.contents.forEach(content => twitter_ids.push(content.twitter_id));
  const tweets = await getTweets(twitter_ids);

  const props = {
      contents: contents.contents,
      topics: topics.contents,
      totalCount: contents.totalCount,
      thisPage: page,
      tweets,
      tweets_id_data: tweets_id_data.contents,
    };
  if (topic_id) {
    props.currentTopic = currentTopic.contents[0];
  }
  return {
    props: props,
  };
};

export const getStaticPaths = async () => {
  const key = {
    headers: {'X-API-KEY': process.env.API_KEY},
  };
  const total_count_data = await fetch(`https://itccorporation.microcms.io/api/v1/contents/?limit=0`, key)//データは無くて良いので、limit=0
    .then(res => res.json())
    .catch(() => null);
  const total_pages = Math.ceil(total_count_data.totalCount / settings.general[0].per_page);//coutPosts=全記事数を返す。pages=ページ数
  const paths = Array.from(Array(total_pages).keys()).map((it) => ({
    params: { slug: [(it + 1).toString()] },
  }));
  //ページ数だけのパターン
  // [
  //   { params: { slug: ['1'] } },
  //   { params: { slug: ['2'] } },
  //   { params: { slug: ['3'] } }
  // ]

  const topics_id_data = await fetch('https://itccorporation.microcms.io/api/v1/topics?limit=9999&fields=id', key)//関連技術のidだけ抽出
    .then(res => res.json())
    .catch(() => null);

  for (const topic of topics_id_data.contents) {
    const topic_posts = await fetch(`https://itccorporation.microcms.io/api/v1/contents?limit=0&filters=topics[contains]${topic.id}`, key)
      .then(res => res.json())
      .catch(() => null);
    const topic_pages = Math.ceil(topic_posts.totalCount / settings.general[0].per_page);
    for (let i = 0; i < topic_pages; i++) {
      paths.push({
        params: {
          slug: [(i + 1).toString(), topic.id]
        }
      });
    }
  }
  //ページ数とtopic.id(関連技術)絞り込みも追加
  // [
  //   { params: { slug: '1', 'xxxxx' } },
  //   { params: { slug: '2', 'xxxxx' } },
  //   { params: { slug: '3', 'xxxxx' } }
  // ]
  return {
    paths: paths,
    fallback: false,
  };
};