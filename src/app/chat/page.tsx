"use client";
import React from "react";
import { Header } from "@/components/common/Header";

export default function ChatPage() {
  const messages = [
    { id: 1, from: "user", text: "来週の火曜日はご予定いかがでしょうか？" },
    { id: 2, from: "partner", text: "火曜の午前は大丈夫です！" },
    { id: 3, from: "user", text: "では10時でお願いします。" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="メッセージ" />

      <main className="max-w-[1400px] mx-auto py-6 px-4 flex gap-6">
        {/* 左サイド：案件概要 */}
        <aside className="w-1/5 bg-rose-100 p-4 rounded-md text-sm space-y-4">
          <div>
            <p className="text-xs font-bold">案件名</p>
            <p>AIを用いた画像診断に関する最新の知見</p>
          </div>
          <div>
            <p className="text-xs font-bold">案件説明</p>
            <p>
              AIを活用した画像診断に関して研究している教授と、
              医療系スタートアップとの共同開発案件です。
              既存のX線・MRI画像データを用いたアルゴリズム検証、
              法的・倫理的な検討を含めた協力が期待されています。
            </p>
          </div>
          <div>
            <p className="text-xs font-bold">予算</p>
            <p>100万円以内</p>
          </div>
          <div>
            <p className="text-xs font-bold">納期</p>
            <p>〜来月末</p>
          </div>
        </aside>

        {/* 中央：チャット画面 */}
        <section className="flex-1 bg-white border rounded-md p-4 flex flex-col justify-between min-h-[600px] max-h-[80vh]">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-xl max-w-[60%] ${
                    msg.from === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* 入力欄 */}
          <div className="mt-4 flex items-center border-t pt-2">
            <input
              type="text"
              placeholder="メッセージを入力"
              className="flex-1 p-2 border rounded-l-md"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition">
              ▶︎
            </button>
          </div>
        </section>

        {/* 右サイド：スケジュール（仮） */}
        <aside className="w-1/5 bg-rose-100 p-4 rounded-md text-xs">
          <h3 className="font-bold text-sm mb-2">2025/05</h3>
          <div className="space-y-1">
            <p>2week：日程調整</p>
            <p>3week：NDA締結・契約</p>
            <p>4week：研究室ヒアリング</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
