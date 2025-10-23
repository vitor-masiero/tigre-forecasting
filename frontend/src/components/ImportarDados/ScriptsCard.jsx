import React from "react";
import AutomationScript from "./AutomationScript";

export default function ScriptsCard() {
  const scripts = [
    {
      title: "Script Excel/CSV",
      description:
        "Configure um script para importação automática de planilhas de um diretório específico",
      icon: "excel",
      buttonText: "Configurar Script",
    },
    {
      title: "Conexão SQL",
      description:
        "Configure uma conexão direta com banco de dados para sincronização automática",
      icon: "database",
      buttonText: "Configurar Conexão",
    },
    {
      title: "Agendamento",
      description:
        "Configure horários específicos para execução automática de importações",
      icon: "calendar",
      buttonText: "Configurar Horários",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Scripts de Automação
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Configure importações recorrentes
      </p>

      <div className="space-y-3">
        {scripts.map((script, index) => (
          <AutomationScript key={index} {...script} />
        ))}
      </div>
    </div>
  );
}
