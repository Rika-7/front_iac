import type React from "react";

interface CaseCardProps {
  number: number;
  title: string;
  registrationDate?: string;
  recommendCount?: string | number;
  hasNotification?: boolean;
  isCompleted?: boolean;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  number,
  title,
  registrationDate,
  recommendCount,
  hasNotification = false,
  isCompleted = false,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 relative h-full">
      {hasNotification && (
        <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">
          2
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-1">No.{number}</h3>
        <p className="text-lg font-medium">「{title}」</p>
      </div>

      {!isCompleted && (
        <>
          <div className="mb-2">
            <span className="text-sm text-gray-600">案件登録日</span>
            <span className="ml-2">{registrationDate}</span>
          </div>

          <div className="mb-4">
            <span className="text-sm text-gray-600">レコメンド数</span>
            <span className="ml-2">{recommendCount}</span>
          </div>
        </>
      )}

      <button className="bg-gray-200 text-gray-700 px-4 py-1 rounded text-sm">
        研究者一覧
      </button>
    </div>
  );
};
