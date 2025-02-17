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
        src: "/images/icon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: "/images/icon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
      {
        src: "/images/icon-masked-192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "maskable",
      },
      {
        src: "/images/icon-masked-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
  };
}
