import React from "react";

export default function SourceTypeButton({
  title,
  description,
  icon,
  primary,
}) {
  const getIcon = () => {
    switch (icon) {
      case "sap":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
          </svg>
        );
    }
  };

  const buttonClasses = primary
    ? "w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center gap-3 transition font-medium"
    : "w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg flex items-center gap-3 transition font-medium border border-gray-200";

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
