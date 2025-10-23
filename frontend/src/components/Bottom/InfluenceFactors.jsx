import React from "react";
import ProgressBar from "./ProgressBar";

export default function InfluenceFactors() {
  const factors = [
    { label: "Sazonalidade", value: 85, color: "bg-blue-600" },
    { label: "Tendência", value: 72, color: "bg-emerald-600" },
    { label: "Marketing", value: 45, color: "bg-orange-500" },
    { label: "Externos", value: 28, color: "bg-purple-500" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Fatores Influentes
        </h3>
        <div className="bg-teal-500 p-2 rounded-lg">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        </div>
      </div>
      <div className="space-y-4">
        {factors.map((factor, index) => (
          <ProgressBar key={index} {...factor} />
        ))}
      </div>
    </div>
  );
}
