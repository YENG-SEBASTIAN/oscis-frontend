import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPIProps {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  delta?: string | number;
  deltaPositive?: boolean;
}

const KPI: React.FC<KPIProps> = ({ title, value, icon, delta, deltaPositive = true }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">{icon}</div>
    </div>
    {delta !== undefined && (
      <div className="flex items-center mt-4 text-sm">
        {deltaPositive ? (
          <TrendingUp className="text-green-600" size={16} />
        ) : (
          <TrendingDown className="text-red-600" size={16} />
        )}
        <span className={`${deltaPositive ? "text-green-600" : "text-red-600"} ml-1`}>{delta}%</span>
        <span className="text-gray-600 ml-2">from last month</span>
      </div>
    )}
  </div>
);

export default KPI;
