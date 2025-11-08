import React from 'react';

export default function TableHeader() {
  const columns = [
    { label: 'NOME', width: 'w-64' },
    { label: 'E-MAIL', width: 'w-56' },
    { label: 'CPF', width: 'w-36' },
    { label: 'CARGO', width: 'w-44' },
    { label: 'TIPO', width: 'w-32' },
    { label: 'ÚLTIMO ACESSO', width: 'w-36' },
    { label: 'AÇÕES', width: 'w-24' }
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