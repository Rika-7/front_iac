"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/common/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Component() {
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState("研究分野のヒアリング");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert("必須項目（タイトルと依頼詳細）を入力してください");
      return;
    }
  
    const confirmed = confirm("AIが最適な研究者を検索します。実行してよろしいですか？");
    if (!confirmed) return;
  
    setIsLoading(true);
  
    try {
      const response = await fetch("/api/project_registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedOption,
          title: title,
          description: description,
        }),
      });
  
      const data = await response.json();
      localStorage.setItem("recommendResults", JSON.stringify(data));
      router.push("/project_registration/recommend");
    } catch (error) {
      console.error("エラー:", error);
      alert("検索中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const industries = [
    { value: "自動車", label: "自動車" },
    { value: "精密機械", label: "精密機械" },
    { value: "機械", label: "機械" },
    { value: "化学", label: "化学" },
    { value: "食品", label: "食品" },
    { value: "建設", label: "建設" },
    { value: "サービス", label: "サービス" },
    { value: "その他", label: "その他" },
  ];

  const researchFields = [
    { value: "法学部", label: "法学部" },
    { value: "医学部", label: "医学部" },
    { value: "工学部", label: "工学部" },
    { value: "文学部", label: "文学部" },
    { value: "教育学部", label: "教育学部" },
    { value: "経済学部", label: "経済学部" },
    { value: "理学部", label: "理学部" },
    { value: "農学部", label: "農学部" },
    { value: "薬学部", label: "薬学部" },
    { value: "教養学部", label: "教養学部" },
    { value: "その他", label: "その他" },
  ];

  const researcherLevels = [
    { value: "教授", label: "教授" },
    { value: "准教授", label: "准教授" },
    { value: "講師", label: "講師" },
    { value: "助教", label: "助教" },
    { value: "ポスドク", label: "ポスドク" },
    { value: "博士課程", label: "博士課程" },
    { value: "修士課程", label: "修士課程" },
    { value: "学部生", label: "学部生" },
  ];

  const budget = [
    { value: "〜10万円", label: "〜10万円" },
    { value: "〜50万円", label: "〜50万円" },
    { value: "〜100万円", label: "〜100万円" },
    { value: "〜200万円", label: "〜200万円" },
    { value: "〜500万円", label: "〜500万円" },
    { value: "500万円〜", label: "500万円〜" },
  ];

  const deadline = [
    { value: "1ヶ月以内", label: "1ヶ月以内" },
    { value: "3ヶ月以内", label: "3ヶ月以内" },
    { value: "半年以内", label: "半年以内" },
    { value: "1年以内", label: "1年以内" },
    { value: "1年以上", label: "1年以上" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header currentPage="案件登録" />

      <div className="flex justify-center flex-grow">
        <div className="w-full max-w-3xl px-4 py-8">
          <h1 className="text-2xl font-normal mb-6">新規案件を登録する</h1>

          <div className="bg-gray-100 p-6 rounded">
            <div className="mb-6">
              <div className="flex items-start mb-2">
                <label className="text-sm">依頼のカテゴリ（必須項目）</label>
                <span className="text-red-500 ml-1">*</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="option1"
                    name="category"
                    className="w-4 h-4 text-blue-600"
                    checked={selectedOption === "研究分野のヒアリング"}
                    onChange={() => setSelectedOption("研究分野のヒアリング")}
                  />
                  <label htmlFor="option1" className="ml-2 text-sm">
                    研究分野のヒアリング
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="option2"
                    name="category"
                    className="w-4 h-4 text-blue-600"
                    checked={
                      selectedOption ===
                      "アドバイス・実務成果の相談（要打ち合わせ）"
                    }
                    onChange={() =>
                      setSelectedOption(
                        "アドバイス・実務成果の相談（要打ち合わせ）"
                      )
                    }
                  />
                  <label htmlFor="option2" className="ml-2 text-sm">
                    アドバイス・実務成果の相談（要打ち合わせ）
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="option3"
                    name="category"
                    className="w-4 h-4 text-blue-600"
                    checked={
                      selectedOption === "コンサルティング・実務研究の相談"
                    }
                    onChange={() =>
                      setSelectedOption("コンサルティング・実務研究の相談")
                    }
                  />
                  <label htmlFor="option3" className="ml-2 text-sm">
                    コンサルティング・実務研究の相談
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-start mb-2">
                <label htmlFor="title" className="text-sm">
                  案件のタイトル（必須項目）
                </label>
                <span className="text-red-500 ml-1">*</span>
              </div>
              <input
                type="text"
                id="title"
                className="w-full p-2 border border-gray-300 bg-white rounded"
                placeholder="タイトルを入力してください"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <div className="flex items-start mb-2">
                <label htmlFor="details" className="text-sm">
                  依頼詳細（必須項目）
                </label>
                <span className="text-red-500 ml-1">*</span>
              </div>
              <textarea
                id="details"
                className="w-full p-2 border border-gray-300 bg-white rounded h-32"
                placeholder="案件の背景を記載してください"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2">予算（任意）</label>
              <Select>
                <SelectTrigger className="w-full border-gray-300 bg-white">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  {budget.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2">
                依頼企業の業種（任意）
              </label>
              <Select>
                <SelectTrigger className="w-full border-gray-300 bg-white">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  {industries.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2">対象学部（任意）</label>
              <Select>
                <SelectTrigger className="w-full border-gray-300 bg-white">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  {researchFields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2">研究者階層（任意）</label>
              <Select>
                <SelectTrigger className="w-full border-gray-300 bg-white">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  {researcherLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2">納期（任意）</label>
              <Select>
                <SelectTrigger className="w-full border-gray-300 bg-white">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  {deadline.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className="px-10 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-700 active:bg-blue-800 transition-colors"
                onClick={handleSubmit}
              >
                検索する
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full mx-4">
            <p className="text-lg font-medium mb-4">AIが最適な研究者を検索しています</p>
            <div className="animate-pulse text-gray-600">少々お待ちください...</div>
          </div>
        </div>
      )}

    </div>
  );
}
