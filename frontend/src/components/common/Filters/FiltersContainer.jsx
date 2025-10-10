import React from "react";

export default function FiltersContainer({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
      {title && (
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      )}
      {subtitle && <p className="text-sm text-gray-500 mb-6">{subtitle}</p>}
      <div className="grid grid-cols-4 gap-4">{children}</div>
    </div>
  );
}
