import { format, formatISO, parseISO } from "date-fns";

export default function Jadate({
  date
}: any) {
  return (
    <time className="text-gray-600 text-center" dateTime={formatISO(parseISO(date))}>{format(parseISO(date), "yyyy年MM月dd日")}</time>
  );
}
