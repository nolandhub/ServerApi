import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ActiveThemeProvider } from "@/components/dashboard/active-theme";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { LayoutProvider } from "@/hooks/use-layout"
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PROBUS Vé Xe Limousine",
  description: "Hệ thống quản lý chuyến xe trực tuyến",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="zalo-platform-site-verification" content="Kzk64xJmKpfltS05gEXlMdt8xqQHlZaHCp4s" />
        <meta property="og:title" content="Ứng dụng đặt vé PROBUS" />
        <meta property="og:description" content="Đặt vé xe khách nhanh chóng, tiện lợi ngay trên Zalo." />
        <meta property="og:image" content="https://serverapi-pi.vercel.app/Probus/greenProbus.png" />
        <meta httpEquiv="Content-Security-Policy"
          content="default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content:" />
        <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#007aff" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="icon" type="image/x-icon" href="/Probus/greenProbus.png"></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          <LayoutProvider>
            <NuqsAdapter>
              <ActiveThemeProvider>
                {children}
                <Toaster position="top-center" />
                <TailwindIndicator />
              </ActiveThemeProvider>
            </NuqsAdapter>
          </LayoutProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
