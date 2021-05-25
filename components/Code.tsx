import React, { FC } from 'react';
import { okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

interface Props {
  language: string;
  value: string;
}
const Code: FC<Props> = ({ language, value }) => {
  return (
    <SyntaxHighlighter
      language={(language === 'js' ? 'javascript' : language) || 'javascript'}
      style={okaidia}>
      {value}
    </SyntaxHighlighter>
  );
};
export default Code;
