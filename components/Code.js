import React from 'react';
import { okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

export default class Code extends React.PureComponent {
  render() {
    const { language, value } = this.props;
    return (
      <SyntaxHighlighter
        language={(language === 'js' ? 'javascript' : language) || 'javascript'}
        style={okaidia}
      >
        {value}
      </SyntaxHighlighter>
    );
  }
}
