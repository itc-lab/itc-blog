const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles/toc')],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty'
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
    path: "https://res.cloudinary.com/dt8zu6zzd/"
  },
}
