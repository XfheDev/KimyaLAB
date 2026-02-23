import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Efe Çağan | Geleceğin Kimya Platformu",
  description: "Modern ve akıllı kimya öğrenme platformu.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components/Providers";
import { AudioProvider } from "@/components/AudioProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <AudioProvider>
              {children}
            </AudioProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
