import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "KimyaLAB | Moleküler Öğrenme Deneyimi",
  description: "Yapay zeka destekli, ultra-modern kimya eğitim platformu.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components/Providers";
import { AudioProvider } from "@/components/AudioProvider";
import Navbar from "@/components/Navbar";

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
              <div className="flex flex-col min-h-screen">
                <div className="h-24 md:h-28 relative z-[100] grid place-items-center">
                  <Navbar />
                </div>
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </AudioProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
