"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Header } from "@/components/common/Header";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import WordCloud from "@/components/common/WordCloud";
// Import the types from our types folder
import {
  IndustryAcademiaRow,
  CompanyRow,
  UniversityRow,
  ChartData,
  WordCloudItem,
  CompanyMonthData,
  UniversityMonthData,
} from "@/types/dashboard";
// Import the ChartCard component from ui folder
import ChartCard from "@/components/ui/chart_card";

export default function DashboardPage() {
  const [dateFilter, setDateFilter] = useState({
    start: "2025-01",
    end: "2028-12",
  });

  const [iaRaw, setIaRaw] = useState<IndustryAcademiaRow[]>([]);
  const [companyRaw, setCompanyRaw] = useState<CompanyRow[]>([]);
  const [universityRaw, setUniversityRaw] = useState<UniversityRow[]>([]);

  const [patents, setPatents] = useState<{ month: string; value: number }[]>(
    []
  );
  const [contracts, setContracts] = useState<
    { month: string; value: number }[]
  >([]);
  const [faculties, setFaculties] = useState<ChartData[]>([]);
  const [contractBreakdown, setContractBreakdown] = useState<ChartData[]>([]);
  const [licenseCounts, setLicenseCounts] = useState<
    { month: string; value: number }[]
  >([]);
  const [licenseRevenue, setLicenseRevenue] = useState<
    { month: string; value: number }[]
  >([]);

  const [companyData, setCompanyData] = useState<CompanyMonthData[]>([]);
  const [industryDist, setIndustryDist] = useState<ChartData[]>([]);
  const [topCompanies, setTopCompanies] = useState<ChartData[]>([]);
  const [areaDist, setAreaDist] = useState<ChartData[]>([]);
  const [keywordData, setKeywordData] = useState<WordCloudItem[]>([]);

  const [universityData, setUniversityData] = useState<UniversityMonthData[]>(
    []
  );
  const [fieldDist, setFieldDist] = useState<ChartData[]>([]);
  const [budgetHist, setBudgetHist] = useState<ChartData[]>([]);
  const [positionRank, setPositionRank] = useState<ChartData[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/data/industry_academia_dataset.csv").then((res) => res.text()),
      fetch("/data/company_data.csv").then((res) => res.text()),
      fetch("/data/university_data.csv").then((res) => res.text()),
    ]).then(([iaText, companyText, universityText]) => {
      setIaRaw(
        Papa.parse<IndustryAcademiaRow>(iaText, {
          header: true,
          skipEmptyLines: true,
        }).data
      );
      setCompanyRaw(
        Papa.parse<CompanyRow>(companyText, {
          header: true,
          skipEmptyLines: true,
        }).data
      );
      setUniversityRaw(
        Papa.parse<UniversityRow>(universityText, {
          header: true,
          skipEmptyLines: true,
        }).data
      );
    });
  }, []);

  useEffect(() => {
    if (!iaRaw.length) return;

    // Move isInRange inside useEffect to fix the dependency warning
    const isInRange = (month: string) =>
      month >= dateFilter.start && month <= dateFilter.end;

    const filteredIa = iaRaw.filter((row) => isInRange(row["月"]));

    const sum = (arr: IndustryAcademiaRow[], key: keyof IndustryAcademiaRow) =>
      arr.reduce((acc, cur) => acc + parseInt(cur[key] || "0", 10), 0);

    setPatents(
      filteredIa.map((row) => ({
        month: row["月"],
        value: parseInt(row["特許出願件数"] || "0", 10),
      }))
    );
    const facultyMap: Record<string, number> = {};
    filteredIa.forEach((row) => {
      facultyMap[row["学部"]] =
        (facultyMap[row["学部"]] || 0) +
        parseInt(row["学部別出願件数"] || "0", 10);
    });
    setFaculties(
      Object.entries(facultyMap).map(([name, value]) => ({ name, value }))
    );
    setContracts(
      filteredIa.map((row) => ({
        month: row["月"],
        value: parseInt(row["契約件数"] || "0", 10),
      }))
    );
    setContractBreakdown(
      ["MTA", "受託研究", "共同研究", "ライセンス", "譲渡", "その他"].map(
        (name) => ({
          name,
          value: sum(filteredIa, name as keyof IndustryAcademiaRow),
        })
      )
    );
    setLicenseCounts(
      filteredIa.map((row) => ({
        month: row["月"],
        value: parseInt(row["特許ライセンス件数"] || "0", 10),
      }))
    );
    setLicenseRevenue(
      filteredIa.map((row) => ({
        month: row["月"],
        value: parseInt(row["特許ライセンス収入"] || "0", 10),
      }))
    );
  }, [iaRaw, dateFilter]);

  useEffect(() => {
    // Move isInRange inside useEffect to fix the dependency warning
    const isInRange = (month: string) =>
      month >= dateFilter.start && month <= dateFilter.end;

    const filteredCompany = companyRaw.filter((row) => isInRange(row["月"]));
    const companyMonthMap: Record<
      string,
      { companies: Set<string>; cases: number }
    > = {};

    filteredCompany.forEach((row) => {
      const month = row["月"];
      if (!companyMonthMap[month]) {
        companyMonthMap[month] = { companies: new Set(), cases: 0 };
      }
      companyMonthMap[month].companies.add(row["企業名"]);
      companyMonthMap[month].cases += parseInt(row["案件数"] || "0", 10);
    });

    setCompanyData(
      Object.entries(companyMonthMap).map(([month, data]) => ({
        month,
        companies: data.companies.size,
        cases: data.cases,
      }))
    );

    const formatGrouped = <T,>(
      rows: T[],
      key: keyof T,
      countField: keyof T
    ): ChartData[] => {
      const map: Record<string, number> = {};
      rows.forEach((row) => {
        const keyVal = String(row[key]);
        const count = parseInt(String(row[countField] || "0"), 10);
        map[keyVal] = (map[keyVal] || 0) + count;
      });
      return Object.entries(map).map(([name, value]) => ({ name, value }));
    };

    setIndustryDist(formatGrouped(filteredCompany, "業種", "案件数"));
    setTopCompanies(
      formatGrouped(filteredCompany, "企業名", "案件数")
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
    );
    setAreaDist(formatGrouped(filteredCompany, "エリア", "案件数"));

    const keywordMap: Record<string, number> = {};
    filteredCompany.forEach((row) => {
      const keyword = row["依頼キーワード"];
      if (keyword) keywordMap[keyword] = (keywordMap[keyword] || 0) + 1;
    });
    setKeywordData(
      Object.entries(keywordMap).map(([text, value]) => ({ text, value }))
    );
  }, [companyRaw, dateFilter]);

  useEffect(() => {
    // Move isInRange inside useEffect to fix the dependency warning
    const isInRange = (month: string) =>
      month >= dateFilter.start && month <= dateFilter.end;

    const filteredUniversity = universityRaw.filter((row) =>
      isInRange(row["月"])
    );
    const universityMonthMap: Record<
      string,
      { researchers: Set<string>; access: number; match: number }
    > = {};

    filteredUniversity.forEach((row) => {
      const month = row["月"];
      if (!universityMonthMap[month]) {
        universityMonthMap[month] = {
          researchers: new Set(),
          access: 0,
          match: 0,
        };
      }
      universityMonthMap[month].researchers.add(row["研究者名"]);
      universityMonthMap[month].access += parseInt(
        row["アクセス数"] || "0",
        10
      );
      universityMonthMap[month].match += parseInt(
        row["マッチング数"] || "0",
        10
      );
    });

    setUniversityData(
      Object.entries(universityMonthMap).map(([month, data]) => ({
        month,
        researchers: data.researchers.size,
        access: data.access,
        match: data.match,
      }))
    );

    const formatGrouped = <T,>(
      rows: T[],
      key: keyof T,
      countField: keyof T
    ): ChartData[] => {
      const map: Record<string, number> = {};
      rows.forEach((row) => {
        const keyVal = String(row[key]);
        const count = parseInt(String(row[countField] || "0"), 10);
        map[keyVal] = (map[keyVal] || 0) + count;
      });
      return Object.entries(map).map(([name, value]) => ({ name, value }));
    };

    setFieldDist(formatGrouped(filteredUniversity, "分野", "アクセス数"));

    const budgetMap: Record<string, number> = {};
    filteredUniversity.forEach((row) => {
      const budget = parseInt(row["希望予算"] || "0", 10);
      const bin = Math.floor(budget / 100) * 100;
      const label = `${bin}万円`;
      budgetMap[label] = (budgetMap[label] || 0) + 1;
    });
    setBudgetHist(
      Object.entries(budgetMap).map(([name, value]) => ({ name, value }))
    );
    setPositionRank(
      formatGrouped(filteredUniversity, "希望職位", "アクセス数").sort(
        (a, b) => b.value - a.value
      )
    );
  }, [universityRaw, dateFilter]);

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="ダッシュボード" />
      <main className="container mx-auto p-6 space-y-10">
        {/* フィルターUI */}
        <div className="flex justify-end gap-4">
          <label className="text-sm font-medium">
            開始月:
            <input
              type="month"
              value={dateFilter.start}
              min="2000-01"
              max="2050-12"
              onChange={(e) =>
                setDateFilter({ ...dateFilter, start: e.target.value })
              }
              className="ml-2 border px-2 py-1 rounded"
            />
          </label>
          <label className="text-sm font-medium">
            終了月:
            <input
              type="month"
              value={dateFilter.end}
              min="2000-01"
              max="2050-12"
              onChange={(e) =>
                setDateFilter({ ...dateFilter, end: e.target.value })
              }
              className="ml-2 border px-2 py-1 rounded"
            />
          </label>
        </div>

        <div className="text-sm text-gray-500 mb-8">
          現在の期間フィルタ: {dateFilter.start} ～ {dateFilter.end}
        </div>
        <div className="flex justify-end gap-4 mt-2">
  <a
    href="/data/industry_academia_dataset.csv"
    download
    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
  >

