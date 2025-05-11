"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface FundingItem {
  amount: string;
  company: string;
  title: string;
  content: string;
  deadline: string;
  researcher_level: string;
  id: string;
}

export default function SearchCompanyProjects() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [deadlineRange, setDeadlineRange] = useState("");
  const [fundingItems, setFundingItems] = useState<FundingItem[]>([]);
  const [projectDetail, setProjectDetail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    router.push("/chat");
  };

  const searchProject = async () => {
    if (!keyword.trim() || !budgetRange.trim() || !deadlineRange.trim()) {
      alert("キーワード・予算・締切を全て入力してください");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/search_company_projects?keyword=${encodeURIComponent(
          keyword
        )}&budget_range=${budgetRange}&deadline_range=${deadlineRange}`
      );
      const data = await response.json();

      const projectsArray = data.projects || [];

      const mappedProjects = projectsArray.map(
        (p: {
          project_id: string;
          budget: string;
          company_name: string;
          project_title: string;
          project_content: string;
          application_deadline: string;
          preferred_researcher_level: string;
        }) => ({
          id: p.project_id,
          amount: p.budget,
          company: p.company_name,
          title: p.project_title,
          content: p.project_content,
          deadline: p.application_deadline,
          researcher_level: p.preferred_researcher_level,
        })
      );

      setFundingItems(mappedProjects);
    } catch (error) {
      console.error("エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
  };

  const formatAmount = (amount: string) => {
    const numeric = amount.replace(/[^\d]/g, "");
    return Number(numeric).toLocaleString() + "円";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="企業依頼案件" />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">企業からの依頼案件を検索</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Keyword Search */}
            <Card className="bg-gray-200">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">キーワード</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={20}
                  />
                  <Input
                    className="pl-10 bg-white"
                    placeholder="キーワードを入力"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Budget */}
            <Card className="bg-gray-200">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">予算</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Select
                    value={budgetRange}
                    onValueChange={(value) => setBudgetRange(value)}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="選択 ▼" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-md">
                      <SelectItem value="50万円〜">50万円〜</SelectItem>
                      <SelectItem value="100万円〜">100万円〜</SelectItem>
                      <SelectItem value="250万円〜">250万円〜</SelectItem>
                      <SelectItem value="500万円〜">500万円〜</SelectItem>
                      <SelectItem value="750万円〜">750万円〜</SelectItem>
                      <SelectItem value="1000万円以上">1000万円以上</SelectItem>
                      <SelectItem value="設定なし">設定なし</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Research Field */}
            <Card className="bg-gray-200">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">
                  <div className="flex items-center">
                    <span>研究</span>
                    <span>分野</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Select>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="選択 ▼" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-md">
                      <SelectItem value="humanities">人文・社会科学</SelectItem>
                      <SelectItem value="science">理学</SelectItem>
                      <SelectItem value="engineering">工学</SelectItem>
                      <SelectItem value="agriculture">
                        農学・環境科学
                      </SelectItem>
                      <SelectItem value="medicine">医学・歯学・薬学</SelectItem>
                      <SelectItem value="interdisciplinary">
                        複合領域・情報・デザイン
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Application Deadline */}
            <Card className="bg-gray-200">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">
                  <div className="flex items-center">
                    <span>募集</span>
                    <span>締切</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Select
                    value={deadlineRange}
                    onValueChange={(value) => setDeadlineRange(value)}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="選択 ▼" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-md">
                      <SelectItem value="7日以内">7日以内</SelectItem>
                      <SelectItem value="14日以内">14日以内</SelectItem>
                      <SelectItem value="30日以内">30日以内</SelectItem>
                      <SelectItem value="60日以内">60日以内</SelectItem>
                      <SelectItem value="90日以内">90日以内</SelectItem>
                      <SelectItem value="期限なし">期限なし</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              className="h-14 text-lg bg-slate-600 hover:bg-slate-700 w-[300px]"
              onClick={searchProject}
            >
              検索する
            </Button>
          </div>
        </div>

        {/* ▼ここがリアルタイムで結果が出るエリア */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">検索結果</h2>

          {isLoading ? (
            <div className="text-center text-gray-500 py-8">検索中です...</div>
          ) : fundingItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              検索条件を設定して検索ボタンを押してください
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
              <div className="grid grid-cols-10 bg-black text-white py-3 px-4">
                <div className="col-span-1 text-center">予算</div>
                <div className="col-span-1 text-center">募集期限</div>
                <div className="col-span-1 text-center">希望の階層</div>
                <div className="col-span-2 text-center">会社名</div>
                <div className="col-span-2 text-center">案件名</div>
                <div className="col-span-2 text-center">案件内容</div>
                <div className="col-span-1 text-center">連絡を取る</div>
              </div>

              {fundingItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-10 py-4 px-4 border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <div className="col-span-1 flex items-center justify-center">
                    {formatAmount(item.amount)}
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    {formatDate(item.deadline)}
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    {item.researcher_level}
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    {item.company}
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    {item.title}
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <button
                      className="bg-gray-600 hover:bg-gray-800 text-white px-4 py-1 rounded"
                      onClick={() => setProjectDetail(item.content)}
                    >
                      案件内容を確認する
                    </button>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      className="bg-gray-600 hover:bg-gray-800 text-white px-4 py-1 rounded"
                      onClick={handleSubmit}
                    >
                      連絡
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* モーダル表示 */}
        {projectDetail && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-gray-900/70"></div>
            <div className="relative z-50 flex items-center justify-center h-full">
              <div className="bg-white p-6 rounded shadow-lg max-w-md w-full mx-4">
                <h2 className="text-lg font-bold mb-4">案件内容</h2>
                <p className="mb-6">{projectDetail}</p>
                <div className="text-right">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                    onClick={() => setProjectDetail(null)}
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
