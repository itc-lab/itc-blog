export interface tweetBasicInfo {
  id: string;
  avatar: { normal: string | undefined };
  name: string;
  username: string;
  createdAt: number;
  heartCount: string;
  likes: number;
  options: {
    votes: number;
    position: React.Key | null | undefined;
    label:
      | boolean
      | React.ReactChild
      | React.ReactFragment
      | React.ReactPortal
      | null
      | undefined;
  }[];
  endsAt: string;
  type?: string;
  ctaType?: string;
  ctaCount?: string;
}

export interface quotedTweetData {
  id: string;
  url: string;
}

export interface contentData {
  meta: tweetBasicInfo;
  html: string;
  quotedTweet?: quotedTweetData;
  mediaHtml: string | null | undefined;
  hasVideo?: string;
  hasPoll?: string;
}

export interface tweetAst {
  data: tweetBasicInfo;
  nodes: {
    nodes: nodes;
    tag: string;
  };
  props?: { href: string; className: string };
  tag: string;
}

interface nodes {
  nodes?: nodes[];
  props?: { href: string; className: string };
  tag?: string;
}
