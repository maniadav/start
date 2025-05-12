import withSerwist from "@serwist/next";

const isGithub = false;

const nextConfig = {
  output: isGithub ? "export" : undefined,
  basePath: isGithub ? "/start" : "",
  trailingSlash: true,
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

export default withSerwist({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
})(nextConfig);
