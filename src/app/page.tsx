"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  const handleSubmit = async () => {
    router.push("/mypage");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">研Q</h1>
        <p className="text-lg">研究者と企業をつなぐプラットフォーム</p>
        <p className="text-lg">産学連携用プラットフォーム</p>
        <Button
          size="lg"
          className="h-14 text-lg bg-slate-600 hover:bg-slate-700 w-[300px]"
          onClick={handleSubmit}
        >
          ページに移動
        </Button>
      </main>
    </div>
  );
}
