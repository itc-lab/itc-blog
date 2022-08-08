import React from 'react';
import handlers from './handlers';
import { ComponentsInterFace } from './layout';

import { tweetBasicInfo, tweetAst } from '@types';

export interface nodelProps {
  key?: number | undefined;
  tag?: string;
  data?: tweetBasicInfo;
  nodes?: [
    {
      tag: string;
      nodes: {
        [key: number]:
          | string
          | {
              tag: string;
              props: { href: string };
              nodes: { [key: number]: string };
            };
      };
    }
  ];
  className?: string;
  children?: (JSX.Element | string | null)[];
  href?: string | undefined;
  title?: string;
  dataType?: string;
  width?: number;
  height?: number;
  alt?: string;
  src?: string;
}

const defaultHandler = (name: string) =>
  function defaultHandlerContent(
    props: JSX.IntrinsicAttributes,
    components: { [x: string]: React.ElementType }
  ): JSX.Element {
    const Comp = components[name];
    return Comp ? <Comp {...props} /> : React.createElement(name, props);
  };

function handleNode(
  node: tweetAst | string | undefined,
  components: ComponentsInterFace,
  i: number | undefined = undefined
): JSX.Element | string | null {
  if (!node) {
    return null;
  }

  if (typeof node === 'string') {
    return node;
  }

  const handler = handlers[node.tag] || defaultHandler(node.tag);

  if (!handler) {
    console.error('tweet error missing handler for:', node);
    return null;
  }

  const { nodes } = node;
  const props: nodelProps = { ...node.props, key: i };

  // Always send className as a string
  if (props.className && Array.isArray(props.className)) {
    props.className = props.className.join(' ');
  }

  if (node.data) {
    props.data = node.data;
  }

  if (nodes && Array.isArray(nodes)) {
    props.children = nodes.map((node, i) => handleNode(node, components, i));
  }

  const element = handler(props, components, i);

  if (!element) {
    console.error('A handler returned null for:', node);
  }

  return element;
}

export default function Node({
  components,
  node,
}: {
  components: ComponentsInterFace;
  node: tweetAst | string | undefined;
}): JSX.Element {
  return <> {handleNode(node, components)}</>;
}
