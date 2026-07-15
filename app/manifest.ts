import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LitreGre Prediction",
    short_name: "LitreGre",
    description:
      "Free daily football predictions, expert tips and analysis for 50+ leagues.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f2744",
    theme_color: "#1d4ed8",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
