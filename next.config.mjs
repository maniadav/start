import withSerwist from "@serwist/next";

const isGithub = false;

const nextConfig = {
  output: isGithub ? "export" : undefined,
  basePath: isGithub ? "/start" : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default withSerwist({
  // Service Worker configuration
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
})(nextConfig);

// next.config.mjs
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   webpack: (config) => {
//     config.module.rules.push({
//       test: /\.task$/,
//       type: 'asset/resource',
//     });
//     return config;
//   },
// };

// export default nextConfig;
