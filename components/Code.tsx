import React, { Fragment, FC, useState } from 'react';
import { okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { escapeHtml } from '../libs/Functions';
import CopyToClipboard from 'react-copy-to-clipboard';

interface Props {
  language: string;
  value: string;
}
const Code: FC<Props> = ({ language, value }) => {
  const [lang, filename] = (language || '').split(':');

  const [showCopyToClipboard, setShowCopyToClipboard] = useState(false);
  const [styleTooltip, setStyleTooltip] = useState({
    opacity: '0',
    visiblity: 'hidden',
  });

  const handleClick = () => {
    setStyleTooltip({ opacity: '1', visiblity: 'visible' });
    setTimeout(function () {
      setStyleTooltip({ opacity: '0', visiblity: 'hidden' });
    }, 3000);
  };

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
        <SyntaxHighlighter
          language={lang === '' ? 'javascript' : lang}
          style={okaidia}>
          {value}
        </SyntaxHighlighter>
        {showCopyToClipboard && (
          <div className="code-block-copy-button">
            <div className="copied-tooltip" style={styleTooltip}>
              Copied!
            </div>
            <CopyToClipboard text={value} onCopy={() => handleClick()}>
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
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
              </svg>
            </CopyToClipboard>
          </div>
        )}
      </div>
    </Fragment>
  );
};
export default Code;
