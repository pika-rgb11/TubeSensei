import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cosmos Voyages — Explore the Universe. From Earth.",
  description:
    "Discover the world's best stargazing locations, observatories, dark-sky destinations, space events, and cosmic experiences. Travel isn't only across Earth — it's an experience of the universe.",
  keywords: [
    "stargazing", "astrotourism", "dark sky", "observatory", "planetarium",
    "space events", "meteor showers", "eclipse", "space tourism", "cosmic",
  ],
  authors: [{ name: "Cosmos Voyages" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Cosmos Voyages — Explore the Universe. From Earth.",
    description: "Astro-tourism for the modern explorer. Discover stargazing locations, observatories, and cosmic events.",
    siteName: "Cosmos Voyages",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cosmos Voyages",
    description: "Explore the Universe. From Earth.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        {children}
        <Toaster
          position="top-center"
          theme="dark"
          toastOptions={{
            style: {
              background: "oklch(0.10 0.04 270 / 90%)",
              border: "1px solid oklch(1 0 0 / 10%)",
              color: "oklch(0.96 0.01 250)",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
