import React from "react";

export default function TableHeader() {
  const columns = [
    { label: "DATA", width: "w-32" },
    { label: "NOME", width: "w-64" },
    { label: "MODELO", width: "w-32" },
    { label: "SKUS", width: "w-24" },
    { label: "WMAPE", width: "w-24" },
    { label: "STATUS", width: "w-32" },
    { label: "AÇÕES", width: "w-24" },
  ];

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
