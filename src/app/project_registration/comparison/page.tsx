"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { Researcher } from "@/types/project";

// Add types for API response (what the API actually returns)
interface ApiResearcher {
  researcher_id: string;
  name: string;
  name_alphabet: string;
  affiliation: string;
  university: string;
  position: string;
  score: number;
  explanation: string;
  research_field: string;
  keywords?: string;
  [key: string]: unknown; // Allow additional fields
}

// Add types for pattern results
interface PatternResult {
  results: ApiResearcher[];
  search_time: number;
  pattern: string;
  pattern_description: string;
}

interface ComparisonResponse {
  pattern_a: PatternResult;
  pattern_b: PatternResult;
  pattern_c: PatternResult;
  total_comparison_time: number;
}

// Type for database researcher info
interface DatabaseResearcher {
  researcher_id: string;
  name: string;
  name_kana: string;
  name_alphabet: string;
  affiliation_current: string;
  position_current: string;
}

// Type for project data from localStorage
interface ProjectData {
  category: string;
  title: string;
  description: string;
}

export default function ResearcherComparison() {
  const router = useRouter();
  const [patternAResults, setPatternAResults] = useState<Researcher[]>([]);
  const [patternBResults, setPatternBResults] = useState<Researcher[]>([]);
  const [patternCResults, setPatternCResults] = useState<Researcher[]>([]);
  const [selectedResearchField, setSelectedResearchField] = useState<
    string | null
  >(null);
  const [recommendReason, setRecommendReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for project details - KEEP DEFAULTS as fallback
  const [projectDetails, setProjectDetails] = useState<ProjectData>({
    category: "研究のアドバイス",
    title: "AI技術の教育応用",
    description: "教育分野でのAI技術活用について専門家の意見を求めたい",
  });

  // Add a ref to prevent multiple API calls
  const hasCalledApi = useRef(false);

  const handleSubmit = async () => {
    router.push("/message");
  };

  const goToStandardView = () => {
    router.push("/project_registration/recommend");
  };

  // Function to load project data from localStorage - MINIMAL CHANGE: Use stored data when available, fallback to defaults
  const loadProjectData = useCallback(() => {
    try {
      // Try to get data from localStorage
      const savedData = localStorage.getItem("recommendResults");
      if (savedData) {
        const parsedData = JSON.parse(savedData);

        // Check if the data contains the project details
        if (parsedData.category && parsedData.title && parsedData.description) {
          setProjectDetails({
            category: parsedData.category,
            title: parsedData.title,
            description: parsedData.description,
          });
          console.log("✅ Project data loaded from localStorage:", parsedData);
          return true;
        }
      }

      // MINIMAL CHANGE: Keep using defaults when no data found
      console.log("⚠️ No project data found in localStorage, using defaults");
      setProjectDetails({
        category: "研究のアドバイス",
        title: "AI技術の教育応用",
        description: "教育分野でのAI技術活用について専門家の意見を求めたい",
      });
      return false;
    } catch (error) {
      console.error("❌ Error loading project data from localStorage:", error);
      // Also set defaults on error
      setProjectDetails({
        category: "研究のアドバイス",
        title: "AI技術の教育応用",
        description: "教育分野でのAI技術活用について専門家の意見を求めたい",
      });
      return false;
    }
  }, []);

  // Function to fetch researcher names from the database
  const fetchResearcherNames = async (
    researcherIds: string[]
  ): Promise<Record<string, DatabaseResearcher>> => {
    console.log("=== FETCHING RESEARCHER NAMES FROM DATABASE ===");
    console.log("Researcher IDs to fetch:", researcherIds);

    try {
      // Try batch endpoint first
      const batchResponse = await fetch("/api/researchers/batch-names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ researcher_ids: researcherIds }),
      });

      if (batchResponse.ok) {
        const batchData = await batchResponse.json();
        console.log("Batch response:", batchData);

        if (batchData.status === "success" && batchData.researchers) {
          console.log("✅ Successfully fetched names via batch endpoint");
          return batchData.researchers;
        }
      }

      console.log("❌ Batch endpoint failed, trying individual calls...");

      // Fallback to individual calls
      const namePromises = researcherIds.map(async (id) => {
        try {
          const response = await fetch(`/api/researchers/${id}`);
          if (response.ok) {
            const data = await response.json();
            if (data.status === "success" && data.researcher) {
              return {
                [id]: {
                  researcher_id: id,
                  name: data.researcher.name || `研究者ID: ${id}`,
                  name_kana: data.researcher.name_kana || "",
                  name_alphabet: data.researcher.name_alphabet || "",
                  affiliation_current:
                    data.researcher.affiliation_current || "",
                  position_current: data.researcher.position_current || "",
                },
              };
            }
          }
        } catch (error) {
          console.error(`Error fetching researcher ${id}:`, error);
        }

        // Return placeholder if individual call fails
        return {
          [id]: {
            researcher_id: id,
            name: `研究者ID: ${id}`,
            name_kana: "",
            name_alphabet: "",
            affiliation_current: "",
            position_current: "",
          },
        };
      });

      const nameResults = await Promise.all(namePromises);
      const nameMap = Object.assign({}, ...nameResults);

      console.log("✅ Individual calls completed:", nameMap);
      return nameMap;
    } catch (error) {
      console.error("❌ Error fetching researcher names:", error);

      // Return placeholder data for all IDs
      const placeholderMap: Record<string, DatabaseResearcher> = {};
      researcherIds.forEach((id) => {
        placeholderMap[id] = {
          researcher_id: id,
          name: `研究者ID: ${id}`,
          name_kana: "",
          name_alphabet: "",
          affiliation_current: "",
          position_current: "",
        };
      });
      return placeholderMap;
    }
  };

  // Helper function to merge search results with database names
  const mergeWithDatabaseNames = (
    searchResults: ApiResearcher[],
    nameMap: Record<string, DatabaseResearcher>
  ): Researcher[] => {
    return searchResults.map((researcher) => {
      const dbInfo = nameMap[researcher.researcher_id];

      console.log(`Merging data for ${researcher.researcher_id}:`, {
        searchResult: researcher,
        dbInfo: dbInfo,
      });

      return {
        researcher_id: researcher.researcher_id,
        name: dbInfo?.name || `研究者ID: ${researcher.researcher_id}`,
        name_alphabet: dbInfo?.name_kana || dbInfo?.name_alphabet || "", // Use name_kana as the secondary name
        affiliation: dbInfo?.affiliation_current || researcher.affiliation,
        university: researcher.university,
        position: dbInfo?.position_current || researcher.position,
        score: researcher.score,
        explanation: researcher.explanation,
        research_field: researcher.research_field,
        keywords:
          typeof researcher.keywords === "string" ? researcher.keywords : "",
      };
    });
  };

  // Main data fetching function
  const fetchData = useCallback(async () => {
    // Prevent multiple calls
    if (hasCalledApi.current) {
      console.log("API call already in progress or completed, skipping...");
      return;
    }

    hasCalledApi.current = true;
    setIsLoading(true);
    setError(null);

    try {
      console.log("=== STARTING FETCHDATA ===");
      console.log("Using project details:", projectDetails);

      // Step 1: Get pattern comparison results
      console.log("=== CALLING /api/compare_patterns ===");
      const response = await fetch("/api/compare_patterns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: projectDetails.category,
          title: projectDetails.title,
          description: projectDetails.description,
          university: "東京科学大学",
          top_k: 10,
        }),
      });

      console.log("Compare_patterns response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Compare patterns API error:", errorText);
        throw new Error(
          `API responded with status: ${response.status}. Details: ${errorText}`
        );
      }

      const comparisonData: ComparisonResponse = await response.json();
      console.log("✅ COMPARISON DATA RECEIVED");

      // Step 2: Extract all unique researcher IDs
      const allResearchers = [
        ...comparisonData.pattern_a.results,
        ...comparisonData.pattern_b.results,
        ...comparisonData.pattern_c.results,
      ];

      const uniqueResearcherIds = [
        ...new Set(allResearchers.map((r) => r.researcher_id)),
      ];
      console.log("Unique researcher IDs:", uniqueResearcherIds);

      // Step 3: Fetch researcher names from database
      const nameMap = await fetchResearcherNames(uniqueResearcherIds);
      console.log("Final name map:", nameMap);

      // Step 4: Merge search results with database names
      const patternAWithNames = mergeWithDatabaseNames(
        comparisonData.pattern_a.results,
        nameMap
      );
      const patternBWithNames = mergeWithDatabaseNames(
        comparisonData.pattern_b.results,
        nameMap
      );
      const patternCWithNames = mergeWithDatabaseNames(
        comparisonData.pattern_c.results,
        nameMap
      );

      // Step 5: Set the final results
      setPatternAResults(patternAWithNames);
      setPatternBResults(patternBWithNames);
      setPatternCResults(patternCWithNames);

      console.log("✅ ALL PATTERNS SET SUCCESSFULLY WITH NAMES");
    } catch (error) {
      console.error("❌ ERROR IN FETCHDATA:", error);
      setError(
        `データの取得中にエラーが発生しました: ${
          error instanceof Error ? error.message : "不明なエラー"
        }`
      );
      setPatternAResults([]);
      setPatternBResults([]);
      setPatternCResults([]);
      // Reset the flag on error so user can retry
      hasCalledApi.current = false;
    } finally {
      setIsLoading(false);
    }
  }, [projectDetails]);

  // Load project data when component mounts
  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  // Fetch data when project details change
  useEffect(() => {
    // Only fetch if we have valid project details
    if (
      projectDetails.category &&
      projectDetails.title &&
      projectDetails.description
    ) {
      fetchData();
    }
  }, [fetchData, projectDetails]);

  // Add a retry function for failed requests
  const retryFetch = () => {
    hasCalledApi.current = false;
    fetchData();
  };

  // Component for displaying a researcher table
  const ResearcherTable = ({
    researchers,
    title,
    patternId,
  }: {
    researchers: Researcher[];
    title: string;
    patternId: string;
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
            key={`${patternId}-${researcher.researcher_id}-${index}`}
            className={`grid grid-cols-11 py-4 px-4 border-b border-gray-200 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-100"
            }`}
          >
            <div className="col-span-2">
              {/* Display Japanese name as main */}
              <div className="font-medium">
                {researcher.name || `研究者ID: ${researcher.researcher_id}`}
              </div>
              {/* Display kana name as secondary */}
              {researcher.name_alphabet && (
                <div className="text-sm text-gray-600">
                  {researcher.name_alphabet}
                </div>
              )}
              <div className="text-xs text-gray-500">
                ID: {researcher.researcher_id}
              </div>
            </div>
            <div className="col-span-3">
              <div>{researcher.affiliation}</div>
              <div className="text-sm text-gray-600">
                {researcher.university}
              </div>
            </div>
            <div className="col-span-2">{researcher.position}</div>
            <div className="col-span-1 text-center">
              {researcher.score.toFixed(3)}
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
      <Header currentPage="パターン比較" />

      <main className="px-6 py-6 bg-gray-50 min-h-[calc(100vh_-_68px)] max-md:px-4 max-sm:p-4">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">パターン比較</h2>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              onClick={goToStandardView}
            >
              通常表示に戻る
            </button>
          </div>

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
            <button
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              onClick={retryFetch}
            >
              再試行
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-lg font-medium mb-4">
                パターン比較を実行中...
              </p>
              <div className="animate-pulse text-gray-600">
                少々お待ちください...
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <ResearcherTable
                researchers={patternAResults}
                title="Pattern A"
                patternId="pattern-a"
              />
            </div>
            <div>
              <ResearcherTable
                researchers={patternBResults}
                title="Pattern B"
                patternId="pattern-b"
              />
            </div>
            <div>
              <ResearcherTable
                researchers={patternCResults}
                title="Pattern C"
                patternId="pattern-c"
              />
            </div>
          </div>
        )}
      </main>

      {/* Existing modals remain the same */}
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
