import React from "react";

export default function TableHeader({ columns }) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            className={`${column.width} px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
