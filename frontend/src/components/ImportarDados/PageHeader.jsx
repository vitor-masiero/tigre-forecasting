import React from "react";

export default function PageHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Importar Dados</h1>
          <p className="text-blue-100">
            Faça upload de arquivos e configure importações automáticas
          </p>
        </div>
      </div>
    </div>
  );
}
