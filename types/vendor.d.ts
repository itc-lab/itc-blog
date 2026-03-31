declare module 'tocbot' {
  export interface TocbotOptions {
    tocSelector?: string;
    contentSelector?: string;
    headingSelector?: string;
    ignoreSelector?: string;
    hasInnerContainers?: boolean;
    scrollSmooth?: boolean;
    orderedList?: boolean;
    collapseDepth?: number;
    headingsOffset?: number;
    scrollSmoothOffset?: number;
    positionFixedSelector?: string;
    positionFixedClass?: string;
    fixedSidebarOffset?: string | number;
  }

  const tocbot: {
    init: (options: TocbotOptions) => void;
    refresh: (options?: Partial<TocbotOptions>) => void;
    destroy: () => void;
  };

  export default tocbot;
}
