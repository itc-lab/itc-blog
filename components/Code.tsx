import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

export default class Code extends React.PureComponent {
  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'language' does not exist on type 'Readon... Remove this comment to see the full error message
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
