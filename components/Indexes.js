import React from 'react';
import Image from 'next/image';
import Jadate from './Jadate';
import { parseISO } from "date-fns";
import Link from 'next/link';

export const Indexes = ({contents}) => {
    return (
        <>
        {contents
          .map((content, index) => {
                return (
                    <IndexContent key={`IndexContent${index}`} index={index} content={content}/>
                )
            })
        }
        <div className="border-t border-gray-400 p-2 iphone:p-4"></div>
      </>
    )
};
const IndexContent = ({content, index}) => {
    const last_index = content.topics.length - 1;
    const isUpdate = parseISO(content.updatedAt) > parseISO(content.publishedAt)
    return (
        <article id={`blogs${content.id}`} className="flex border-t border-gray-400 p-2 iphone:p-4 items-center">
            <Link href={"/blogs/[id]"} as={`/blogs/${content.id}`}>
                <a className="hidden iphone:flex mr-4 border border-black iphone:w-16 iphone:h-16 md:w-24 md:h-24 flex items-center justify-center rounded-lg">
                    <div className="m-1 relative iphone:w-16 iphone:h-16 md:w-24 md:h-24"><Image src={content.category.logo} layout='fill' objectFit="contain"/></div>
                </a>
            </Link>
            <div className="md:index-special-width block"> 
                <header className="flex items-center justify-between">
                <div className="mt-1">
                    <span className="text-gray-500 inline-flex items-center">
                        {isUpdate
                            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        }
                        <span className="relative outline-none ml-2">
                            {isUpdate
                                ? <Jadate className="text-gray-600 text-center" date={content.updatedAt} />
                                : <Jadate className="text-gray-600 text-center" date={content.publishedAt} />
                            }
                        </span>
                    </span>
                </div>
                </header>
                <h2 className="mt-1 p-0 mb-1">
                <Link href={"/blogs/[id]"} as={`/blogs/${content.id}`}>
                    <a className="text-base md:text-lg font-bold mb-1 text-black leading-normal break-all no-underline hover:underline focus:underline cursor-pointer">
                        {content.title}
                    </a>
                </Link>
                </h2>
                <footer className="flex items-end justify-between">
                    <div>
                        <div className="flex items-end flex-wrap text-gray-700 mb-1 p-1">
                            <svg className="mr-2 w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                            {content.topics
                                .map((value, index) => {
                                    return (
                                        <Link key={`list1${value.id}`} href={"/list/[[...slug]]"} as={`/list/1/${value.id}`}>
                                            <a key={`list${index}`} className="text-gray-700 mr-2 text-xs md:text-sm leading-relaxed no-underline hover:underline focus:underline cursor-pointer">
                                                {value.topics}{index !== last_index && ","}
                                            </a>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                </footer>
            </div>
        </article>
    )
};
