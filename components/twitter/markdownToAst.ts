import unified from 'unified';
import markdown from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import raw from 'rehype-raw';
import prism from '@mapbox/rehype-prism';

import { Node, Data } from 'unist';
import toHast from 'mdast-util-to-hast';

type NodeX = Node & {
  value?: string;
};

const handlers = {
  // Add a className to inlineCode so we can differentiate between it and code fragments
  inlineCode(_: toHast.H, node: NodeX) {
    return {
      ...node,
      type: 'element',
      tagName: 'code',
      properties: { className: 'inline' },
      children: [
        {
          type: 'text',
          value: node.value,
        },
      ],
    };
  },
};

function toAst(this: unified.Processor) {
  this.Compiler = (tree: Node<Data>) => <string>(<unknown>tree);
}

// Create the processor, the order of the plugins is important
const processor = unified()
  .use(markdown)
  .use(remarkToRehype, { handlers, allowDangerousHtml: true })
  // Add custom HTML found in the tweet to the AST
  .use(raw)
  // Add syntax highlighting
  .use(prism)
  .use(toAst);

export default async function markdownToAst(md: string): Promise<unknown> {
  try {
    const file = await processor.process(md);
    return file.result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Markdown to AST error: ${error}`);
    throw error;
  }
}
