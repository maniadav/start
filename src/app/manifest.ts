import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "START",
    short_name: "Start",
    description: "A Progressive Web App for autism screening",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/start-rounded-96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/icons/start.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
