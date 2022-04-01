import React, { Fragment, FC } from 'react';
import { okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { escapeHtml } from '../libs/Functions';

interface Props {
  language: string;
  value: string;
}
const Code: FC<Props> = ({ language, value }) => {
  const [lang, filename] = language.split(':');
  return (
    <Fragment>
      {filename && (
        <div className="code-block-filename-container">
          <span className="code-block-filename">{escapeHtml(filename)}</span>
        </div>
      )}
      <SyntaxHighlighter
        language={(lang === 'js' ? 'javascript' : lang) || 'javascript'}
        style={okaidia}>
        {value}
      </SyntaxHighlighter>
    </Fragment>
  );
};
export default Code;
