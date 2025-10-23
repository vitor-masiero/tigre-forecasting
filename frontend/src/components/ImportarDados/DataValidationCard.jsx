import React from "react";

export default function DataValidationCard() {
  const validationRules = [
    "Validação de formato de datas",
    "Verificação de SKUs válidos",
    "Detecção de valores negativos",
    "Validação de colunas obrigatórias",
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Validação de Dados
      </h2>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Regras Ativas</h3>
            <ul className="space-y-1">
              {validationRules.map((rule, index) => (
                <li
                  key={index}
                  className="text-sm text-blue-800 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
