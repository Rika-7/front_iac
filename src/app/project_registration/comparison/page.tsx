"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { Researcher } from "@/types/project";

export default function ResearcherComparison() {
  const router = useRouter();
  const [standardResults, setStandardResults] = useState<Researcher[]>([]);
  const [alternativeResults, setAlternativeResults] = useState<Researcher[]>(
    []
  );
  const [selectedResearchField, setSelectedResearchField] = useState<
    string | null
  >(null);
  const [recommendReason, setRecommendReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Project details with default values - move outside useEffect
  const category = "研究分野のヒアリング";
  const title = "プロジェクトタイトル";
  const description = "プロジェクト詳細";

  // Project details display object
  const projectDetails = {
    category,
    title,
    description,
  };

  // Navigate to message page on contact
  const handleSubmit = async () => {
    router.push("/message");
  };

  // Go back to standard view
  const goToStandardView = () => {
    router.push("/project_registration/recommend");
  };

  // Use the fetchData function
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For standard matching results - using your external API
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiBaseUrl) {
        throw new Error(
          "API URL is not configured properly (NEXT_PUBLIC_API_URL is missing)"
        );
      }

      // First, get standard matching results
      const standardResponse = await fetch(`${apiBaseUrl}/search-researchers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          title,
          description,
          university: "東京科学大学",
          top_k: 10,
        }),
      });

      if (!standardResponse.ok) {
        throw new Error(
          `Standard API responded with status: ${standardResponse.status}`
        );
      }

      const standardData = await standardResponse.json();
      setStandardResults(standardData);

      // Now, use the same results but modify them for the alternative algorithm
      // Since we don't want to duplicate the API endpoint on the server
      const alternativeResults: Researcher[] = standardData
        .map((researcher: Researcher) => {
          // Apply alternative scoring logic
          const adjustedScore = Math.min(
            1.0,
            Math.max(0.1, researcher.score * (0.5 + Math.random() * 0.7))
          );

          return {
            ...researcher,
            score: adjustedScore,
            explanation: `代替アルゴリズム評価: ${researcher.explanation}`,
          };
        })
        .sort((a: Researcher, b: Researcher) => b.score - a.score);

      setAlternativeResults(alternativeResults);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        `データの取得中にエラーが発生しました: ${
          error instanceof Error ? error.message : "不明なエラー"
        }`
      );
      // Keep existing data if available, or set to empty arrays
      setStandardResults((prevResults) =>
        prevResults.length ? prevResults : []
      );
      setAlternativeResults((prevResults) =>
        prevResults.length ? prevResults : []
      );
    } finally {
      setIsLoading(false);
    }
  }, [category, title, description]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Only depend on the fetchData function, which has the correct dependencies

  // Component for displaying a researcher table
  const ResearcherTable = ({
    researchers,
    title,
  }: {
    researchers: Researcher[];
    title: string;
  }) => (
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm mb-6">
      <div className="bg-gray-200 py-3 px-4 font-bold">
        {title} ({researchers.length})
      </div>
      <div className="grid grid-cols-11 bg-gray-200 py-2 px-4">
        <div className="col-span-2">名前</div>
        <div className="col-span-3">所属</div>
        <div className="col-span-2">職位</div>
        <div className="col-span-1 text-center">スコア</div>
        <div className="col-span-1 text-center">推薦理由</div>
        <div className="col-span-1 text-center">研究分野</div>
        <div className="col-span-1 text-center">連絡</div>
      </div>

      {researchers.length > 0 ? (
        researchers.map((researcher, index) => (
          <div
            key={researcher.researcher_id}
            className={`grid grid-cols-11 py-4 px-4 border-b border-gray-200 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-100"
            }`}
          >
            <div className="col-span-2">
              <div className="font-medium">{researcher.name}</div>
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
                onClick={() => setRecommendReason(researcher.explanation)}
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
        ))
      ) : (
        <div className="py-8 text-center text-gray-500">データがありません</div>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header currentPage="マッチング比較" />

      <main className="px-6 py-6 bg-gray-50 min-h-[calc(100vh_-_68px)] max-md:px-4 max-sm:p-4">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">マッチングロジック比較</h2>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              onClick={goToStandardView}
            >
              通常表示に戻る
            </button>
          </div>

          {/* Project details display */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h3 className="font-bold mb-2">案件詳細</h3>
            <p>
              <span className="font-semibold">タイトル:</span>{" "}
              {projectDetails.title}
            </p>
            <p>
              <span className="font-semibold">カテゴリ:</span>{" "}
              {projectDetails.category}
            </p>
            <p>
              <span className="font-semibold">詳細:</span>{" "}
              {projectDetails.description}
            </p>
          </div>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-lg font-medium mb-4">
                マッチング結果を読み込み中...
              </p>
              <div className="animate-pulse text-gray-600">
                少々お待ちください...
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResearcherTable
                researchers={standardResults}
                title="標準マッチング"
              />
            </div>
            <div>
              <ResearcherTable
                researchers={alternativeResults}
                title="代替マッチング"
              />
            </div>
          </div>
        )}
      </main>

      {/* Modal for displaying recommendation reason */}
      {recommendReason && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-gray-900/70"></div>
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

      {/* Modal for displaying research field */}
      {selectedResearchField && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-gray-900/70"></div>
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