産学連携データCSV
  </a>
  <a
    href="/data/company_data.csv"
    download
    className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
  >
    企業データCSV
  </a>
  <a
    href="/data/university_data.csv"
    download
    className="bg-purple-500 hover:bg-purple-600 text-white text-sm px-4 py-2 rounded"
  >
    大学データCSV
  </a>
</div>

        <h2 className="text-2xl font-bold mb-4">産学連携データ</h2>
        <div className="grid grid-cols-2 gap-6">
          <ChartCard title="特許出願件数推移">
            <BarChart
              data={patents.filter(
                (item) =>
                  item.month >= dateFilter.start && item.month <= dateFilter.end
              )}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="特許出願件数" />
            </BarChart>
          </ChartCard>

          <ChartCard title="学部別出願件数">
            <BarChart data={faculties} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ChartCard>

          <ChartCard title="契約件数推移">
            <BarChart
              data={contracts.filter(
                (item) =>
                  item.month >= dateFilter.start && item.month <= dateFilter.end
              )}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#ffc658" name="契約件数" />
            </BarChart>
          </ChartCard>

          <ChartCard title="契約数内訳">
            <PieChart>
              <Pie
                data={contractBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {contractBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      [
                        "#0088FE",
                        "#00C49F",
                        "#FFBB28",
                        "#FF8042",
                        "#8884d8",
                        "#FF69B4",
                      ][index % 6]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartCard>

          <ChartCard title="特許ライセンス件数推移">
            <BarChart
              data={licenseCounts.filter(
                (item) =>
                  item.month >= dateFilter.start && item.month <= dateFilter.end
              )}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#00C49F" name="特許ライセンス件数" />
            </BarChart>
          </ChartCard>

          <ChartCard title="特許ライセンス収入推移">
            <LineChart data={licenseRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#FF8042" />
            </LineChart>
          </ChartCard>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">企業データ</h2>
        <div className="grid grid-cols-2 gap-6">
          <ChartCard title="登録企業数の推移">
            <LineChart data={companyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="companies" stroke="#8884d8" />
            </LineChart>
          </ChartCard>

          <ChartCard title="登録案件数の推移">
            <BarChart data={companyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cases" fill="#82ca9d" />
            </BarChart>
          </ChartCard>

          <ChartCard title="業種別案件分布">
            <BarChart data={industryDist} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#ffc658" />
            </BarChart>
          </ChartCard>

          <ChartCard title="依頼企業ランキング（件数順）">
            <BarChart data={topCompanies} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ChartCard>

          <ChartCard title="エリア別依頼企業の分布">
            <PieChart>
              <Pie
                data={areaDist}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {areaDist.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"][
                        index % 5
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartCard>

          <ChartCard title="依頼キーワードトレンド">
            {keywordData.length > 0 ? (
              <WordCloud
                words={keywordData}
                width={300}
                height={250}
                fontSize={16}
              />
            ) : (
              <div className="text-center text-gray-500 pt-12">
                データを読み込み中...
              </div>
            )}
          </ChartCard>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">大学内データ</h2>
        <div className="grid grid-cols-2 gap-6">
          <ChartCard title="登録研究者数の推移">
            <LineChart data={universityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="researchers" stroke="#8884d8" />
            </LineChart>
          </ChartCard>

          <ChartCard title="アクセス数推移">
            <LineChart data={universityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="access" stroke="#82ca9d" />
            </LineChart>
          </ChartCard>

          <ChartCard title="マッチング数推移">
            <BarChart data={universityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="match" fill="#ffc658" />
            </BarChart>
          </ChartCard>

          <ChartCard title="分野別研究者数">
            <BarChart data={fieldDist} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ChartCard>

          <ChartCard title="希望予算の分布">
            <BarChart data={budgetHist} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ChartCard>

          <ChartCard title="希望職位ランキング">
            <BarChart data={positionRank} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#ffc658" />
            </BarChart>
          </ChartCard>
        </div>
      </main>
    </div>
  );
}
