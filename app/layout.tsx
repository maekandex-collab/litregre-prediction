import type { Metadata } from "next";
import { Inter, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://prediction.viaspark.site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LitreGre Prediction – Free Daily Football Predictions & Tips",
    template: "%s | LitreGre Prediction",
  },
  description:
    "Get free daily football predictions, expert tips and analysis for 50+ leagues. 1X2, BTS, Over 1.5, Over 2.5, goal scorers, VIP picks — all updated daily.",
  keywords: [
    "football predictions",
    "soccer tips",
    "free predictions",
    "betting tips",
    "football analysis",
    "BTS tips",
    "over 1.5 predictions",
    "over 2.5 predictions",
    "VIP football picks",
    "today football predictions",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: "LitreGre Prediction",
    title: "LitreGre Prediction – Free Daily Football Predictions & Tips",
    description:
      "Expert football predictions updated daily. 1X2, BTS, Over 1.5, Over 2.5, goal scorers, cards & corners, and VIP tips for Premier League, Champions League, La Liga, Serie A and 50+ leagues.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "LitreGre Prediction – Free Daily Football Predictions & Tips",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LitreGre Prediction – Free Daily Football Predictions",
    description:
      "Expert football predictions updated daily. 1X2, BTS, Over 1.5, Over 2.5, VIP tips for 50+ leagues.",
    images: ["/api/og"],
  },
  robots: { index: true, follow: true },
  other: {
    "theme-color": "#1d4ed8",
    "apple-mobile-web-app-title": "LitreGre",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${beVietnamPro.variable} font-sans antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: { borderRadius: "8px", padding: "12px 16px" },
                }}
              />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
