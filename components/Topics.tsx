import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
interface Props {
  title: string;
  topics: Topic[];
}
export const Topics: FC<Props> = ({ title, topics }) => {
  const last_index = topics.length - 1;

  return (
    <div className="mb-6 pt-4 px-5 pb-6 text-xs md:text-sm bg-white rounded-lg shadow">
      <div className="font-sans text-sm md:text-base leading-normal font-bold mb-1">
        {title}
      </div>
      <div className="flex justify-between flex-wrap text-sm">
        {topics.map((value: Topic, index: number) => {
          if (index % 2 == 0 && value.needs_title) {
            //左側、文字有り
            return (
              <Link
                key={value.id}
                href={'/list/[[...slug]]'}
                as={`/list/1/${value.id}`}>
                <a
                  key={`${value.id}1`}
                  className="items-center my-2 flex-1 min-w-1/2"
                  href={`/tags/${value.id}`}>
                  <div
                    key={`${value.id}2`}
                    className="inline-block align-middle max-w-full"
                    style={{
                      position: 'relative',
                      width: '45px',
                      height: '45px',
                    }}>
                    <Image src={value.logo} layout="fill" objectFit="contain" />
                  </div>
                  <span
                    key={`${value.id}3`}
                    className="inline-block align-middle ml-0.5 text-base text-black leading-tight">
                    {value.topics}
                  </span>
                </a>
              </Link>
            );
          } else if (index % 2 != 0 && value.needs_title) {
            //右側、文字有り
            return (
              <Link
                key={value.id}
                href={'/list/[[...slug]]'}
                as={`/list/1/${value.id}`}>
                <a
                  key={`${value.id}1`}
                  className="items-center my-2 flex-1 min-w-1/2"
                  href={`/tags/${value.id}`}>
                  <div
                    key={`${value.id}2`}
                    className="inline-block align-middle max-w-full"
                    style={{
                      position: 'relative',
                      width: '45px',
                      height: '45px',
                    }}>
                    <Image src={value.logo} layout="fill" objectFit="contain" />
                  </div>
                  <span
                    key={`${value.id}3`}
                    className="inline-block align-middle ml-0.5 text-base text-black leading-tight">
                    {value.topics}
                  </span>
                </a>
              </Link>
            );
          } else if (
            index % 2 == 0 &&
            !value.needs_title &&
            index !== last_index
          ) {
            //左側、文字無し、最後ではない
            return (
              <Link
                key={value.id}
                href={'/list/[[...slug]]'}
                as={`/list/1/${value.id}`}>
                <a
                  key={`${value.id}1`}
                  className="items-center mt-1 flex-1 min-w-1/2 pr-1"
                  href={`/tags/${value.id}`}>
                  <div
                    key={`${value.id}2`}
                    className="inline-block align-middle max-w-full"
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '45px',
                    }}>
                    <Image src={value.logo} layout="fill" objectFit="contain" />
                  </div>
                </a>
              </Link>
            );
          } else if (index % 2 != 0 && !value.needs_title) {
            //右側、文字無し、最後ではない。右側は最後かどうか判定しない。
            return (
              <Link
                key={value.id}
                href={'/list/[[...slug]]'}
                as={`/list/1/${value.id}`}>
                <a
                  key={`${value.id}1`}
                  className="items-center mt-1 flex-1 min-w-1/2 pl-1"
                  href={`/tags/${value.id}`}>
                  <div
                    key={`${value.id}2`}
                    className="inline-block align-middle max-w-full"
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '45px',
                    }}>
                    <Image src={value.logo} layout="fill" objectFit="contain" />
                  </div>
                </a>
              </Link>
            );
          } else {
            //左側、文字無し、最後（ここに来ると、それしか残っていない。）
            return (
              <Link
                key={value.id}
                href={'/list/[[...slug]]'}
                as={`/list/1/${value.id}`}>
                <a
                  key={`${value.id}1`}
                  className="items-center mt-1 flex-1 min-w-1/2 pr-1"
                  href={`/tags/${value.id}`}>
                  <div
                    key={`${value.id}2`}
                    className="inline-block align-middle max-w-full"
                    style={{
                      position: 'relative',
                      width: '47%',
                      height: '45px',
                    }}>
                    <Image src={value.logo} layout="fill" objectFit="contain" />
                  </div>
                </a>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
};
