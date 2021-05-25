import { FC, useEffect } from 'react';
import tocbot from 'tocbot';
const Tocbot: FC = () => {
  useEffect(() => {
    tocbot.init({
      headingsOffset: 85,
      scrollSmoothOffset: -60,
      tocSelector: '.js-toc',
      contentSelector: '.js-toc-content',
      headingSelector: 'h1, h2, h3',
      hasInnerContainers: true,
      scrollSmooth: true,
      orderedList: false,
    });
  });
  return null;
};
export default Tocbot;
