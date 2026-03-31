import { Jadate } from './Jadate';
import { UpdateIcon } from './UpdateIcon';

interface Props {
  date: string;
}

export const UpdateDate = ({ date }: Props) => {
  return (
    <span className="mx-3 mt-1 inline-flex items-center">
      <UpdateIcon />
      <span className="relative outline-none ml-1">
        <Jadate date={date} /> (更新)
      </span>
    </span>
  );
};
