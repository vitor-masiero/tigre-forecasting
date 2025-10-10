import React from "react";

export default function FontesMetricCard({
  title,
  value,
  trend,
  trendPositive,
  icon,
  iconBg,
}) {
  const renderIcon = () => {
    switch (icon) {
      case "database":
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        );
      case "sync":
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M7.5 13.5V7.5H6v8h8v-1.5M16.5 10.5V16.5H18v-8h-8v1.5" />
          </svg>
        );
      case "storage":
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm font-medium text-gray-500 uppercase">
          {title}
        </div>
        <div className={`${iconBg} p-2 rounded-lg`}>{renderIcon()}</div>
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">{value}</div>
      <div
        className={`flex items-center gap-1 ${
          trendPositive === null ? "text-gray-600" : "text-emerald-600"
        }`}
      >
        {trendPositive && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {trendPositive === null && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        )}
        <span className="text-sm font-medium">{trend}</span>
      </div>
    </div>
  );
}
