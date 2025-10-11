import React from "react";

export default function TableHeader() {
  const columns = [
    { label: "NOME", width: "w-80" },
    { label: "FREQUÊNCIA", width: "w-32" },
    { label: "ÚLTIMA EXECUÇÃO", width: "w-40" },
    { label: "PRÓXIMA", width: "w-40" },
    { label: "STATUS", width: "w-32" },
    { label: "AÇÕES", width: "w-32" },
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
