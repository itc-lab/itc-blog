import React from 'react';
import '../settings.d.ts'
import settings from '../settings.yml';
import Link from 'next/link';

export const Pagination = ({
    thisPage,
    totalCount,
    currentTopic
}: any) => {
    const PER_PAGE = settings.general[0].per_page;
  
    const range = (start: any, end: any) =>
          [...Array(end - start + 1)].map((_, i) => start + i)
  
    return (
        <ul className="flex flex-wrap justify-center items-center pt-6 md:pt-10 list-none">
            {range(1, Math.ceil(totalCount / PER_PAGE)).map((number, index) => {
                if ( number == thisPage ) {
                    return (
                        <li key={`pagination${index}`} className="bg-blue-700 w-8 h-8 md:w-10 md:h-10 rounded m-3">
                            <Link href="/list/[[...slug]]" as={`${!currentTopic ? `/list/${number}` : `/list/${number}/${currentTopic.id}`}`}>
                                <a className="text-white flex justify-center items-center h-full no-underline">
                                    {number}
                                </a>
                            </Link>
                        </li>
                    )
                } else {
                    return (
                        <li key={`pagination${index}`} className="bg-blue-200 w-8 h-8 md:w-10 md:h-10 rounded m-3">
                            <Link href="/list/[[...slug]]" as={`${!currentTopic ? `/list/${number}` : `/list/${number}/${currentTopic.id}`}`}>
                                <a className="text-blue-700 flex justify-center items-center h-full no-underline">
                                    {number}
                                </a>
                            </Link>
                        </li>
                    )
                }
            })}
        </ul>
    );
  };    
