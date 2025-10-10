import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

export default function HistoryTable() {
  // Dados mockados - posteriormente virão de uma API
  const forecastData = [
    {
      id: 1,
      date: "05/09/2025",
      time: "08:30",
      name: "Previsão Q1 2025",
      details: "18 meses • Predial",
      model: "Prophet",
      skus: 156,
      wmape: "8.2%",
      status: "Concluído",
    },
    {
      id: 2,
      date: "03/09/2025",
      time: "14:15",
      name: "Análise Sazonal",
      details: "12 meses • Todos SKUs",
      model: "ARIMA",
      skus: 342,
      wmape: "12.4%",
      status: "Concluído",
    },
    {
      id: 3,
      date: "01/09/2025",
      time: "06:00",
      name: "Automação Mensal",
      details: "18 meses • Irrigação",
      model: "LSTM",
      skus: 89,
      wmape: "15.8%",
      status: "Revisão",
    },
    {
      id: 4,
      date: "28/08/2025",
      time: "20:45",
      name: "Teste A/B Modelos",
      details: "6 meses • Comparativo",
      model: "Multiple",
      skus: 50,
      wmape: "9.1%",
      status: "Concluído",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">
          Histórico de Execuções
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody className="divide-y divide-gray-100">
            {forecastData.map((forecast) => (
              <TableRow key={forecast.id} {...forecast} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação (placeholder) */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Mostrando <span className="font-medium">4</span> de{" "}
          <span className="font-medium">247</span> resultados
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            Anterior
          </button>
          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">
            1
          </button>
          <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            2
          </button>
          <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            3
          </button>
          <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
