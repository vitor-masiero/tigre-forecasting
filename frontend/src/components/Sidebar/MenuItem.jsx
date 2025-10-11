import React from "react";

export default function MenuItem({ icon: Icon, label, active, onClick }) {
  const baseClasses =
    "flex items-center gap-3 px-3 py-2 rounded-lg transition cursor-pointer";
  const activeClasses = active
    ? "text-blue-600 bg-blue-50"
    : "text-gray-600 hover:bg-gray-50";

  const renderIcon = () => {
    if (typeof Icon === "string") {
      if (Icon === "edit") {
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        );
      }
      if (Icon === "refresh") {
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
      }
    }
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div onClick={onClick} className={`${baseClasses} ${activeClasses}`}>
      {renderIcon()}
      <span className={active ? "font-medium" : ""}>{label}</span>
    </div>
  );
}
