import React from "react";
import SourceTypeButton from "./SourceTypeButton";

export default function SourceTypesCard() {
  const sourceTypes = [
    {
      title: "Conexão SAP",
      description: "Integre com ERP SAP",
      icon: "sap",
      primary: true,
    },
    {
      title: "API Externa",
      description: "Conecte via API REST",
    },
    {
      title: "Arquivo (CSV/Excel)",
      description: "Importe arquivos",
    },
    {
      title: "Banco de Dados",
      description: "Conecte direto ao banco",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Tipos de Fonte
      </h2>

      <div className="space-y-3">
        {sourceTypes.map((type, index) => (
          <SourceTypeButton key={index} {...type} />
        ))}
      </div>
    </div>
  );
}
