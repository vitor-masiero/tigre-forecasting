import React from "react";

export default function TableHeader() {
  const columns = [
    { label: "FONTE", width: "w-80" },
    { label: "TIPO", width: "w-32" },
    { label: "ÚLTIMA SYNC", width: "w-40" },
    { label: "REGISTROS", width: "w-32" },
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
