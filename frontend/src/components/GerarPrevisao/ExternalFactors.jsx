import React from "react";
import CheckboxField from "./CheckboxField";

export default function ExternalFactors({ factors, onChange }) {
  const leftFactors = [
    { id: "dadosMarketing", label: "Dados de Marketing" },
    { id: "dadosClimaticos", label: "Dados Climáticos" },
    { id: "eventosSetoriais", label: "Eventos Setoriais" },
  ];

  const rightFactors = [
    { id: "sazonalidade", label: "Sazonalidade" },
    { id: "calendarioFeriados", label: "Calendário de Feriados" },
    { id: "indicadoresMacro", label: "Indicadores Macroeconômicos" },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        Fatores Externos
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          {leftFactors.map((factor) => (
            <CheckboxField
              key={factor.id}
              id={factor.id}
              label={factor.label}
              checked={factors[factor.id]}
              onChange={(checked) => onChange(factor.id, checked)}
            />
          ))}
        </div>
        <div className="space-y-3">
          {rightFactors.map((factor) => (
            <CheckboxField
              key={factor.id}
              id={factor.id}
              label={factor.label}
              checked={factors[factor.id]}
              onChange={(checked) => onChange(factor.id, checked)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
