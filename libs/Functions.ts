import {
  createElement,
  isValidElement,
  useEffect,
  useState,
  ReactElement,
  ReactNode,
} from 'react';

export const useMediaQuery = (width: number): boolean => {
  const [targetReached, setTargetReached] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(max-width: ${width}px)`).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(`(max-width: ${width}px)`);

    const onChange = (e: MediaQueryListEvent) => {
      setTargetReached(e.matches);
    };

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }

    const legacy = mql as unknown as {
      addListener: (cb: (e: { matches: boolean }) => void) => void;
      removeListener: (cb: (e: { matches: boolean }) => void) => void;
    };
    const onLegacyChange = (e: { matches: boolean }) => {
      setTargetReached(e.matches);
    };

    legacy.addListener(onLegacyChange);
    return () => legacy.removeListener(onLegacyChange);
  }, [width]);

  return targetReached;
};

export function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }

  return '';
}

export function slugifyHeading(text: string): string {
  const normalized = text.normalize('NFKC').trim().toLowerCase();

  const slug = normalized
    .replace(/\s+/g, '-')
    .replace(/[^\p{Letter}\p{Number}\-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return slug || 'section';
}

export function createHeadingId(
  text: string,
  counts: Map<string, number>,
): string {
  const base = slugifyHeading(text);
  const nextCount = (counts.get(base) ?? 0) + 1;
  counts.set(base, nextCount);
  return nextCount === 1 ? base : `${base}-${nextCount}`;
}

export function HeadingRenderer(props: {
  level: number | string;
  children: ReactNode;
  id?: string;
}): ReactElement {
  const rawLevel =
    typeof props.level === 'string' ? Number(props.level) : props.level;

  const baseLevel = Number.isFinite(rawLevel) ? rawLevel : 1;
  const headingLevel = Math.min(6, Math.max(1, baseLevel + 1));
  const headingId = props.id ?? slugifyHeading(extractText(props.children));

  return createElement(`h${headingLevel}`, { id: headingId }, props.children);
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
