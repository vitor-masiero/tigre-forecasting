import React from "react";

export default function PreviewCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Prévia da Configuração
      </h2>

      <div
        className="bg-gray-50 rounded-lg p-8 flex items-center justify-center"
        style={{ minHeight: "200px" }}
      >
        <div className="text-center text-gray-400">
          <svg
            className="w-16 h-16 mx-auto mb-3 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-sm font-medium">
            Prévia será exibida após configuração
          </p>
          <p className="text-xs mt-1">
            Configure os parâmetros acima para visualizar a prévia da previsão
          </p>
        </div>
      </div>
    </div>
  );
}
