import React from "react";
import { BarChart3 } from "lucide-react";

export default function SalesChart() {
  return (
    <div className="col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Previsão de Vendas
          </h3>
          <p className="text-sm text-gray-500">
            Histórico + Previsão + Intervalo de Confiança
          </p>
        </div>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>18 meses</option>
          <option>12 meses</option>
          <option>6 meses</option>
        </select>
      </div>
      <div
        className="bg-gray-50 rounded-lg p-8 flex items-center justify-center"
        style={{ height: "280px" }}
      >
        <div className="text-center text-gray-400">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            Gráfico de Previsão Interativo - Clique para expandir
          </p>
        </div>
      </div>
    </div>
  );
}
