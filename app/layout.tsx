import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";
import { LayoutContent } from "@/components/layout/LayoutContent";

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
        "min-h-screen",
        "antialiased font-sans",
        inter.className
      )}>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
