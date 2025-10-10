import React from "react";
import TableHeader from "./TableHeader";

export default function DataTable({
  columns,
  rows,
  renderRow,
  title,
  actions,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      {title && (
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {actions && <div>{actions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader columns={columns} />
          <tbody className="divide-y divide-gray-100">
            {rows?.map((row, index) => renderRow(row, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
