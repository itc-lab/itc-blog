import type { NextApiRequest } from 'next';
import settings from '../../../settings';

export const COMMENT_TEXT_MAX_LENGTH = 10000;
export const COMMENT_NAME_MAX_LENGTH = 256;
export const COMMENT_RATE_LIMIT_MAX_REQUESTS = 5;
export const COMMENT_RATE_LIMIT_WINDOW_SECONDS = 60;

export function pickString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed !== '' ? trimmed : undefined;
  }
  return undefined;
}

export function pickHeaderString(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed !== '' ? trimmed : undefined;
  }

  if (Array.isArray(value)) {
    return pickString(value[0]);
  }

  return undefined;
}

export function isAllowedCommentUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const allowedOrigins = new Set<string>([
      new URL(settings.general.url).origin,
    ]);
    const publicBaseUrl = pickString(process.env.NEXT_PUBLIC_BASEURL);

    if (publicBaseUrl !== undefined) {
      allowedOrigins.add(new URL(publicBaseUrl).origin);
    }

    return (
      allowedOrigins.has(parsedUrl.origin) &&
      parsedUrl.pathname.startsWith('/blogs/')
    );
  } catch {
    return false;
  }
}

export function getClientIp(req: NextApiRequest): string {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string') {
    const ip = forwardedFor.split(',')[0]?.trim();
    if (ip) return ip;
  }

  if (Array.isArray(forwardedFor)) {
    const ip = forwardedFor[0]?.trim();
    if (ip) return ip;
  }

  return req.socket.remoteAddress ?? 'unknown';
}
