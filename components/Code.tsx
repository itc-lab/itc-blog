import React, {
  Fragment,
  useState,
  useCallback,
  useEffect,
  CSSProperties,
  ElementType,
  ComponentType,
} from 'react';
import { escapeHtml } from '../libs/Functions';

interface Props {
  language: string;
  value: string;
}

type SyntaxHighlighterProps = {
  language?: string;
  style?: Record<string, CSSProperties | undefined>;
  PreTag?: ElementType;
  children: string;
};

type SyntaxHighlighterComponent = ComponentType<SyntaxHighlighterProps>;
type PrismThemeDict = Record<string, CSSProperties | undefined>;

const fallbackPreStyle: React.CSSProperties = {
  color: '#f8f8f2',
  background: '#272822',
  textShadow: '0 1px rgba(0, 0, 0, 0.3)',
  fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
  fontSize: '1em',
  textAlign: 'left',
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  wordWrap: 'normal',
  lineHeight: 1.5,
  tabSize: 4,
  WebkitHyphens: 'none',
  MozHyphens: 'none',
  msHyphens: 'none',
  hyphens: 'none',
  padding: '1em',
  margin: '.5em 0',
  overflow: 'auto',
  borderRadius: '0.3em',
};

const fallbackCodeStyle: React.CSSProperties = {
  color: '#f8f8f2',
  background: 'none',
  textShadow: '0 1px rgba(0, 0, 0, 0.3)',
  fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
  fontSize: '1em',
  textAlign: 'left',
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  wordWrap: 'normal',
  lineHeight: 1.5,
  tabSize: 4,
  WebkitHyphens: 'none',
  MozHyphens: 'none',
  msHyphens: 'none',
  hyphens: 'none',
};

const Code = ({ language, value }: Props) => {
  const [langRaw, ...filenameParts] = (language || '').split(':');
  const filename = filenameParts.join(':');

  const lang = (langRaw || '').toLowerCase();
  const disableHighlight = lang === 'sh';
  const hlLang = lang === '' ? 'javascript' : lang;

  const [showCopyToClipboard, setShowCopyToClipboard] = useState(false);

  const [styleTooltip, setStyleTooltip] = useState<React.CSSProperties>({
    opacity: 0,
    visibility: 'hidden',
  });

  const [SyntaxHighlighter, setSyntaxHighlighter] =
    useState<SyntaxHighlighterComponent | null>(null);
  const [prismTheme, setPrismTheme] = useState<PrismThemeDict | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [{ Prism }, styleModule] = await Promise.all([
          import('react-syntax-highlighter'),
          import('react-syntax-highlighter/dist/esm/styles/prism'),
        ]);

        if (!mounted) {
          return;
        }

        setSyntaxHighlighter(() => Prism as SyntaxHighlighterComponent);
        setPrismTheme(styleModule.okaidia as PrismThemeDict);
      } catch {
        // If loading fails, continue without SyntaxHighlighter
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const preStyle: React.CSSProperties =
    prismTheme?.['pre[class*="language-"]'] ?? fallbackPreStyle;
  const codeStyle: React.CSSProperties =
    prismTheme?.['code[class*="language-"]'] ?? fallbackCodeStyle;

  const copyText = useCallback(async (text: string) => {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', 'true');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }, []);

  const showCopiedTooltip = useCallback(() => {
    setStyleTooltip({ opacity: 1, visibility: 'visible' });
    setTimeout(() => {
      setStyleTooltip({ opacity: 0, visibility: 'hidden' });
    }, 3000);
  }, []);

  const handleCopyClick = useCallback(async () => {
    try {
      await copyText(value);
      showCopiedTooltip();
    } catch {
      // noop
    }
  }, [copyText, value, showCopiedTooltip]);

  const codeBlock =
    disableHighlight || !SyntaxHighlighter || !prismTheme ? (
      <pre style={preStyle}>
        <code className={`language-${lang || 'sh'}`} style={codeStyle}>
          {value}
        </code>
      </pre>
    ) : (
      <SyntaxHighlighter language={hlLang} style={prismTheme}>
        {value}
      </SyntaxHighlighter>
    );

  return (
    <Fragment>
      {filename && (
        <div className="code-block-filename-container">
          <span className="code-block-filename">{escapeHtml(filename)}</span>
        </div>
      )}

      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => setShowCopyToClipboard(true)}
        onMouseLeave={() => setShowCopyToClipboard(false)}>
        {codeBlock}

        {showCopyToClipboard && (
          <div className="code-block-copy-button">
            <div className="copied-tooltip" style={styleTooltip}>
              Copied!
            </div>

            <button
              type="button"
              onClick={handleCopyClick}
              aria-label="Copy code to clipboard"
              style={{
                background: 'transparent',
                border: 0,
                padding: 0,
                cursor: 'pointer',
              }}>
              <svg
                id="btnTarget"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Code;
