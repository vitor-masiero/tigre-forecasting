import React, { useState } from "react";
import FormField from "./FormField";
import ExternalFactors from "./ExternalFactors";

export default function ConfigurationCard() {
  const [formData, setFormData] = useState({
    periodoHistorico: "36",
    horizontePrevisao: "18",
    familiaProdutos: "todos",
    modeloPrevisao: "automatico",
    fatoresExternos: {
      dadosMarketing: true,
      dadosClimaticos: false,
      eventosSetoriais: false,
      sazonalidade: true,
      calendarioFeriados: false,
      indicadoresMacro: false,
    },
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFactorChange = (factor, checked) => {
    setFormData((prev) => ({
      ...prev,
      fatoresExternos: {
        ...prev.fatoresExternos,
        [factor]: checked,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Executando previsão com:", formData);
    // Aqui você implementaria a lógica de execução
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Configuração da Previsão
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <FormField
            label="Período Histórico"
            value={formData.periodoHistorico}
            onChange={(value) => handleChange("periodoHistorico", value)}
            options={[
              { value: "12", label: "12 meses" },
              { value: "24", label: "24 meses" },
              { value: "36", label: "36 meses" },
              { value: "48", label: "48 meses" },
            ]}
          />

          <FormField
            label="Horizonte de Previsão"
            value={formData.horizontePrevisao}
            onChange={(value) => handleChange("horizontePrevisao", value)}
            options={[
              { value: "3", label: "3 meses" },
              { value: "6", label: "6 meses" },
              { value: "12", label: "12 meses" },
              { value: "18", label: "18 meses" },
              { value: "24", label: "24 meses" },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <FormField
            label="Família de Produtos"
            value={formData.familiaProdutos}
            onChange={(value) => handleChange("familiaProdutos", value)}
            options={[
              { value: "todos", label: "Todos os SKUs" },
              { value: "categoria-a", label: "Categoria A" },
              { value: "categoria-b", label: "Categoria B" },
              { value: "categoria-c", label: "Categoria C" },
            ]}
          />

          <FormField
            label="Modelo de Previsão"
            value={formData.modeloPrevisao}
            onChange={(value) => handleChange("modeloPrevisao", value)}
            options={[
              { value: "automatico", label: "Automático (Melhor Fit)" },
              { value: "arima", label: "ARIMA" },
              { value: "prophet", label: "Prophet" },
              { value: "ensemble", label: "Ensemble" },
            ]}
          />
        </div>

        <ExternalFactors
          factors={formData.fatoresExternos}
          onChange={handleFactorChange}
        />

        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition font-medium"
        >
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
          Executar Previsão
        </button>
      </form>
    </div>
  );
}
