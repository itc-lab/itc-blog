import unified from 'unified';
import { Node } from 'unist';

type NodeX = Node & {
  children?: NodeX;
  length?: number;
  tagName?: string;
  value?: string;
  properties?: string;
};

interface nodeInfo {
  tag: string | undefined;
  data?: { [key: string]: unknown };
  nodes?: string | nodeInfo | undefined | never[];
  length?: number;
  props?: string;
}

function minifyAst(ast: NodeX): nodeInfo | string | undefined {
  if (Array.isArray(ast)) {
    return ast.reduce((nodes, node) => {
      const n = minifyAst(node);
      // Empty new lines aren't required
      const isNoise = n === '\n' && nodes[nodes.length - 1]?.tag !== 'span';

      if (!isNoise) nodes.push(n);

      return nodes;
    }, []);
  }
  // Handle the root ast
  if (!ast.tagName && ast.children) {
    return minifyAst(ast.children);
  }
  if (ast.type === 'text') {
    return ast.value ? ast.value : '';
  }
  if (ast.type === 'element') {
    const node: nodeInfo = { tag: ast.tagName };
    const children = ast.children?.length ? minifyAst(ast.children) : [];

    if (ast.properties && Object.keys(ast.properties).length) {
      node.props = ast.properties;
    }
    if (ast.data) {
      node.data = ast.data;
    }
    if (children !== undefined) {
      if (children.length) {
        node.nodes = children;
      }
    }

    return node;
  }

  throw new Error(
    `Unable to handle the following AST: ${JSON.stringify(ast, null, 2)}`
  );
}

function rehypeMinify(this: unified.Processor): void {
  this.Compiler = (tree) => <string>minifyAst(tree);
}

/*
function rehypeMinify(this: unified.Processor): void {
  this.Compiler = (tree: NodeX) => {
    const aaa = minifyAst(tree);
    return 'string' !== typeof aaa ? '' : aaa;
  };
}*/

export default rehypeMinify;
