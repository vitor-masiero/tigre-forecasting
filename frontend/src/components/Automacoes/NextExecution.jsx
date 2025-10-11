import React from "react";

export default function NextExecution() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm font-medium text-gray-500 uppercase">
          Próxima Execução
        </div>
        <div className="bg-orange-500 p-2 rounded-lg">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11.99 5V1h-1v4H9.01V1H8v4H7c-1.1 0-2 .9-2 2v3h20V7c0-1.1-.9-2-2-2h-1V1h-1v4h-2V1h-1v4h-2V1zm12 6H5v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V11z" />
          </svg>
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">2h 15m</div>
      <div className="flex items-center gap-2 text-gray-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
        </svg>
        <span className="text-sm font-medium">Agendado</span>
      </div>
    </div>
  );
}
