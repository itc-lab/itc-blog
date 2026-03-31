import Image from 'next/image';
import { Jadate } from './Jadate';
import { parseISO } from 'date-fns';
import Link from 'next/link';
import { IBlog, IBlogs, ITopic } from '@types';
import { UpdateIcon } from './UpdateIcon';
import { ReleaseIcon } from './ReleaseIcon';
import { TopicsIcon } from './TopicsIcon';

export const Indexes = ({ contents }: IBlogs) => {
  return (
    <>
      {contents.map((content) => {
        if (content !== null) {
          return (
            <IndexContent key={`IndexContent${content.id}`} content={content} />
          );
        }
      })}
      {contents && contents.length > 0 && (
        <div className="border-t border-gray-400 p-2 iphone:p-4"></div>
      )}
    </>
  );
};

interface Props {
  content: IBlog;
}

const IndexContent = ({ content }: Props) => {
  const last_index = content.topics.length - 1;
  const update_timestamp =
    (content.reflect_updatedAt && content.updatedAt) ||
    (content.reflect_revisedAt && content.revisedAt) ||
    content.publishedAt;
  const isUpdate = parseISO(update_timestamp) > parseISO(content.publishedAt);
  const rank_color = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500 to-yellow-300';
      case 2:
        return 'from-gray-400 to-gray-300';
      case 3:
        return 'from-orange-500 to-orange-300';
      default:
        return 'from-stone-200 to-stone-200';
    }
  };
  return (
    <div className="flex border-t border-gray-400">
      {content.rank && (
        <div
          className={`mt-2 mr-1 iphone:mt-4 md:mt-2 md:mr-2 bg-linear-to-r ${rank_color(
            content.rank,
          )} grid place-items-center rounded-md shrink-0 w-7 h-7 md:w-8 md:h-8 text-base md:text-lg font-semibold`}>
          {content.rank}
        </div>
      )}
      <article
        id={`blogs${content.id}`}
        className={`flex items-center ${
          content.rank ? 'pr-2 py-2 iphone:pr-4 iphone:py-4' : 'p-2 iphone:p-4'
        }`}>
        <Link
          href={'/blogs/[id]'}
          as={`/blogs/${content.id}`}
          prefetch={false}
          className="hidden iphone:flex mr-4 border border-black iphone:w-16 iphone:h-16 md:w-24 md:h-24 items-center justify-center rounded-lg">
          <div className="m-1 relative iphone:w-16 iphone:h-16 md:w-24 md:h-24">
            <Image
              width={86}
              height={96}
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
                content.category.logo.replace(/^\//, '')
              }
            />
          </div>
        </Link>
        <div className="md:index-special-width block">
          <header className="flex items-center justify-between">
            <div className="mt-1">
              <span className="text-gray-500 inline-flex items-center">
                {isUpdate ? <UpdateIcon /> : <ReleaseIcon />}
                <span className="relative outline-none ml-2">
                  {isUpdate ? (
                    <Jadate
                      className="text-gray-600 text-center"
                      date={content.updatedAt}
                    />
                  ) : (
                    <Jadate
                      className="text-gray-600 text-center"
                      date={content.publishedAt}
                    />
                  )}
                </span>
              </span>
            </div>
          </header>
          <h3 className="mt-1 p-0 mb-0.5">
            <Link
              href={'/blogs/[id]'}
              as={`/blogs/${content.id}`}
              prefetch={false}
              className="text-base md:text-lg font-bold mb-1 text-black leading-normal break-all no-underline hover:underline focus:underline cursor-pointer">
              {content.title}
            </Link>
          </h3>
          <footer className="flex items-end justify-between">
            <div>
              <div className="flex items-end flex-wrap text-gray-700 mb-1 p-1">
                <TopicsIcon />
                {content.topics.map((value: ITopic, index: number) => {
                  return (
                    <Link
                      //key={`list1${value.id}`}
                      href={'/list/[[...slug]]'}
                      as={`/list/1/${value.id}`}
                      prefetch={false}
                      key={`list${index}`}
                      className="text-gray-700 mr-2 text-xs md:text-sm leading-relaxed no-underline hover:underline focus:underline cursor-pointer">
                      {value.topics}
                      {index !== last_index && ','}
                    </Link>
                  );
                })}
              </div>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
};
