import withSerwist from "@serwist/next";

const isGithub = false;
const disableSerwist = false; // set to true to disable Serwist caching for localhost

const nextConfig = {
  output: isGithub ? "export" : undefined,
  basePath: isGithub ? "/start" : "",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // rule for .task files
    config.module.rules.push({
      test: /\.task$/,
      type: "asset/resource",
      generator: {
        filename: "static/[hash][ext][query]", // Custom output path
      },
    });
    return config;
  },
};

const configExport = disableSerwist
  ? nextConfig
  : withSerwist({
      swSrc: "src/pwa/pwa.sw.ts",
      swDest: "public/sw.js",
      })(nextConfig);

export default configExport;
