import { format, formatISO, parseISO } from "date-fns";

export default function Jadate({ date }) {
  // ISO 8601 format
  // SEO対策timeタグで「時」を表すコンテンツを囲むことで検索エンジンが「時」を表しているコンテンツであることを認識できるようになる
  return (
    <time className="text-gray-600 text-center" dateTime={formatISO(parseISO(date))}>{format(parseISO(date), "yyyy年MM月dd日")}</time>
  );
}
