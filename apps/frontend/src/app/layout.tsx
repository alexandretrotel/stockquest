import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/providers/theme.provider";
import AnimationWrapper from "@/providers/animation.provider";
import { IS_BETA } from "@/data/settings";
import NextTopLoader from "nextjs-toploader";
import Init from "@/components/common/init";

const font = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StockQuest",
  description:
    "StockQuest is the funny way to backtest your trading strategies.",
  category: "Finance",
  keywords: [
    "stock",
    "trading",
    "backtest",
    "performance",
    "strategy",
    "funny",
    "game",
    "technical",
    "analysis",
    "fundamental",
    "analysis",
    "market",
    "exchange",
    "price",
  ],
  authors: [
    { name: "Alexandre Trotel", url: "https://www.alexandretrotel.org" },
  ],
  creator: "Alexandre Trotel",
  publisher: "Alexandre Trotel",
  generator: "Next.js",
  applicationName: "StockQuest",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "StockQuest",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.stockq.app",
    siteName: "StockQuest",
    title: "StockQuest",
    description:
      "StockQuest is the funny way to backtest your trading strategies.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@stockquest",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4caf50",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} relative antialiased`}>
        <AnimationWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader color="#4caf50" height={3} showSpinner={false} />
            {children}

            {IS_BETA && (
              <div className="fixed bottom-4 left-4 z-50 hidden items-center gap-2 opacity-60 md:flex">
                <div className="bg-game-blue h-3 w-3 animate-pulse rounded-full" />
                <p className="text-game-blue text-xs font-bold">Beta Version</p>
              </div>
            )}

            <Init />
          </ThemeProvider>
        </AnimationWrapper>
      </body>
    </html>
  );
}
