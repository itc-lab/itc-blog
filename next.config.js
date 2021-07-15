// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  webpack5: true,
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

    return config;
  },
  images: {
    domains: ['pbs.twimg.com'],
    loader: 'cloudinary',
    path: process.env.CDN_URL,
  },
};
