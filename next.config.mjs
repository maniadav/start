// next.config.mjs
import withSerwist from "@serwist/next";
// import routes from "../public/routes.json";

export default withSerwist({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // precacheManifest: routes.map((url) => ({ url, revision: null })),
});
