export interface IndustryAcademiaRow {
  月: string;
  特許出願件数: string;
  学部: string;
  学部別出願件数: string;
  契約件数: string;
  MTA: string;
  受託研究: string;
  共同研究: string;
  ライセンス: string;
  譲渡: string;
  その他: string;
  特許ライセンス件数: string;
  特許ライセンス収入: string;
}

export interface CompanyRow {
  月: string;
  企業名: string;
  業種: string;
  案件数: string;
  依頼キーワード: string;
  エリア: string;
}

export interface UniversityRow {
  月: string;
  研究者名: string;
  分野: string;
  希望予算: string;
  希望職位: string;
  アクセス数: string;
  マッチング数: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface WordCloudItem {
  text: string;
  value: number;
}

export interface CompanyMonthData {
  month: string;
  companies: number;
  cases: number;
}

export interface UniversityMonthData {
  month: string;
  researchers: number;
  access: number;
  match: number;
}

export interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}
