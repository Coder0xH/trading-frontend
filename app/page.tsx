import { CryptoPriceDisplay } from "@/components/CryptoPriceDisplay";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center">加密货币实时价格</h1>
        {/* 价格监控差价组件 */}
        <CryptoPriceDisplay />
      </main>
    </div>
  );
}
