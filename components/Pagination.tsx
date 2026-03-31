import settings from '../settings';
import Link from 'next/link';
import { ITopic } from '@types';

interface Props {
  thisPage: number;
  totalCount: number;
  currentTopic?: ITopic | null;
}

const buildListPath = (page: number, currentTopic?: ITopic | null) => {
  return !currentTopic ? `/list/${page}` : `/list/${page}/${currentTopic.id}`;
};

type PreviousButtonProps = {
  prevPage: number;
  currentTopic?: ITopic | null;
};

const PreviousButton = ({ prevPage, currentTopic }: PreviousButtonProps) => {
  const isDisabled = prevPage <= 0;

  if (isDisabled) {
    return (
      <li className="bg-gray-300 w-12 h-8 md:w-16 md:h-10 rounded m-1 iphone:m-3">
        <span className="text-gray-500 flex justify-center items-center h-full no-underline text-sm md:text-base">
          {'<前へ'}
        </span>
      </li>
    );
  }

  return (
    <li className="bg-blue-200 w-12 h-8 md:w-16 md:h-10 rounded m-1 iphone:m-3">
      <Link
        href="/list/[[...slug]]"
        as={buildListPath(prevPage, currentTopic)}
        prefetch={false}
        className="text-blue-700 flex justify-center items-center h-full no-underline text-sm md:text-base">
        {'<前へ'}
      </Link>
    </li>
  );
};

type NextButtonProps = {
  nextPage: number;
  lastPage: number;
  currentTopic?: ITopic | null;
};

const NextButton = ({ nextPage, lastPage, currentTopic }: NextButtonProps) => {
  const isDisabled = nextPage >= lastPage + 1;

  if (isDisabled) {
    return (
      <li className="bg-gray-300 w-12 h-8 md:w-16 md:h-10 rounded m-1 iphone:m-3">
        <span className="text-gray-500 flex justify-center items-center h-full no-underline text-sm md:text-base">
          {'次へ>'}
        </span>
      </li>
    );
  }

  return (
    <li className="bg-blue-200 w-12 h-8 md:w-16 md:h-10 rounded m-1 iphone:m-3">
      <Link
        href="/list/[[...slug]]"
        as={buildListPath(nextPage, currentTopic)}
        prefetch={false}
        className="text-blue-700 flex justify-center items-center h-full no-underline text-sm md:text-base">
        {'次へ>'}
      </Link>
    </li>
  );
};

export const Pagination = ({ thisPage, totalCount, currentTopic }: Props) => {
  const PER_PAGE = settings.general.per_page;
  const PREVIOUS_PAGE = thisPage - 1;
  const NEXT_PAGE = thisPage + 1;
  const LAST_PAGE = Math.ceil(totalCount / PER_PAGE);

  const PAGINATION_SIZE = settings.general.pagination;
  const CENTER_PAGE = Math.floor(PAGINATION_SIZE / 2);

  const range = (start: number, end: number) => {
    if (end < start) return [];
    return [...Array(end - start + 1)].map((_, i) => start + i);
  };

  const getStartPage = (): number => {
    if (LAST_PAGE <= PAGINATION_SIZE) return 1;

    const startPage =
      thisPage - (PAGINATION_SIZE % 2 === 0 ? CENTER_PAGE - 1 : CENTER_PAGE);

    if (startPage <= 0) return 1;

    if (thisPage + CENTER_PAGE > LAST_PAGE) {
      return startPage - (thisPage + CENTER_PAGE - LAST_PAGE);
    }

    return startPage;
  };

  const getEndPage = (): number => {
    if (LAST_PAGE <= PAGINATION_SIZE) return LAST_PAGE;

    const endPage = thisPage + CENTER_PAGE;

    const center =
      thisPage - (PAGINATION_SIZE % 2 === 0 ? CENTER_PAGE - 1 : CENTER_PAGE);

    if (center <= 0) return endPage + (1 - center);
    if (endPage > LAST_PAGE) return LAST_PAGE;

    return endPage;
  };

  const startPage = getStartPage();
  const endPage = getEndPage();
  const pages = range(startPage, endPage);

  return (
    <div className="mb-5 iphone:mb-7 md:mb-10">
      <ul className="flex flex-wrap justify-center items-center pt-6 md:pt-10 list-none">
        <PreviousButton prevPage={PREVIOUS_PAGE} currentTopic={currentTopic} />

        {pages.map((number, index) => {
          const isCurrent = number === thisPage;

          return (
            <li
              key={`pagination${index}`}
              className={`${
                isCurrent ? 'bg-blue-600' : 'bg-blue-200'
              } w-8 h-8 md:w-10 md:h-10 rounded m-1 iphone:m-3`}>
              <Link
                href="/list/[[...slug]]"
                as={buildListPath(number, currentTopic)}
                prefetch={false}
                className={`${
                  isCurrent ? 'text-white' : 'text-blue-700'
                } flex justify-center items-center h-full no-underline`}
                aria-current={isCurrent ? 'page' : undefined}>
                {number}
              </Link>
            </li>
          );
        })}

        <NextButton
          nextPage={NEXT_PAGE}
          lastPage={LAST_PAGE}
          currentTopic={currentTopic}
        />
      </ul>

      <span className="text-gray-500 flex flex-wrap justify-center items-center pt-1 text-sm md:text-base list-none">
        <span className="font-bold">{thisPage}</span>&nbsp;/&nbsp;{LAST_PAGE}
        ページ
      </span>
    </div>
  );
};
