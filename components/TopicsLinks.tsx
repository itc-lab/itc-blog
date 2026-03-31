import Link from 'next/link';
import { ITopic } from '@types';
import { TopicsIcon } from './TopicsIcon';

interface Props {
  topics: ITopic[];
}
export const TopicsLinks = ({ topics }: Props) => {
  const last_index = topics.length - 1;
  if (!topics || topics.length === 0) return <></>;
  return (
    <div className="ml-2 mb-2 mr-2 lg:hidden">
      <div className="flex items-end flex-wrap text-gray-700 mb-1 p-1">
        <TopicsIcon />
        {topics.map((value: ITopic, index: number) => {
          return (
            <Link
              key={`TopicsLinkslist1${value.id}`}
              href={'/list/[[...slug]]'}
              as={`/list/1/${value.id}`}
              prefetch={false}
              className="text-gray-700 mr-2 text-xs md:text-sm leading-relaxed no-underline hover:underline focus:underline cursor-pointer">
              {value.topics}
              {index !== last_index && ','}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
