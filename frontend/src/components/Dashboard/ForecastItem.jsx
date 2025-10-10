import React from "react";

export default function ForecastItem({ title, details, time, status, isLast }) {
  const statusColor = status === "success" ? "bg-emerald-500" : "bg-orange-500";

  return (
    <div
      className={`flex items-start gap-3 ${
        !isLast ? "pb-4 border-b border-gray-100" : ""
      }`}
    >
      <div className={`w-2 h-2 ${statusColor} rounded-full mt-2`}></div>
      <div className="flex-1">
        <div className="font-medium text-gray-900 mb-1">{title}</div>
        <div className="text-xs text-gray-500 mb-2">{details}</div>
        <div className="text-xs text-gray-400">{time}</div>
      </div>
    </div>
  );
}
