import React from "react";
import HistoryTableHeader from "./HistoryTableHeader";
import HistoryTableRow from "./HistoryTableRow";

export default function ImportHistoryTable() {
  const imports = [
    {
      id: 1,
      filename: "vendas_setembro.xlsx",
      filesize: "2.4 MB",
      date: "05/09 14:30",
      records: "25.680",
      status: "Sucesso",
      fileIcon: "excel",
    },
    {
      id: 2,
      filename: "marketing_campaigns.csv",
      filesize: "1.1 MB",
      date: "04/09 09:15",
      records: "8.450",
      status: "Sucesso",
      fileIcon: "csv",
    },
    {
      id: 3,
      filename: "estoque_agosto.xlsx",
      filesize: "3.2 MB",
      date: "02/09 16:45",
      records: "12.340",
      status: "Com Erros",
      fileIcon: "excel",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Histórico de Importações
        </h2>
        <a
          href="#"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
        >
          Ver Todos
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <HistoryTableHeader />
          <tbody className="divide-y divide-gray-100">
            {imports.map((imp) => (
              <HistoryTableRow key={imp.id} {...imp} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
