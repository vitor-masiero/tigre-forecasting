import React from "react";

export default function MetricCard({
  title,
  value,
  trend,
  trendPositive,
  icon: Icon,
  iconBg,
  trendIcon,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm font-medium text-gray-500 uppercase">
          {title}
        </div>
        <div className={`${iconBg} p-2 rounded-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">{value}</div>
      <div
        className={`flex items-center gap-1 ${
          trendPositive === null ? "text-gray-600" : "text-emerald-600"
        }`}
      >
        {trendIcon === "play" ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          trendPositive && (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          )
        )}
        <span className="text-sm font-medium">{trend}</span>
      </div>
    </div>
  );
}
