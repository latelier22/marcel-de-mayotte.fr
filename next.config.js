/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "marcel-de-mayotte.latelier22.fr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "admin.marcel-de-mayotte.fr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "tecdn.b-cdn.net",
        pathname: "/**",
      },
     
    ],
  },
};

module.exports = nextConfig;
