"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";

interface Researcher {
  researcher_id: string;
  name: string;
  // nameReading: string;カナがインデックスにないので別途DBから取得が必要
  university: string;
  affiliation: string;
  position: string;
  research_field: string;
  keywords: string;
  explanation: string;
  score: number;
}

export default function ResearcherRecommendation() {
  const router = useRouter();
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [selectedResearchField, setSelectedResearchField] = useState<
    string | null
  >(null);
  const [recommendReason, setRecommendReason] = useState<string | null>(null);

  const handleSubmit = async () => {
    router.push("/message");
  };

  useEffect(() => {
    const stored = localStorage.getItem("recommendResults");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setResearchers(parsed);
        } else {
          console.warn("recommendResults is not an array:", parsed);
          setResearchers([]);
        }
      } catch (e) {
        console.error("JSON parse error:", e);
        setResearchers([]);
      }
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header currentPage="案件登録" />

      <main className="px-20 py-6 bg-gray-50 min-h-[calc(100vh_-_68px)] max-md:px-12 max-md:py-4 max-sm:p-4">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">推薦された研究者</h2>
            <div className="text-right">レコメンド数 {researchers.length}</div>
          </div>
        </header>

        <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
          <div className="grid grid-cols-11 bg-gray-200 py-2 px-4">
            <div className="col-span-2">名前</div>
            <div className="col-span-3">所属</div>
            <div className="col-span-2">職位</div>
            <div className="col-span-1 text-center">スコア</div>
            <div className="col-span-1 text-center">推薦理由</div>
            <div className="col-span-1 text-center">研究分野</div>
            <div className="col-span-1 text-center">連絡</div>
          </div>

          {researchers.map((researcher, index) => (
            <div
              key={researcher.researcher_id}
              className={`grid grid-cols-11 py-4 px-4 border-b border-gray-200 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-100"
              }`}
            >
              <div className="col-span-2">
                <div className="font-medium">{researcher.name}</div>
                {/*<div className="text-sm text-gray-600">{researcher.nameReading}</div>*/}
              </div>
              <div className="col-span-3">
                <div>{researcher.affiliation}</div>
                <div className="text-sm text-gray-600">
                  {researcher.university}
                </div>
              </div>
              <div className="col-span-2">{researcher.position}</div>
              <div className="col-span-1 text-center">
                {researcher.score.toFixed(2)}
              </div>

              <div className="col-span-1 text-center">
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white px-3 py-1 rounded"
                  onClick={() =>
                    setRecommendReason(researcher.explanation)
                  }
                >
                  表示
                </button>
              </div>

              <div className="col-span-1 text-center">
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white px-3 py-1 rounded"
                  onClick={() =>
                    setSelectedResearchField(researcher.research_field)
                  }
                >
                  表示
                </button>
              </div>
              <div className="col-span-1 text-center">
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white px-3 py-1 rounded"
                  onClick={handleSubmit}
                >
                  連絡
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {recommendReason && (
        <div className="fixed inset-0 z-50">
          {/* グレーの半透明オーバーレイ */}
          <div className="absolute inset-0 bg-gray-900/70"></div>

          {/* モーダル本体 */}
          <div className="relative z-50 flex items-center justify-center h-full">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full mx-4">
              <h2 className="text-lg font-bold mb-4">推薦理由</h2>
              <p className="mb-6">{recommendReason}</p>
              <div className="text-right">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                  onClick={() => setRecommendReason(null)}
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedResearchField && (
        <div className="fixed inset-0 z-50">
          {/* グレーの半透明オーバーレイ */}
          <div className="absolute inset-0 bg-gray-900/70"></div>

          {/* モーダル本体 */}
          <div className="relative z-50 flex items-center justify-center h-full">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full mx-4">
              <h2 className="text-lg font-bold mb-4">研究分野</h2>
              <p className="mb-6">{selectedResearchField}</p>
              <div className="text-right">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                  onClick={() => setSelectedResearchField(null)}
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
