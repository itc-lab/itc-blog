import React from 'react';
import Code from './Code';
import ReactMarkdown from 'react-markdown/with-html';
import { HeadingRenderer } from '../libs/Functions';

export const Markdown = (props) => {
  return (
    //<div style={{ width: '100%' }} className="devii-markdown">
      <ReactMarkdown
        key="content"
        source={props.source}
        renderers={{
          code: Code,heading: HeadingRenderer
        }}
        escapeHtml={false}
      />
    //</div>
  );
};
