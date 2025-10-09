import React from "react";
import { BarChart3 } from "lucide-react";

export default function ModelPrecision() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Precisão do Modelo
        </h3>
        <div className="bg-teal-500 p-2 rounded-lg">
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
      </div>
      <div
        className="bg-gray-50 rounded-lg p-8 flex items-center justify-center"
        style={{ height: "180px" }}
      >
        <div className="text-center text-gray-400">
          <p className="text-sm">
            Gráfico de Precisão Histórica (WMAPE, FVA, Bias)
          </p>
        </div>
      </div>
    </div>
  );
}
