// next.config.js
const path = require('path');
const { PHASE_PRODUCTION_BUILD } = require('next/constants');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const generateSiteVerification = require('./scripts/generate-site-verification');

function buildRemotePatternFromCdnUrl() {
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
  if (!cdnUrl) throw new Error('NEXT_PUBLIC_CDN_URL is not set');

  let u;
  try {
    u = new URL(cdnUrl);
  } catch {
    throw new Error(`NEXT_PUBLIC_CDN_URL must be an absolute URL: ${cdnUrl}`);
  }

  const protocol = u.protocol.replace(':', '');
  const hostname = u.hostname;

  const basePath = u.pathname.replace(/\/$/, '');
  const pathname = basePath ? `${basePath}/**` : '/**';

  return { protocol, hostname, pathname };
}

module.exports = (phase) => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    generateSiteVerification();
  }

  const cdnPattern = buildRemotePatternFromCdnUrl();

  return {
    experimental: {
      largePageDataBytes: 2 * 1024 * 1024, // 2 MB
    },

    sassOptions: {
      includePaths: [path.join(__dirname, 'styles/toc')],
    },

    turbopack: {
      rules: {},
    },

    images: {
      unoptimized: phase === PHASE_DEVELOPMENT_SERVER,
      remotePatterns: [cdnPattern],
    },
  };
};
