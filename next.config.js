/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_URL: process.env.API_URL,
    API_VERSION: process.env.API_VERSION,
    RECOMMENDED_POST_LIKE: 5,
  },
};

module.exports = nextConfig;
