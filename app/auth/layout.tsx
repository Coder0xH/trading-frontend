import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";

import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "用户认证 - 加密货币交易平台",
  description: "登录到加密货币交易平台，开始您的交易之旅",
};

export default function AuthLayout({
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
        <div className="relative flex min-h-screen flex-col">
          {/* 简单的品牌标识 */}
          <header className="absolute top-0 left-0 w-full p-4 z-10">
            <div className="container flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold">加</span>
                </div>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                  加密货币交易平台
                </span>
              </Link>
            </div>
          </header>
          
          <main className="flex-1">{children}</main>
          
          {/* 简单的页脚 */}
          <footer className="py-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} 加密货币交易平台 版权所有</p>
          </footer>
          
          <Toaster />
        </div>
      </body>
    </html>
  );
}
