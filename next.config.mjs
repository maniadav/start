import withSerwist from "@serwist/next";

export default withSerwist({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});
