import Image from 'next/image';
import Link from 'next/link';
import { ITopic } from '@types';

interface Props {
  title: string;
  topics: ITopic[];
}

export const Topics = ({ title, topics }: Props) => {
  return (
    <div className="mb-6 pt-4 px-4 pb-6 text-xs md:text-sm bg-white rounded-lg shadow">
      <div className="font-sans text-sm md:text-base leading-normal font-bold mb-1">
        {title}
      </div>
      <div className="flex justify-between flex-wrap ">
        {topics.map((value: ITopic) => {
          if (value.needs_title) {
            // With text
            return (
              <Link
                as={`/list/1/${value.id}`}
                prefetch={false}
                key={`${value.id}1`}
                className="flex justify-center items-center border border-gray-300 no-underline rounded-md w-32 h-12 mt-2"
                href={`/tags/${value.id}`}>
                <div key={`${value.id}2`} className="flex h-10">
                  <div
                    key={`${value.id}3`}
                    className="inline-block flex-1 m-auto w-auto h-9">
                    <Image
                      width={118}
                      height={46}
                      loading="lazy"
                      className="max-w-full max-h-full object-contain"
                      style={{
                        display: 'block',
                      }}
                      alt={`${value.topics} logo icon`}
                      src={
                        (process.env.NEXT_PUBLIC_CDN_URL
                          ? process.env.NEXT_PUBLIC_CDN_URL.replace(/\/$/, '')
                          : '') +
                        '/' +
                        value.logo.replace(/^\//, '')
                      }
                    />
                  </div>
                  <span
                    key={`${value.id}5`}
                    className="text-black mt-auto mb-auto ml-2 flex-2 max-w-18.5 break-normal">
                    {value.topics}
                  </span>
                </div>
              </Link>
            );
          } else {
            // Without text
            return (
              <Link
                as={`/list/1/${value.id}`}
                prefetch={false}
                key={`${value.id}1`}
                className="flex items-center border border-gray-300 rounded-md w-32 h-12 mt-2"
                href={`/tags/${value.id}`}>
                <div
                  key={`${value.id}2`}
                  className="inline-block align-middle m-1 w-full h-full">
                  <Image
                    width={118}
                    height={46}
                    loading="lazy"
                    className="w-full h-full object-contain object-center"
                    style={{
                      display: 'block',
                      margin: 'auto',
                    }}
                    alt={`${value.topics} logo icon`}
                    src={
                      (process.env.NEXT_PUBLIC_CDN_URL
                        ? process.env.NEXT_PUBLIC_CDN_URL.replace(/\/$/, '')
                        : '') +
                      '/' +
                      value.logo.replace(/^\//, '')
                    }
                  />
                </div>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
};
