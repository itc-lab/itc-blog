import getDate from 'date-fns/getDate';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';

export default function distanceToNow(dateTime: number): string {
  const date = new Date(dateTime);
  const day = getDate(new Date(date));
  const months = getMonth(new Date(date)) + 1;
  const year = getYear(new Date(date));
  return `${year}年${months}月${day}日`;
}
