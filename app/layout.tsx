import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "加密货币套利交易平台",
  description: "一个现代化的加密货币套利交易平台，支持多交易所、多链套利",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-gradient-to-b from-background/70 to-background bg-fixed",
        "antialiased font-sans",
        inter.className
      )}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 p-6 pt-20 md:p-8 md:pt-20">{children}</main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
