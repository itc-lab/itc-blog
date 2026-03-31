import { Jadate } from './Jadate';
import { ReleaseIcon } from './ReleaseIcon';

interface Props {
  date: string;
}

export const ReleaseDate = ({ date }: Props) => {
  return (
    <span className="mx-3 mt-1 inline-flex items-center">
      <ReleaseIcon />
      <span className="relative outline-none ml-1">
        <Jadate date={date} /> (公開)
      </span>
    </span>
  );
};
