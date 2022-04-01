module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_BASEURL ||
    'https://itc-engineering-blog.netlify.app',
  changefreq: 'weekly',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  outDir: './out',
  sitemapBaseFileName: 'sitemap',
  exclude: ['/search'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: ['/search?q='],
        allow: '/',
      },
    ],
  },
};
