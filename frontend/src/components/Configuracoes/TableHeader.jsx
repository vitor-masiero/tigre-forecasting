import React from 'react';

export default function TableHeader() {
  const columns = [
    { label: 'Colaborador', width: '' },
    { label: 'E-mail', width: '' },
    { label: 'CPF', width: '' },
    { label: 'Cargo', width: '' },
    { label: 'Permissão', width: '' },
    { label: 'Última Atividade', width: '' },
    { label: 'Ações', width: 'w-20' }
  ];

  return (
    <thead className="bg-slate-50/80 border-b border-slate-100">
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            className={`${column.width} px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}