import { Dispatch, SetStateAction, useState } from 'react';
import { useQuery } from 'react-query';
import { MicroCmsResponse, IBlog } from '@types';
import { BlogService } from '@utils/BlogService';

interface Props {
  setSearchValue: Dispatch<SetStateAction<string>>;
  onEnterKeyEvent: (e: React.KeyboardEvent<HTMLInputElement>) => Promise<void>;
  onClickSearchButton: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  data: MicroCmsResponse<IBlog> | undefined;
  searchValue: string;
  isLoading: boolean;
}

export function useSearchByQuery(
  query: string,
  initialData: MicroCmsResponse<IBlog>
): Props {
  const [searchValue, setSearchValue] = useState<string>(query);
  const { isLoading, data, refetch } = useQuery(
    ['blogs', searchValue],
    async (context) => {
      return await new BlogService().getBlogsByQuery(
        context.queryKey[1] as string
      );
    },
    {
      initialData: initialData,
      enabled: false,
    }
  );

  const onEnterKeyEvent = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('onEnterKeyEvent', e);
    if (!e.currentTarget.value.trim()) return;
    if (e.key === 'Enter') {
      refetch();
    }
  };

  const onClickSearchButton = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const { value } = (e.currentTarget as HTMLButtonElement)
      .previousElementSibling as HTMLInputElement;
    if (!value.trim()) {
      return;
    }
    refetch();
  };

  return {
    setSearchValue,
    onEnterKeyEvent,
    onClickSearchButton,
    data,
    searchValue,
    isLoading,
  };
}
