import React from "react";

export default function PageHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Fontes de Dados</h1>
          <p className="text-blue-100">Gerencie conexões e fontes de dados</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nova Fonte
          </button>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
