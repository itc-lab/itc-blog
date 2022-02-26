import React, { FC } from 'react';
import { BreadCrumbsList } from '@types';

export const BreadCrumbs: FC<BreadCrumbsList> = ({ breadcrumbslist }) => {
  return (
    <ol
      className="flex overflow-x-auto whitespace-nowrap"
      aria-label="breadcrumb">
      {breadcrumbslist.map(({ contents, path }, index: number) => (
        <li className="flex items-center" key={index}>
          {breadcrumbslist.length - 1 !== index ? (
            <>
              <a
                className="text-gray-500 text-sm no-underline hover:underline"
                href={path}>
                {contents}
              </a>
              <span className="ml-1 mr-1"> {'>'} </span>
            </>
          ) : (
            <span className="text-gray-500 text-sm" aria-current="page">
              {contents}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
};
