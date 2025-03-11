// next.config.mjs
import withSerwist from "@serwist/next";

const nextConfig = {
  // next static export logic
  output: "export",
  basePath: "/start",
  // gitHub Pages compatibility
  trailingSlash: true,
  images: { unoptimized: true },
};

export default withSerwist({
  // Service Worker configuration
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
})(nextConfig);
