import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LitreGre Prediction",
    short_name: "LitreGre",
    description:
      "Free daily football predictions, expert tips and analysis for 50+ leagues.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A1433",
    theme_color: "#22D366",
    icons: [
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
