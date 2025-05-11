"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/common/Header";
import { CaseCard } from "@/components/ui/case_card";
import Image from "next/image";
import { Project, ProjectsResponse } from "@/types/project";

export default function MyPage() {
  // State for projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Completed cases data
  const completedCases = [
    {
      id: 1,
      title: "xxxxx",
    },
    {
      id: 2,
      title: "xxxxx",
    },
    {
      id: 3,
      title: "xxxxx",
    },
  ];

  // Helper function to format the date (remove time portion)
  const formatDate = (dateString: string) => {
    // Check if the date has a T separator for time
    if (dateString && dateString.includes("T")) {
      return dateString.split("T")[0]; // Return only the date part
    }

    // If the date contains time with colons
    if (dateString && dateString.includes(":")) {
      // Simple approach to extract just the date part (assumes format like "2025-04-27T00:00:00")
      return dateString.split(" ")[0]; // Return only the date part
    }

    return dateString; // Return as is if no time portion is detected
  };

  // Function to generate random date between Apr 20 to May 5 2025
  const getRandomRegistrationDate = () => {
    const start = new Date("2025-04-20").getTime();
    const end = new Date("2025-05-05").getTime();
    const randomDate = new Date(start + Math.random() * (end - start));
    return `2025-${(randomDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${randomDate.getDate().toString().padStart(2, "0")}`;
  };

  // Function to generate random recommend count between 1 and 10
  const getRandomRecommendCount = () => {
    return Math.floor(Math.random() * 10) + 1;
  };

  const ProjectInfo = ({
    project,
    displayNumber,
  }: {
    project: Project;
    displayNumber: number;
  }) => {
    // Generate random data for each project
    const registrationDate = getRandomRegistrationDate();
    const recommendCount = getRandomRecommendCount();

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 relative h-full">
        {displayNumber === 1 && (
          <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">
            2
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-bold mb-1">No.{displayNumber}</h3>
          <p className="text-lg font-medium">「{project.project_title}」</p>
        </div>

        <div className="mb-2">
          <span className="text-sm text-gray-600">事業者:</span>
          <span className="ml-2">{project.company_user_id}</span>
        </div>

        <div className="mb-2">
          <span className="text-sm text-gray-600">案件登録日:</span>
          <span className="ml-2">{registrationDate}</span>
        </div>

        <div className="mb-2">
          <span className="text-sm text-gray-600">募集期限:</span>
          <span className="ml-2">
            {formatDate(project.application_deadline)}
          </span>
        </div>

        <div className="mb-2">
          <span className="text-sm text-gray-600">予算:</span>
          <span className="ml-2">{project.budget}</span>
        </div>

        <div className="mb-4">
          <span className="text-sm text-gray-600">レコメンド数:</span>
          <span className="ml-2">{recommendCount}</span>
        </div>

        <button className="bg-gray-200 text-gray-700 px-4 py-1 rounded text-sm">
          研究者一覧
        </button>
      </div>
    );
  };

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Replace with your actual API URL
        const response = await fetch(
          "/api/filtered-projects?types_to_register=iac&preferred_researcher_level=教授&limit=6"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data: ProjectsResponse = await response.json();

        if (data.status === "success") {
          setProjects(data.projects);
        } else {
          throw new Error(data.status);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="マイページ" />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-10">マイページ</h1>

        {/* In-progress cases section (now with projects) */}
        <div className="mb-32">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Image
                src="/icons/bird1.png"
                width={24}
                height={24}
                alt="Bird icon"
                className="mr-2"
              />
              <h2 className="text-xl font-bold">進行中案件</h2>
            </div>
            <span className="text-lg font-bold">
              進行中案件 {loading ? "読み込み中..." : projects.length}
            </span>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center h-40">
              <div className="text-lg font-medium">案件を読み込み中...</div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex justify-center items-center h-40">
              <div className="text-lg font-medium text-red-500">
                エラーが発生しました: {error}
              </div>
            </div>
          )}

          {/* Projects grid with custom component */}
          {!loading && !error && (
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-6 w-full max-w-7xl">
                {projects.map((project, index) => (
                  <div
                    key={project.project_id}
                    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  >
                    <ProjectInfo
                      project={project}
                      displayNumber={index + 1} // Sequential numbers 1-6
                    />
                  </div>
                ))}

                {/* Show a message if no projects are available */}
                {projects.length === 0 && (
                  <div className="w-full text-center py-8">
                    <p className="text-lg text-gray-500">
                      該当する案件がありません。
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Completed cases section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Image
                src="/icons/bird1.png"
                width={24}
                height={24}
                alt="Bird icon"
                className="mr-2"
              />
              <h2 className="text-xl font-bold">終了案件</h2>
            </div>
            <span className="text-lg font-bold">
              終了案件 {completedCases.length}
            </span>
          </div>

          {/* Force centered grid with fixed width for each card */}
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-6 w-full max-w-7xl">
              {completedCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <CaseCard
                    number={caseItem.id}
                    title={caseItem.title}
                    isCompleted
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
