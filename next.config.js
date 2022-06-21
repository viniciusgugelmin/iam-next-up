/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    domains: ["www.imigrantesbebidas.com.br", "apoioentrega.vteximg.com.br"],
  },
};

module.exports = nextConfig;
