import React from "react";

export default function MetricCard({
  title,
  value,
  icon: Icon,
  iconBg,
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
    </div>
  );
}
