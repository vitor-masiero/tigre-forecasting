import React from "react";

export default function QuickConfigButton({
  title,
  description,
  icon,
  primary,
}) {
  const getIcon = () => {
    switch (icon) {
      case "repeat":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        );
      case "alert":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
        );
      case "report":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
          </svg>
        );
      case "sync":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.5 13.5V7.5H6v8h8v-1.5M16.5 10.5V16.5H18v-8h-8v1.5" />
          </svg>
        );
      default:
        return null;
    }
  };

  const buttonClasses = primary
    ? "w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center gap-3 transition font-medium"
    : "w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg flex items-center gap-3 transition font-medium";

  return (
    <button className={buttonClasses}>
      {getIcon()}
      <div className="text-left flex-1">
        <div className={primary ? "text-white" : "text-gray-900"}>{title}</div>
        <div
          className={`text-xs ${primary ? "text-blue-100" : "text-gray-500"}`}
        >
          {description}
        </div>
      </div>
    </button>
  );
}
