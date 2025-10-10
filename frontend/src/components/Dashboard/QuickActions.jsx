import React from "react";
import { Zap, Lightbulb } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Nova Previsão",
      description:
        "Gere previsões personalizadas com diferentes históricos temporais",
      icon: "edit",
      primary: true,
    },
    {
      title: "Automação",
      description: "Configure previsões automáticas recorrentes",
      icon: Zap,
      primary: false,
    },
    {
      title: "IA Insights",
      description:
        "Detectamos um padrão sazonal forte. Considere ajustar estratégia para Q4.",
      icon: Lightbulb,
      primary: false,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Ações Rápidas
      </h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <ActionButton key={index} {...action} />
        ))}
        <a
          href="#"
          className="text-blue-600 text-sm hover:underline block mt-2"
        >
          Ver Detalhes →
        </a>
      </div>
    </div>
  );
}

function ActionButton({ title, description, icon: Icon, primary }) {
  const buttonClasses = primary
    ? "w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center gap-3 transition"
    : "w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg flex items-center gap-3 transition";

  const renderIcon = () => {
    if (Icon === "edit") {
      return (
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
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      );
    }
    return <Icon className="w-5 h-5" />;
  };

  return (
    <button className={buttonClasses}>
      {renderIcon()}
      <div className="text-left flex-1">
        <div className="font-medium">{title}</div>
        <div
          className={`text-xs ${primary ? "text-blue-100" : "text-gray-500"}`}
        >
          {description}
        </div>
      </div>
    </button>
  );
}
