import Link from 'next/link';

export const HomeIcon = () => {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Link href={'/'} as={'/'} prefetch={false}>
      <button
        onClick={() => handleClick()}
        data-tooltip-id="global-tooltip"
        data-tooltip-content="記事一覧へ遷移">
        {/* 家のアイコン */}
        <svg
          className="w-7 h-7 text-gray-500 hover:text-[#65717b] transition-colors cursor-pointer"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          width="32"
          height="32">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      </button>
    </Link>
  );
};
