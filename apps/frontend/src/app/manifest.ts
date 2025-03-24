import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StockQuest",
    short_name: "StockQuest",
    description:
      "StockQuest is the funny way to backtest your trading strategies.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4caf50",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
