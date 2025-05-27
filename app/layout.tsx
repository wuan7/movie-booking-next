import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { JotaiProvider } from "../components/JotaiProvider";
import HeaderWrapper from "../components/layout/HeaderWrapper";
import FooterWrapper from "../components/layout/FooterWrapper";
import ToastWrapper from "../components/ToastWrapper";
import Modals from "../components/Modals";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Đặt vé xem phim",
  description: "Website đặt vé xem phim",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <JotaiProvider>
          <SessionProvider>
            <Modals />
            <HeaderWrapper />
            <ToastWrapper />
            {children}
            <FooterWrapper />
          </SessionProvider>
        </JotaiProvider>
       
      </body>
    </html>
  );
}
