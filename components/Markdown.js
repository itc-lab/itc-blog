import React from 'react';
import Code from './Code';
import ReactMarkdown from 'react-markdown/with-html';
import { HeadingRenderer } from '../libs/Functions';
import gfm from 'remark-gfm'

export const Markdown = (props) => {
  return (
    <ReactMarkdown
      key="content"
      plugins={[gfm]}
      source={props.source}
      renderers={{
        code: Code,heading: HeadingRenderer
      }}
      escapeHtml={false}
    />
  );
};
