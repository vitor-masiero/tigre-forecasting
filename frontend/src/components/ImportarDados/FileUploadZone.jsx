import React from "react";

export default function FileUploadZone({ dragActive, handleDrag, handleDrop }) {
  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
        dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Arraste seus arquivos aqui
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Suporte para CSV, Excel (.xlsx, .xls) até 50MB
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition font-medium">
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
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-6 -2h6m0 0a1 1 0 00-1-1H9a1 1 0 00-1 1m6 0v2m0-2H9v2"
            />
          </svg>
          Selecionar Arquivos
        </button>
      </div>
    </div>
  );
}
