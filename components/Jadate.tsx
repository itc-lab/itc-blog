import React, { FC } from 'react';
import { format, formatISO, parseISO } from 'date-fns';

interface Props {
  className?: string;
  date: string;
}

export const Jadate: FC<Props> = ({ date }) => {
  return (
    <time
      className="text-gray-600 text-center"
      dateTime={formatISO(parseISO(date))}>
      {format(parseISO(date), 'yyyy年MM月dd日')}
    </time>
  );
};
