import React, { FC } from 'react';
import Link from 'next/link';
import { ITopic } from '@types';

interface Props {
  topics: ITopic[];
}
export const TopicsLinks: FC<Props> = ({ topics }) => {
  const last_index = topics.length - 1;
  if (!topics || topics.length === 0) return <></>;
  return (
    <div className="ml-2 mb-2 mr-2 lg:hidden">
      <div className="flex items-end flex-wrap text-gray-700 mb-1 p-1">
        <svg
          className="mr-2 w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
        </svg>
        {topics.map((value: ITopic, index: number) => {
          return (
            <Link
              key={`TopicsLinkslist1${value.id}`}
              href={'/list/[[...slug]]'}
              as={`/list/1/${value.id}`}
              prefetch={false}>
              <a className="text-gray-700 mr-2 text-xs md:text-sm leading-relaxed no-underline hover:underline focus:underline cursor-pointer">
                {value.topics}
                {index !== last_index && ','}
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
