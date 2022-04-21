import React, { FC } from 'react';
import '../settings.d.ts';
import settings from '../settings.yml';
import Link from 'next/link';
import { ITopic } from '@types';

interface Props {
  thisPage: number;
  totalCount: number;
  currentTopic?: ITopic | null;
}

export const Pagination: FC<Props> = ({
  thisPage,
  totalCount,
  currentTopic,
}) => {
  const PER_PAGE = settings.general.per_page;
  const PREVIOUS_PAGE = thisPage - 1;
  const NEXT_PAGE = thisPage + 1;
  const LAST_PAGE = Math.ceil(totalCount / PER_PAGE);
  const CENTER_PAGE = Math.floor(settings.general.pagination / 2);

  const range = (start: number, end: number) =>
    [...Array(end - start + 1)].map((_, i) => start + i);

  const PreviousButton: FC = () => {
    return (
      <>
        {PREVIOUS_PAGE == 0 ? (
          <li
            key={`pagination_previous`}
            className="bg-gray-300 w-12 h-8 md:w-16 md:h-10 rounded m-1 iphone:m-3">
            <span className="text-gray-500 flex justify-center items-center h-full no-underline text-sm md:text-base">
              {'<前へ'}
            </span>
          </li>
        ) : (
          <li
            key={`pagination_previous`}
            className="bg-blue-200 w-12 h-8 md:w-16 md:h-10 rounded m-1 iphone:m-3">
            <Link
              href="/list/[[...slug]]"
              as={`${
                !currentTopic
                  ? `/list/${PREVIOUS_PAGE}`
                  : `/list/${PREVIOUS_PAGE}/${currentTopic.id}`
              }`}
              prefetch={false}>
              <a className="text-blue-700 flex justify-center items-center h-full no-underline text-sm md:text-base">
                {'<前へ'}
              </a>
            </Link>
          </li>
        )}
      </>
    );
  };

  const NextButton: FC = () => {
    return (
      <>
        {NEXT_PAGE == LAST_PAGE + 1 ? (
          <li
            key={`pagination_next`}
            className="bg-gray-300 w-12 h-8 md:w-16 md:h-10 rounded m-1 iphone:m-3">
            <span className="text-gray-500 flex justify-center items-center h-full no-underline text-sm md:text-base">
              {'次へ>'}
            </span>
          </li>
        ) : (
          <li
            key={`pagination_next`}
            className="bg-blue-200 w-12 h-8 md:w-16 md:h-10 rounded m-1 iphone:m-3">
            <Link
              href="/list/[[...slug]]"
              as={`${
                !currentTopic
                  ? `/list/${NEXT_PAGE}`
                  : `/list/${NEXT_PAGE}/${currentTopic.id}`
              }`}
              prefetch={false}>
              <a className="text-blue-700 flex justify-center items-center h-full no-underline text-sm md:text-base">
                {'次へ>'}
              </a>
            </Link>
          </li>
        )}
      </>
    );
  };

  const GetStartPage = (): number => {
    if (LAST_PAGE <= settings.general.pagination) return 1;
    const startPage =
      thisPage -
      (settings.general.pagination % 2 == 0 ? CENTER_PAGE - 1 : CENTER_PAGE);
    if (startPage <= 0) return 1;
    if (thisPage + CENTER_PAGE > LAST_PAGE)
      return startPage - (thisPage + CENTER_PAGE - LAST_PAGE);
    return startPage;
  };

  const GetEndPage = (): number => {
    if (LAST_PAGE <= settings.general.pagination) return LAST_PAGE;
    const endPage = thisPage + CENTER_PAGE;
    const center =
      thisPage -
      (settings.general.pagination % 2 == 0 ? CENTER_PAGE - 1 : CENTER_PAGE);
    if (center <= 0) return endPage + (1 - center);
    if (endPage > LAST_PAGE) return LAST_PAGE;
    return endPage;
  };

  return (
    <div>
      <ul className="flex flex-wrap justify-center items-center pt-6 md:pt-10 list-none">
        <PreviousButton />
        {range(GetStartPage(), GetEndPage()).map((number, index) => {
          return (
            <li
              key={`pagination${index}`}
              className={`bg-blue-${
                number == thisPage ? '600' : '200'
              } w-8 h-8 md:w-10 md:h-10 rounded m-1 iphone:m-3`}>
              <Link
                href="/list/[[...slug]]"
                as={`${
                  !currentTopic
                    ? `/list/${number}`
                    : `/list/${number}/${currentTopic.id}`
                }`}
                prefetch={false}>
                <a
                  className={`text-${
                    number == thisPage ? 'white' : 'blue-700'
                  } flex justify-center items-center h-full no-underline`}>
                  {number}
                </a>
              </Link>
            </li>
          );
        })}
        <NextButton />
      </ul>
      <span className="text-gray-500 flex flex-wrap justify-center items-center pt-1 text-sm md:text-base list-none">
        <span className="font-bold">{thisPage}</span>&nbsp;/&nbsp;{LAST_PAGE}
        ページ
      </span>
    </div>
  );
};
