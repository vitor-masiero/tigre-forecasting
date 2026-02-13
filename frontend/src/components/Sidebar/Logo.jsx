import React from "react";
import { BarChart3 } from "lucide-react";

export default function Logo({ variant = "light" }) {
  const isDark = variant === "dark";
  
  return (
    <div className={`flex items-center gap-3 ${isDark ? '' : 'p-6 border-b border-gray-200'}`}>
      <div className={`p-2 rounded-xl ${isDark ? 'bg-brand-600/20' : 'bg-brand-50'}`}>
        <BarChart3 className={`w-6 h-6 ${isDark ? 'text-brand-400' : 'text-brand-600'}`} />
      </div>
      <div className="flex flex-col">
        <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Tigre Vision
        </span>
        <span className={`text-[10px] uppercase tracking-widest font-semibold ${isDark ? 'text-brand-400' : 'text-brand-600'}`}>
          Forecasting Pro
        </span>
      </div>
    </div>
  );
}
