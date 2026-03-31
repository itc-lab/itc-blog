export const buildXShareUrl = (
  url: string,
  text: string,
  hashtags?: string,
): string => {
  const params = new URLSearchParams();

  params.set('url', url);
  params.set('text', text);

  const normalizedHashtags = hashtags
    ?.split(',')
    .map((tag) => tag.trim().replace(/^#/, ''))
    .filter(Boolean)
    .join(',');

  if (normalizedHashtags) {
    params.set('hashtags', normalizedHashtags);
  }

  return `https://x.com/share?${params.toString()}`;
};
