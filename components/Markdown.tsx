import React, { ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import Code from './Code';
import { HeadingRenderer } from '../libs/Functions';

type Props = { source: string };

type CodeRendererProps = React.ComponentPropsWithoutRef<'code'> & {
  inline?: boolean;
  node?: unknown;
};

function CodeRenderer({
  inline,
  className,
  children,
  node: _node,
  ...rest
}: CodeRendererProps) {
  void _node;

  const value = String(children);

  const languageClass = (className ?? '')
    .split(/\s+/)
    .find((c) => c.startsWith('language-'));

  const languageWithMeta = languageClass
    ? languageClass.slice('language-'.length)
    : '';

  const isInline =
    inline === true ||
    (inline == null && !languageClass && !value.includes('\n'));

  if (isInline) {
    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  }

  return <Code language={languageWithMeta} value={value.replace(/\n$/, '')} />;
}

type HeadingProps = React.ComponentPropsWithoutRef<'h1'> & {
  node?: unknown;
};

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Heading = ({ node: _node, children, ...rest }: HeadingProps) => {
    void _node;

    return (
      <HeadingRenderer level={level} {...rest}>
        {children}
      </HeadingRenderer>
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

const H1 = createHeading(1);
const H2 = createHeading(2);
const H3 = createHeading(3);
const H4 = createHeading(4);
const H5 = createHeading(5);
const H6 = createHeading(6);

export const Markdown = ({ source }: Props): ReactElement => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        pre({ children }) {
          return <>{children}</>;
        },
        code: CodeRenderer,
        h1: H1,
        h2: H2,
        h3: H3,
        h4: H4,
        h5: H5,
        h6: H6,
      }}>
      {source}
    </ReactMarkdown>
  );
};

export default Markdown;
