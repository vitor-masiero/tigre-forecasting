import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

export default function ConfigurationsTable() {
  const automations = [
    {
      id: 1,
      name: "Previsão Semanal Predial",
      details: "156 SKUs • Modelo Prophet",
      frequency: "Semanal",
      lastExecution: "05/09 08:00",
      nextExecution: "12/09 08:00",
      status: "Ativo",
    },
    {
      id: 2,
      name: "Relatório Mensal Executivo",
      details: "Todos os SKUs • Dashboard",
      frequency: "Mensal",
      lastExecution: "01/09 06:00",
      nextExecution: "01/10 06:00",
      status: "Ativo",
    },
    {
      id: 3,
      name: "Alertas de Desvio",
      details: "Monitoramento • Threshold 15%",
      frequency: "Diária",
      lastExecution: "04/09 23:59",
      nextExecution: "05/09 23:59",
      status: "Erro",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Automações Configuradas
        </h2>
        <a
          href="#"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
        >
          Ver Histórico
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody className="divide-y divide-gray-100">
            {automations.map((automation) => (
              <TableRow key={automation.id} {...automation} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
