import * as gtag from '@utils/gtag';

interface Props {
  x_href: string;
}

export const XIcon = ({ x_href }: Props) => {
  const handleClick = () => {
    gtag.event({
      action: 'Click',
      category: 'Share',
      label: 'X',
      value: '0',
    });
  };

  return (
    <a
      href={x_href}
      rel="nofollow noopener noreferrer"
      target="_blank"
      data-tooltip-id="global-tooltip"
      data-tooltip-content="このページをポストする"
      onClick={handleClick}>
      <svg
        id="Logo"
        className="x-svg w-7 h-7 fill-current text-gray-500 hover:text-[#000000] transition-colors cursor-pointer"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <g>
          <path d="M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z"></path>
        </g>
      </svg>
    </a>
  );
};
