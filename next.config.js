const path = require('path')

module.exports = {
  future: {
    webpack5: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles/toc')],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        fallback: {
          fs: false
        },
        ...config.resolve
      };
    }

    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        use: 'js-yaml-loader',
      },
    )

    return config;
  },
  images: {
    domains: ["abs.twimg.com"],
    loader: "cloudinary",
    path: process.env.CDN_URL
  },
}
