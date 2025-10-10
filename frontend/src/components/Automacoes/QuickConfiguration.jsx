import React from "react";
import QuickConfigButton from "./QuickConfigButton";

export default function QuickConfiguration() {
  const options = [
    {
      title: "Previsão Recorrente",
      description: "Configure previsões que se repetem automaticamente",
      icon: "repeat",
      primary: true,
    },
    {
      title: "Alertas de Desvio",
      description: "Receba notificações quando há desvios significativos",
      icon: "alert",
    },
    {
      title: "Relatório Automático",
      description: "Gere e distribua relatórios automaticamente",
      icon: "report",
    },
    {
      title: "Sincronização de Dados",
      description: "Sincronize dados automaticamente com sistemas externos",
      icon: "sync",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Configuração Rápida
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <QuickConfigButton key={index} {...option} />
        ))}
      </div>
    </div>
  );
}
