const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
