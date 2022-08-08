import {
  createElement,
  useState,
  useCallback,
  useEffect,
  ReactElement,
  ReactNode,
} from 'react';

export const useMediaQuery = (width: number): boolean => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e: { matches: boolean }) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addListener(updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeListener(updateTarget);
  }, [updateTarget, width]);

  return targetReached;
};

const generateId = (() => {
  let i = 0;
  return (prefix = '') => {
    i += 1;
    return `${prefix}-${i}`;
  };
})();

export function HeadingRenderer(props: {
  level: string;
  children: ReactNode;
}): ReactElement {
  const slug = `h${props.level + 1}-${generateId('titile')}`;
  return createElement(`h${props.level + 1}`, { id: slug }, props.children);
}

const HTML_ESCAPE_TEST_RE = /[&<>"]/;
const HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
const HTML_REPLACEMENTS: { [key: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};
function replaceUnsafeChar(ch: string): string {
  return HTML_REPLACEMENTS[ch];
}
export function escapeHtml(str: string): string {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}
