const path = require('path');
const generateSiteVerification = require('./scripts/generate-site-verification');
module.exports = {
  webpack5: true,
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 5000,
      aggregateTimeout: 600,
    };
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles/toc')],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        fallback: {
          fs: false,
        },
        ...config.resolve,
      };
    }

    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'js-yaml-loader',
    });

    if (isServer) {
      generateSiteVerification();
    }

    return config;
  },
  images: {
    domains: ['pbs.twimg.com'],
    loader: 'cloudinary',
    path: process.env.NEXT_PUBLIC_CDN_URL,
  },
};
