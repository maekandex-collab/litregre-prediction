import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SplashScreen } from "@/components/brand/SplashScreen";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const poppinsDisplay = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
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
    "Get free daily football predictions, expert tips and analysis for 50+ leagues. 1X2, BTS, Over 2.5, Halftime, goal scorers, VIP picks — all updated daily.",
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
      "Expert football predictions updated daily. 1X2, BTS, Over 2.5, Halftime, goal scorers, cards & corners, and VIP tips for Premier League, Champions League, La Liga, Serie A and 50+ leagues.",
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
      "Expert football predictions updated daily. 1X2, BTS, Over 2.5, VIP tips for 50+ leagues.",
    images: ["/api/og"],
  },
  robots: { index: true, follow: true },
  other: {
    "theme-color": "#22D366",
    "apple-mobile-web-app-title": "LitreGre",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${poppinsDisplay.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <SplashScreen />
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: { borderRadius: "10px", padding: "12px 16px" },
                }}
              />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
