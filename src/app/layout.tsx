import type { Metadata, Viewport } from "next";
import { Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { DISPLAY_BOOT_SCRIPT } from "@/lib/display";
import { TabBar } from "@/components/tab-bar";
import { ServiceWorkerRegistration, OfflineIndicator, InstallPrompt } from "./pwa-components";

// 숫자·표지 글자 전용(라틴만, 수십 KB). 위험물 표지판의 좁고 굵은 글자와 같은 계열
const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "ChemGuard — 화학물질 사고 대응 플랫폼",
  description: "MSDS 기반 역할별 맞춤 화학물질 대응 정보 제공",
  // manifest 는 app/manifest.ts 가 자동으로 연결한다
  icons: { apple: "/icons/apple-touch-icon.png" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ChemGuard",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-theme·data-scale 은 첫 그림 전 스크립트가 붙이므로 서버 HTML 과 달라도 경고하지 않는다
    <html lang="ko" className={barlow.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: DISPLAY_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <TabBar offlineSlot={<OfflineIndicator />} />
        <ServiceWorkerRegistration />
        <InstallPrompt />
      </body>
    </html>
  );
}
