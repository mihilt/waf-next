/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_URL: process.env.API_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    API_VERSION: process.env.API_VERSION,
    RECOMMENDED_POST_LIKE: 5,
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
