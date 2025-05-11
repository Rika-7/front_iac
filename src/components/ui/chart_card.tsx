import React from "react";
import { ResponsiveContainer } from "recharts";
import { ChartCardProps } from "@/types/dashboard";

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {React.isValidElement(children) ? (
            children
          ) : (
            <div className="text-center text-gray-400">No data available</div>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartCard;
