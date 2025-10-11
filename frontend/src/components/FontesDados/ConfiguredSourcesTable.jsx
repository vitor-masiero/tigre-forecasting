import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

export default function ConfiguredSourcesTable() {
  const sources = [
    {
      id: 1,
      name: "SAP ECC",
      description: "Dados de vendas",
      icon: "sap",
      type: "ERP",
      lastSync: "Há 15 min",
      records: "1.2M",
      status: "Ativo",
    },
    {
      id: 2,
      name: "OpenWeather API",
      description: "Dados climáticos",
      icon: "api",
      type: "API",
      lastSync: "Há 1 hora",
      records: "850K",
      status: "Ativo",
    },
    {
      id: 3,
      name: "Dados Marketing",
      description: "Campanhas e promoções",
      icon: "excel",
      type: "Excel",
      lastSync: "Há 2 dias",
      records: "25K",
      status: "Pendente",
    },
    {
      id: 4,
      name: "Calendário BR",
      description: "Feriados e eventos",
      icon: "api",
      type: "API",
      lastSync: "Há 12 horas",
      records: "2.5K",
      status: "Ativo",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">
          Fontes Configuradas
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody className="divide-y divide-gray-100">
            {sources.map((source) => (
              <TableRow key={source.id} {...source} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
