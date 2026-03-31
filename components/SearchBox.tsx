import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { LensIcon } from './LensIcon';

interface Props {
  setSearchModal: Dispatch<SetStateAction<boolean>>;
}

export const SearchBox = ({ setSearchModal }: Props) => {
  const router = useRouter();

  const pushSearchPage = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return;
    }

    router.push({
      pathname: '/search',
      query: { q: trimmedQuery },
    });
  };

  const onClickSearchButton = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const { value } = (e.currentTarget as HTMLButtonElement)
      .previousElementSibling as HTMLInputElement;

    pushSearchPage(value);
  };

  const onEnterKeyEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      pushSearchPage(e.currentTarget.value);
    }
  };

  return (
    <>
      <div
        className="
          hidden lg:flex h-3/4 border-2 border-[#e5e7eb]
          rounded overflow-hidden bg-white text-gray-600
          focus-within:text-black
          focus-within:border-[#93c5fd] focus-within:ring-[3px]
          focus-within:ring-[rgba(59,130,246,0.5)]
          focus-within:ring-offset-0
        ">
        <input
          type="text"
          className="
          w-48 px-2 py-2
          text-black text-sm border-0 rounded-none
          bg-transparent
          focus:outline-none focus-visible:outline-none
          placeholder-gray-400
        "
          placeholder="サイト内検索"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            onEnterKeyEvent(e)
          }
        />
        <button
          className="flex items-center justify-center px-3 border-0 bg-transparent"
          onClick={(e) => onClickSearchButton(e)}>
          <LensIcon size={5} />
        </button>
      </div>
      <div
        className="flex lg:hidden items-center mr-1"
        onClick={() => {
          if (setSearchModal != null) setSearchModal(true);
        }}>
        <LensIcon size={6} />
      </div>
    </>
  );
};

interface PropsReSearch {
  searchValue: string;
}

export const ReSearchBox = ({ searchValue }: PropsReSearch) => {
  const router = useRouter();

  const pushSearchPage = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return;
    }

    router.push({
      pathname: '/search',
      query: { q: trimmedQuery },
    });
  };

  const onClickSearchButton = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const { value } = (e.currentTarget as HTMLButtonElement)
      .previousElementSibling as HTMLInputElement;

    pushSearchPage(value);
  };

  const onEnterKeyEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      pushSearchPage(e.currentTarget.value);
    }
  };

  return (
    <>
      <div
        className="
          flex w-full max-w-(--breakpoint-sm) 
          border-2 border-[#e5e7eb] rounded
          overflow-hidden bg-white
          text-gray-600 focus-within:text-black
          focus-within:border-[#93c5fd]
          focus-within:ring-[3px] focus-within:ring-[rgba(59,130,246,0.5)]
          focus-within:ring-offset-0
        ">
        <input
          key={searchValue} // q が変わったら defaultValue を反映させる
          type="text"
          defaultValue={searchValue}
          className="
                w-full px-2 py-2
                text-black border-0 rounded-none
                bg-transparent
                focus:outline-none focus-visible:outline-none
                placeholder-gray-400
              "
          placeholder="サイト内検索"
          onKeyDown={(e) => onEnterKeyEvent(e)}
        />
        <button
          className="flex items-center justify-center px-3 border-0 bg-transparent"
          onClick={(e) => onClickSearchButton(e)}>
          <LensIcon size={5} />
        </button>
      </div>
    </>
  );
};

export const SearchBoxMobil = ({ setSearchModal }: Props) => {
  const closeWithClickOutSideMethod = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    setter: {
      (value: React.SetStateAction<boolean>): void;
      (arg0: boolean): void;
    },
  ) => {
    if (e.target === e.currentTarget) {
      setter(false);
    }
  };
  return (
    <div
      className={`menuWrapper menuWrapper__active`}
      onClick={(e) => {
        closeWithClickOutSideMethod(e, setSearchModal);
      }}>
      <form
        className="block absolute top-12 right-0 left-0 z-50 w-11/12 my-0 mx-auto"
        action="/search"
        method="get">
        <input
          type="text"
          className="w-full h-11 border border-solid border-gray-200 bg-white shadow text-base pl-2"
          autoComplete="off"
          placeholder="サイト内検索"
          defaultValue=""
          name="q"
        />
      </form>
    </div>
  );
};
