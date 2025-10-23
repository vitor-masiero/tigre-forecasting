import React from "react";

export default function MonitoringCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Qualidade</h2>

      <div className="mb-8">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm font-medium text-gray-700">
            Qualidade dos Dados
          </span>
          <span className="text-3xl font-bold text-gray-900">98.7%</span>
        </div>
        <div className="text-xs text-emerald-600 font-medium mb-3">
          Excelente
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
              <span>Completude</span>
              <span>97%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "97%" }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
              <span>Integridade</span>
              <span>99%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full"
                style={{ width: "99%" }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
              <span>Atualização</span>
              <span>99.5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full"
                style={{ width: "99.5%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Monitoramento
        </h3>

        <div>
          <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
            <span>Uso de API</span>
            <span>78%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: "78%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
